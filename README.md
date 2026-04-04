  [README.md](https://github.com/user-attachments/files/...)
# ShieldAI 🛡️
## 🔴 [LIVE DASHBOARD →](https://getshieldai.xyz/dashboard.html)
> **Before your AI agent spends your money, someone should be watching.**

[![npm](https://img.shields.io/npm/v/@shieldai-xyz/sdk?label=npm&color=blue)](https://www.npmjs.com/package/@shieldai-xyz/sdk)
[![Contract](https://img.shields.io/badge/Arbitrum-verified-%230B4FFF)](https://arbiscan.io/address/0xE03C389DF391549E44c2aa807576c9eE2956C2d8)
[![Dashboard](https://img.shields.io/badge/Dashboard-live-%2310B981)](https://getshieldai.xyz/dashboard.html)
[![Giveth](https://img.shields.io/badge/Giveth-support-%23E1458D)](https://giveth.io/project/shieldai-ai-agent-security-monitoring-layer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Twitter](https://img.shields.io/badge/Twitter-@ShieldAI2026-1DA1F2)](https://twitter.com/ShieldAI2026)

**Runtime security for autonomous AI agents** — spend controls, anomaly detection, MCP gateway, EU AI Act compliance.

$45M was lost to AI agent exploits in Q1 2026. ShieldAI is the open-source answer.

---

## 🚀 Quickstart

```bash
npm install @shieldai-xyz/sdk
```

```typescript
import { ShieldAI } from '@shieldai-xyz/sdk'

const shield = new ShieldAI({
  agentWallet: '0xYourAgentWallet',
  dailyLimit: 50,        // USD
  whitelist: ['0x...'],  // approved counterparties
})

shield.watch() // agent is now monitored
```

That's it. Your agent now has spend limits, anomaly detection, and a kill switch.

---

## 🔴 Live Demo

**[getshieldai.xyz/dashboard.html](https://getshieldai.xyz/dashboard.html)**

Real-time dashboard showing:
- Agent monitoring with anomaly scores
- MCP Gateway live intercept log
- EU AI Act compliance status
- SpendGuard on-chain policies

---

## ⛓️ On-Chain Contract

SpendGuard.sol is deployed and verified on **Arbitrum One**:

| | |
|---|---|
| **Contract** | [`0xE03C389DF391549E44c2aa807576c9eE2956C2d8`](https://arbiscan.io/address/0xE03C389DF391549E44c2aa807576c9eE2956C2d8) |
| **Network** | Arbitrum One |
| **Verified** | 2026-04-04 · Exact Match ✓ |
| **Block** | #448899709 |
| **TX** | [`0x1a4bddcf...f9c950`](https://arbiscan.io/tx/0x1a4bddcf4312c3dfe71796cb05551304b0dadf582d97b9888b520c2ee2f9c950) |

---

## 🛡️ 12-Layer Architecture

| Layer | Name | Function |
|-------|------|----------|
| L1 | Input Validator | Sanitizes all agent inputs |
| L2 | Intent Classifier | Detects malicious instruction patterns |
| L3 | Permission Guard | Enforces capability boundaries |
| L4 | SpendGuard | Hard limits on transaction values |
| L5 | Counterparty Filter | Whitelist/blacklist enforcement |
| L6 | Anomaly Detector | Isolation Forest behavioral analysis |
| L7 | Outbound Firewall | Blocks unauthorized external calls |
| L8 | Package Guardian | Validates smart contract interactions |
| L9 | Outcome Verifier | Post-execution result validation |
| L10 | Audit Logger | Immutable on-chain activity log |
| L11 | MCP Gateway | Intercepts every tool call before execution |
| L12 | EU AI Act Logger | Auto-generates compliance evidence |

---

## 📦 SDK Usage

### Validate Transactions

```typescript
const result = await shield.validate({
  from: agentWallet,
  to: '0xRecipient',
  amountUSD: 10,
  timestamp: Date.now()
})

if (result.allowed) {
  executeTransaction()
} else {
  console.log('BLOCKED:', result.reason)
}
```

### MCP Gateway

```typescript
// Intercept every MCP tool call before execution
const result = await shield.interceptMCP({
  tool: 'uniswap_swap',
  params: { tokenIn: '0x...', amountIn: '1000000' }
})

if (result.allowed) executeMCPCall()
// Automatically blocks: velocity attacks, non-whitelisted contracts, critical tools
```

### EU AI Act Compliance

```typescript
// Generate compliance report (Art. 9, 13, 14, 72)
const report = shield.getComplianceReport()
console.log(report.score) // '83%'

// Export as JSON for regulatory inspection
const json = shield.exportCompliance()
```

### Agent Status

```typescript
const status = await shield.getStatus()
// {
//   status: 'safe' | 'warn' | 'frozen',
//   anomalyScore: 0.03,
//   txToday: 12,
//   spentToday: 18.50,
//   remainingLimit: 31.50,
// }
```

### Alerts

```typescript
shield.onAlert((alert) => {
  console.log(alert.type, alert.severity)
  // Send to Slack, Telegram, PagerDuty...
})
```

---

## 🔐 Security Features

| Feature | Description |
|---------|-------------|
| **SpendGuard** | Daily + per-tx limits enforced on every transaction |
| **Whitelist** | Only approved counterparties can receive funds |
| **Anomaly Detection** | Isolation Forest baseline — auto-freeze on anomaly |
| **MCP Gateway** | Intercepts every tool call before execution |
| **Kill Switch** | Manual freeze + auto-freeze on critical anomaly |
| **EU AI Act Logs** | Auto-generates Art. 9, 13, 14, 72 compliance evidence |

---

## ⚖️ EU AI Act Compliance

ShieldAI automatically generates compliance evidence for:

| Article | Requirement | Status |
|---------|-------------|--------|
| Art. 9 | Risk Management System | ✅ SpendGuard active |
| Art. 13 | Transparency & Logging | ✅ All actions logged on-chain |
| Art. 14 | Human Oversight | ✅ Kill-switch + owner alerts |
| Art. 15 | Accuracy & Robustness | ✅ Behavioral baseline AI |
| Art. 17 | Quality Management | ✅ SpendGuard policies audited |
| Art. 72 | Incident Reporting | ✅ Auto-generated incident logs |

> ⚠️ ShieldAI provides technical tooling to support EU AI Act compliance. This is not legal certification.

---

## 🌐 Supported Networks

| Network | SpendGuard | Status |
|---------|------------|--------|
| Arbitrum One | `0xE03C...2d8` | ✅ Live |
| Mantle | Coming Q2 2026 | 🔜 |
| Base | Coming Q3 2026 | 🔜 |

---

## 📋 Roadmap

- [x] 12-layer security architecture
- [x] SpendGuard.sol deployed on Arbitrum One (verified)
- [x] `@shieldai-xyz/sdk` published to npm
- [x] Live dashboard at getshieldai.xyz
- [x] EU AI Act compliance logger
- [x] MCP Security Gateway
- [ ] Mantle mainnet deployment — Q2 2026
- [ ] Dashboard UI with real wallet connection — Q2 2026
- [ ] Behavior baseline on-chain inference — Q3 2026
- [ ] Base + Solana integration — Q3 2026
- [ ] TEE integration — Q4 2026

---

## 🏆 Grant Support

ShieldAI is supported by:
- **Mantle x HackQuest Global Accelerator** — application submitted
- **Arbitrum Ecosystem Grants** — application prepared
- **Giveth** — [giveth.io/project/shieldai](https://giveth.io/project/shieldai-ai-agent-security-monitoring-layer)

---

## 🔗 Links

| | |
|---|---|
| 🌐 Website | [getshieldai.xyz](https://getshieldai.xyz) |
| 📊 Dashboard | [getshieldai.xyz/dashboard.html](https://getshieldai.xyz/dashboard.html) |
| 📦 npm | [@shieldai-xyz/sdk](https://www.npmjs.com/package/@shieldai-xyz/sdk) |
| ⛓️ Contract | [Arbiscan](https://arbiscan.io/address/0xE03C389DF391549E44c2aa807576c9eE2956C2d8) |
| 🐦 Twitter | [@ShieldAI2026](https://twitter.com/ShieldAI2026) |
| 💜 Giveth | [Support ShieldAI](https://giveth.io/project/shieldai-ai-agent-security-monitoring-layer) |

---

## 📄 License

MIT © 2026 ShieldAI

> *Before your AI agent spends your money, someone should be watching.*
