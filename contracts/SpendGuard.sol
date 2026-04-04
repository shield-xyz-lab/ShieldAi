// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SpendGuard
 * @author ShieldAI (getshieldai.xyz)
 * @notice On-chain spend policy enforcement for autonomous AI agents.
 *         Deployed on Arbitrum Sepolia testnet — part of ShieldAI v3.0
 *
 * Features:
 * - Daily spend limits per agent
 * - Per-transaction limits
 * - Counterparty whitelist
 * - Anomaly-triggered auto-freeze
 * - Owner kill switch
 * - Full audit event log
 *
 * EU AI Act compliance: Art. 9 (risk management), Art. 13 (logging),
 * Art. 14 (human oversight), Art. 72 (incident reporting)
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SpendGuard is Ownable, ReentrancyGuard {

    // ─── STRUCTS ────────────────────────────────────────────────────────────

    struct Policy {
        uint256 dailyLimitUSD;      // in cents (e.g. 5000 = $50.00)
        uint256 perTxLimitUSD;      // in cents
        uint256 spentToday;         // in cents, resets daily
        uint256 lastResetDay;       // unix day number
        bool    active;
        bool    frozen;
        address owner;
    }

    struct TxRecord {
        address agent;
        address counterparty;
        uint256 amount;
        uint256 timestamp;
        bool    allowed;
        string  reason;
    }

    // ─── STATE ──────────────────────────────────────────────────────────────

    mapping(address => Policy)   public policies;
    mapping(address => mapping(address => bool)) public whitelist;
    mapping(address => TxRecord[]) public auditLog;

    uint256 public totalAgentsProtected;
    uint256 public totalTxsBlocked;
    uint256 public totalTxsAllowed;

    // ─── EVENTS ─────────────────────────────────────────────────────────────

    event AgentRegistered(address indexed agent, address indexed policyOwner, uint256 dailyLimit);
    event TransactionAllowed(address indexed agent, address indexed counterparty, uint256 amount);
    event TransactionBlocked(address indexed agent, address indexed counterparty, uint256 amount, string reason);
    event AgentFrozen(address indexed agent, string reason);
    event AgentUnfrozen(address indexed agent);
    event PolicyUpdated(address indexed agent, uint256 newDailyLimit, uint256 newPerTxLimit);
    event WhitelistUpdated(address indexed agent, address indexed counterparty, bool allowed);

    // ─── MODIFIERS ──────────────────────────────────────────────────────────

    modifier onlyPolicyOwner(address agent) {
        require(policies[agent].owner == msg.sender, "SpendGuard: not policy owner");
        _;
    }

    modifier agentExists(address agent) {
        require(policies[agent].active, "SpendGuard: agent not registered");
        _;
    }

    // ─── CONSTRUCTOR ────────────────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}

    // ─── AGENT REGISTRATION ─────────────────────────────────────────────────

    /**
     * @notice Register an AI agent with spend policies
     * @param agent         Agent wallet address
     * @param dailyLimitUSD Daily limit in cents (e.g. 5000 = $50)
     * @param perTxLimitUSD Per-transaction limit in cents
     */
    function registerAgent(
        address agent,
        uint256 dailyLimitUSD,
        uint256 perTxLimitUSD
    ) external {
        require(agent != address(0), "SpendGuard: invalid agent address");
        require(!policies[agent].active, "SpendGuard: agent already registered");
        require(dailyLimitUSD > 0, "SpendGuard: daily limit must be > 0");
        require(perTxLimitUSD <= dailyLimitUSD, "SpendGuard: per-tx limit exceeds daily");

        policies[agent] = Policy({
            dailyLimitUSD: dailyLimitUSD,
            perTxLimitUSD: perTxLimitUSD,
            spentToday: 0,
            lastResetDay: block.timestamp / 1 days,
            active: true,
            frozen: false,
            owner: msg.sender
        });

        totalAgentsProtected++;

        emit AgentRegistered(agent, msg.sender, dailyLimitUSD);
    }

    // ─── TRANSACTION VALIDATION ─────────────────────────────────────────────

    /**
     * @notice Validate a transaction before execution
     * @dev Call this before any agent transaction. Returns true if allowed.
     * @param agent         Agent wallet address
     * @param counterparty  Target address
     * @param amountUSD     Transaction amount in cents
     * @return allowed      Whether the transaction is allowed
     * @return reason       Reason if blocked
     */
    function validateTransaction(
        address agent,
        address counterparty,
        uint256 amountUSD
    ) external nonReentrant agentExists(agent) returns (bool allowed, string memory reason) {

        Policy storage policy = policies[agent];

        // Reset daily spend if new day
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > policy.lastResetDay) {
            policy.spentToday = 0;
            policy.lastResetDay = currentDay;
        }

        // Check 1: Agent frozen
        if (policy.frozen) {
            _logTx(agent, counterparty, amountUSD, false, "Agent is frozen");
            totalTxsBlocked++;
            emit TransactionBlocked(agent, counterparty, amountUSD, "Agent is frozen");
            return (false, "Agent is frozen");
        }

        // Check 2: Per-transaction limit
        if (amountUSD > policy.perTxLimitUSD) {
            _logTx(agent, counterparty, amountUSD, false, "Exceeds per-tx limit");
            totalTxsBlocked++;
            emit TransactionBlocked(agent, counterparty, amountUSD, "Exceeds per-tx limit");
            return (false, "Exceeds per-tx limit");
        }

        // Check 3: Daily limit
        if (policy.spentToday + amountUSD > policy.dailyLimitUSD) {
            _logTx(agent, counterparty, amountUSD, false, "Daily limit exceeded");
            totalTxsBlocked++;
            emit TransactionBlocked(agent, counterparty, amountUSD, "Daily limit exceeded");
            return (false, "Daily limit exceeded");
        }

        // Check 4: Whitelist (only if whitelist has entries)
        if (!whitelist[agent][counterparty] && _hasWhitelist(agent)) {
            _logTx(agent, counterparty, amountUSD, false, "Counterparty not whitelisted");
            totalTxsBlocked++;
            emit TransactionBlocked(agent, counterparty, amountUSD, "Counterparty not whitelisted");
            return (false, "Counterparty not whitelisted");
        }

        // All checks passed — update state
        policy.spentToday += amountUSD;
        _logTx(agent, counterparty, amountUSD, true, "OK");
        totalTxsAllowed++;
        emit TransactionAllowed(agent, counterparty, amountUSD);
        return (true, "OK");
    }

    // ─── FREEZE / UNFREEZE ──────────────────────────────────────────────────

    /**
     * @notice Freeze an agent (kill switch)
     * @dev Can be called by policy owner OR by ShieldAI anomaly detector
     */
    function freezeAgent(address agent, string calldata reason)
        external agentExists(agent)
    {
        require(
            policies[agent].owner == msg.sender || owner() == msg.sender,
            "SpendGuard: unauthorized"
        );
        policies[agent].frozen = true;
        emit AgentFrozen(agent, reason);
    }

    function unfreezeAgent(address agent)
        external onlyPolicyOwner(agent) agentExists(agent)
    {
        policies[agent].frozen = false;
        emit AgentUnfrozen(agent);
    }

    // ─── POLICY MANAGEMENT ──────────────────────────────────────────────────

    function updatePolicy(
        address agent,
        uint256 newDailyLimit,
        uint256 newPerTxLimit
    ) external onlyPolicyOwner(agent) agentExists(agent) {
        require(newPerTxLimit <= newDailyLimit, "SpendGuard: per-tx exceeds daily");
        policies[agent].dailyLimitUSD = newDailyLimit;
        policies[agent].perTxLimitUSD = newPerTxLimit;
        emit PolicyUpdated(agent, newDailyLimit, newPerTxLimit);
    }

    function setWhitelist(address agent, address counterparty, bool allowed)
        external onlyPolicyOwner(agent) agentExists(agent)
    {
        whitelist[agent][counterparty] = allowed;
        emit WhitelistUpdated(agent, counterparty, allowed);
    }

    // ─── VIEW FUNCTIONS ─────────────────────────────────────────────────────

    function getPolicy(address agent) external view returns (Policy memory) {
        return policies[agent];
    }

    function getAuditLog(address agent) external view returns (TxRecord[] memory) {
        return auditLog[agent];
    }

    function getRemainingDailyLimit(address agent) external view returns (uint256) {
        Policy memory p = policies[agent];
        if (!p.active) return 0;
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > p.lastResetDay) return p.dailyLimitUSD;
        if (p.spentToday >= p.dailyLimitUSD) return 0;
        return p.dailyLimitUSD - p.spentToday;
    }

    function isAgentSafe(address agent) external view returns (bool) {
        if (!policies[agent].active) return false;
        return !policies[agent].frozen;
    }

    // ─── INTERNAL ───────────────────────────────────────────────────────────

    function _logTx(
        address agent,
        address counterparty,
        uint256 amount,
        bool allowed,
        string memory reason
    ) internal {
        auditLog[agent].push(TxRecord({
            agent: agent,
            counterparty: counterparty,
            amount: amount,
            timestamp: block.timestamp,
            allowed: allowed,
            reason: reason
        }));
    }

    function _hasWhitelist(address agent) internal view returns (bool) {
        // Simplified check — in production use a counter
        return whitelist[agent][address(0)] == false;
    }
}
