[README (3).md](https://github.com/user-attachments/files/26573642/README.3.md)
# 🛡️ ShieldAI — AI Agent Security Layer

> **$45M+ lost to AI agent exploits in Q1 2026. ShieldAI is the fix.**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Network](https://img.shields.io/badge/Network-Mantle-purple.svg)](https://mantle.xyz)
[![Status](https://img.shields.io/badge/Status-MVP%20Live-brightgreen.svg)](https://getshieldai.xyz)
[![Layers](https://img.shields.io/badge/Layers-13%2F13%20Complete-brightgreen.svg)](https://shield-xyz-lab.github.io/ShieldAi/dashboard.html)
[![SDK](https://img.shields.io/badge/npm-@shieldai--xyz%2Fsdk-red.svg)](https://www.npmjs.com/package/@shieldai-xyz/sdk)

ShieldAI is the **first multi-layer runtime security platform** for autonomous AI agents operating in crypto and DeFi environments.

Unlike code auditors (pre-deployment) or wallets (custody), ShieldAI enforces security **at runtime** — while the agent is executing.

---

## 🚨 The Problem

In Q1 2026, over **$45M** was lost to AI agent exploits:

- **Step Finance** — $27.3M drained via compromised AI agent permissions
- **Resolv Labs** — $25M+ via AWS KMS key compromise affecting AI-managed funds
- **OpenClaw** — $250K lost due to AI parsing error exploited by attackers
- **250,000+ daily active AI agents** on-chain (↑400% YoY)

Traditional security tools were built for deterministic code. They don't understand **semantic intent**, can't detect **prompt injection**, and have no concept of **behavioral drift** in an AI agent context.

**ShieldAI was built specifically for this gap.**

---

## ✅ The Solution — 13 Security Layers

| Layer | Name | Function | Threat Covered |
|-------|------|----------|----------------|
| L0 | MCP Gateway | Intercepts all MCP tool calls before execution | Data exfiltration, unknown servers, tool poisoning |
| L1 | Input Firewall | Scans all external data entering the agent | Prompt injection, hidden text, unicode spoofing |
| L2 | Memory Protection | Cryptographic hash chain for agent memory | Memory poisoning, rule injection, history tampering |
| L3 | Intent Checker | Claude API semantic analysis of agent actions | Scope creep, behavioral inconsistency, social engineering |
| L4 | TX Guardian | Pre-chain transaction simulation and validation | Wallet drainers, honeypots, scam addresses |
| L5 | Agent Watchdog | Behavioral baseline + anomaly detection | Behavioral drift, burst attacks, off-hours activity |
| L6 | Human Gate | Hardware-attested biometric authorization | High-value transactions ($10K+), critical operations |
| L7 | Rate Limiter | Per-agent transaction rate enforcement | Flood attacks, rapid drain attempts |
| L8 | Whitelist Engine | Dynamic counterparty whitelisting | Unauthorized recipients, new addresses |
| L9 | Freeze Circuit | Emergency agent freeze mechanism | Active exploits, anomalous behavior patterns |
| L10 | SpendGuard | On-chain spend limit enforcement (Solidity) | Overspend, daily limit breaches |
| L11 | EU AI Act Logger | Compliance logging for Articles 9,13,14,15,17,72 | Regulatory non-compliance, audit failures |
| L12 | Audit Trail | Immutable on-chain event log | Tamper attempts, accountability gaps |

---

## 🎮 Interactive Demos

Every layer has a live browser demo — no installation required:

| Layer | Demo | Description |
|-------|------|-------------|
| L0 MCP Gateway | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer0.html) | Intercept and inspect MCP tool calls in real-time |
| L1 Input Firewall | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer1.html) | Test 13 prompt injection detection patterns |
| L2 Memory Protection | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer2.html) | Simulate memory poisoning attacks and defenses |
| L3 Intent Checker | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer3.html) | AI-powered semantic intent analysis (live Claude API) |
| L4 TX Guardian | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer4.html) | Simulate transaction validation and drainer detection |
| L5 Agent Watchdog | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer5.html) | Behavioral anomaly scoring and auto-freeze |
| L6 Human Gate | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer6.html) | Mobile biometric authorization flow |
| L7 Rate Limiter | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer7.html) | Real-time rate limiting simulation |
| L8 Whitelist Engine | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer8.html) | Dynamic whitelist management |
| L9 Freeze Circuit | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer9.html) | Emergency freeze and recovery flow |
| L10 SpendGuard | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer10.html) | On-chain spend limit enforcement |
| L11 EU AI Act | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer11.html) | Compliance report generator |
| L12 Audit Trail | [→ Demo](https://shield-xyz-lab.github.io/ShieldAi/shieldai-layer12.html) | Immutable on-chain audit log |

**[→ Main Dashboard](https://shield-xyz-lab.github.io/ShieldAi/dashboard.html)**

---

## 🚀 Deployments

| Contract | Network | Address | Explorer |
|----------|---------|---------|---------|
| SpendGuard.sol | Mantle Sepolia Testnet | `0x7f875B92c772C48281a901C4BF32b53d6329fadC` | [View ↗](https://sepolia.mantlescan.xyz/address/0x7f875B92c772C48281a901C4BF32b53d6329fadC) |
| SpendGuard.sol | Arbitrum One (Mainnet) | `0xE03C389DF391549E44c2aa807576c9eE2956C2d8` | [View ↗](https://arbiscan.io/address/0xE03C389DF391549E44c2aa807576c9eE2956C2d8) |

---

## 📦 SDK

```bash
npm install @shieldai-xyz/sdk
```

```typescript
import { ShieldAI } from '@shieldai-xyz/sdk';

const shield = new ShieldAI({
  contractAddress: '0x7f875B92c772C48281a901C4BF32b53d6329fadC',
  network: 'mantle-sepolia'
});

const result = await shield.checkSpend({
  agent: agentAddress,
  amount: transactionAmount,
  token: 'USDC'
});

if (!result.allowed) {
  console.log('Blocked:', result.reason);
}
```

---

## ⚖️ EU AI Act Compliance

ShieldAI's **L11 EU AI Act Logger** is our primary differentiator — **no direct competitors** exist in this space.

Covers Articles: **9** · **13** · **14** · **15** · **17** · **72**

---

## 🏆 Competitive Positioning

| | ShieldAI | Claw Wallet | Octane |
|--|---------|-------------|--------|
| Runtime monitoring | ✅ | ❌ | ❌ |
| Spend enforcement on-chain | ✅ | ⚠️ custody only | ❌ |
| EU AI Act compliance | ✅ | ❌ | ❌ |
| 13-layer architecture | ✅ | ❌ | ❌ |
| Code auditing | ❌ | ❌ | ✅ |

---

## 🌐 Links

- **Dashboard:** [shield-xyz-lab.github.io/ShieldAi/dashboard.html](https://shield-xyz-lab.github.io/ShieldAi/dashboard.html)
- **Twitter/X:** [@ShieldAI2026](https://twitter.com/ShieldAI2026)
- **npm SDK:** [@shieldai-xyz/sdk](https://www.npmjs.com/package/@shieldai-xyz/sdk)
- **Donate:** [Giveth ↗](https://giveth.io/project/shieldai-ai-agent-security-monitoring-layer)

---

## 📄 License

MIT — Built by [ShieldAI Lab](https://github.com/shield-xyz-lab)
