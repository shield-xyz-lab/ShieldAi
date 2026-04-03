# ShieldAI 🛡️

> **Before your AI agent spends your money, someone should be watching.**

Real-time on-chain monitoring and spend control for autonomous AI agents — because a compromised agent doesn't ask for permission.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Network: Mantle](https://img.shields.io/badge/Network-Mantle-brightgreen)](https://mantle.xyz)
[![Network: Arbitrum](https://img.shields.io/badge/Network-Arbitrum-blue)](https://arbitrum.io)
[![Twitter](https://img.shields.io/badge/Twitter-@ShieldAI2026-1DA1F2)](https://twitter.com/ShieldAI2026)

---

## The Problem

AI agents are executing transactions autonomously — buying compute, paying APIs, managing DeFi positions. But:

- **No spend limits** → a compromised agent can drain your entire wallet
- **No visibility** → you have no idea what your agent did while you slept
- **No kill switch** → by the time you notice, it's too late

ShieldAI fixes this with a lightweight monitoring and enforcement layer you install in 3 lines.

---

## Quickstart

```bash
npm install @shieldai/sdk
```

```typescript
import { ShieldAI } from '@shieldai/sdk'

const shield = new ShieldAI({
  agentWallet: '0xYourAgentWallet',
  dailyLimit: 50,        // USD equivalent
  whitelist: ['0x...'],  // approved counterparties
  alertWebhook: 'https://your-webhook.com'
})

shield.watch() // that's it
```

Your agent is now monitored. You'll receive alerts for:
- Transactions exceeding limits
- Interactions with non-whitelisted addresses
- Anomalous spending velocity
- Suspicious contract calls

---

## Architecture — 10 Security Layers

| Layer | Name | Function |
|-------|------|----------|
| L1 | Input Validator | Sanitizes all agent inputs |
| L2 | Intent Classifier | Detects malicious instruction patterns |
| L3 | Permission Guard | Enforces capability boundaries |
| L4 | Spend Controller | Hard limits on transaction values |
| L5 | Counterparty Filter | Whitelist/blacklist enforcement |
| L6 | Anomaly Detector | AI-powered behavioral analysis |
| L7 | Outbound Firewall | Blocks unauthorized external calls |
| L8 | Package Guardian | Validates smart contract interactions |
| L9 | Outcome Verifier | Post-execution result validation |
| L10 | Audit Logger | Immutable on-chain activity log |

---

## Live Demo

🔗 **[shield-xyz-lab.github.io/ShieldAi](https://shield-xyz-lab.github.io/ShieldAi)**

Interactive demos for all 10 layers — see each protection mechanism in action.

---

## Deployments

| Network | Contract | Status |
|---------|----------|--------|
| Mantle Testnet | `0x...` | ✅ Live |
| Arbitrum Testnet | `0x...` | ✅ Live |
| Mantle Mainnet | `0x...` | 🔜 Q2 2026 |

---

## SDK Reference

```typescript
// Monitor an agent
const shield = new ShieldAI({ agentWallet, dailyLimit, whitelist })
shield.watch()

// Check agent status
const status = await shield.getStatus()
// → { txToday: 12, spentToday: 18.50, anomalyScore: 0.02, status: 'safe' }

// Pause agent
await shield.pause()

// Get audit log
const log = await shield.getAuditLog({ last: 50 })
```

---

## Supported Networks

- **Mantle** (primary)
- **Arbitrum One & Nova**
- **Base**
- **Ethereum**

---

## Roadmap

- [x] 10-layer architecture design
- [x] Interactive layer demos (GitHub Pages)
- [x] SDK alpha
- [ ] Mainnet deployment — Q2 2026
- [ ] Dashboard UI — Q2 2026
- [ ] Real-time alert webhooks — Q3 2026
- [ ] Multi-agent monitoring — Q3 2026

---

## Grant Support

ShieldAI is supported by:
- Mantle x HackQuest Global Accelerator (application in progress)
- Arbitrum Ecosystem Grants (application prepared)

---

## Contributing

Issues, PRs and feedback welcome. If you're building AI agents and want to integrate ShieldAI, open an issue — we'll help with integration.

---

## License

MIT © 2026 ShieldAI

**Twitter:** [@ShieldAI2026](https://twitter.com/ShieldAI2026)  
**Website:** [getshieldai.xyz](https://getshieldai.xyz)
