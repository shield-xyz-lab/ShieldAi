# 🛡️ ShieldAI — AI Agent Security Layer

> **The first multi-layer security platform for autonomous AI agents operating in crypto and DeFi environments.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Network: Mantle](https://img.shields.io/badge/Network-Mantle-purple)](https://mantle.xyz)
[![Status: MVP](https://img.shields.io/badge/Status-MVP%20Live-green)](https://shieldai.xyz)
[![Layers: 7/7](https://img.shields.io/badge/Layers-7%2F7%20Complete-blue)](https://shieldai.xyz/demo)

---

## 🚨 The Problem

In 2025, over **$17 billion** was stolen from crypto. AI-enabled scams were **450% more profitable** than traditional schemes. As autonomous AI agents gain the ability to sign transactions, manage DeFi positions, and control DAO treasuries — the attack surface has fundamentally shifted.

Traditional security tools (firewalls, EDRs, smart contract auditors) were built for deterministic code. They don't understand **semantic intent**, can't detect **prompt injection**, and have no concept of **behavioral drift** in an AI agent context.

**ShieldAI was built specifically for this gap.**

---

## ✅ The Solution — 7 Security Layers

ShieldAI wraps any autonomous AI agent (Claude, GPT-4, AgentKit, ElizaOS) with 7 independent security layers that work together as a coordinated defense:

| Layer | Name | Function | Threat Covered |
|-------|------|----------|---------------|
| **L0** | MCP Gateway | Intercepts all MCP tool calls before execution | Data exfiltration, unknown servers, tool poisoning |
| **L1** | Input Firewall | Scans all external data entering the agent | Prompt injection, hidden text, unicode spoofing |
| **L2** | Memory Protection | Cryptographic hash chain for agent memory | Memory poisoning, rule injection, history tampering |
| **L3** | Intent Checker | Claude API semantic analysis of agent actions | Scope creep, behavioral inconsistency, social engineering |
| **L4** | TX Guardian | Pre-chain transaction simulation and validation | Wallet drainers, honeypots, scam addresses |
| **L5** | Agent Watchdog | Behavioral baseline + anomaly detection | Behavioral drift, burst attacks, off-hours activity |
| **L6** | Human Gate | Hardware-attested biometric authorization | High-value transactions ($10K+), critical operations |

---

## 🎯 Live Demo

Every layer has an interactive browser demo — no installation required:

| Layer | Demo | Description |
|-------|------|-------------|
| L0 MCP Gateway | [→ Demo](https://shieldai.github.io/layer0) | Intercept and inspect MCP tool calls in real-time |
| L1 Input Firewall | [→ Demo](https://shieldai.github.io/layer1) | Test 13 prompt injection detection patterns |
| L2 Memory Protection | [→ Demo](https://shieldai.github.io/layer2) | Simulate memory poisoning attacks and defenses |
| L3 Intent Checker | [→ Demo](https://shieldai.github.io/layer3) | AI-powered semantic intent analysis (live Claude API) |
| L4 TX Guardian | [→ Demo](https://shieldai.github.io/layer4) | Simulate transaction validation and drainer detection |
| L5 Agent Watchdog | [→ Demo](https://shieldai.github.io/layer5) | Behavioral anomaly scoring and auto-freeze |
| L6 Human Gate | [→ Demo](https://shieldai.github.io/layer6) | Mobile biometric authorization flow |

---

## ⚡ Attack Vectors Covered

ShieldAI protects against **7 categories of AI agent attacks**:

- **Prompt Injection** — Hidden instructions in external data override agent's system prompt
- **Memory Poisoning** — Attacker injects false "memories" that permanently alter agent behavior
- **Agent-to-Agent Infection** — Compromised agents propagate malicious instructions across agent networks
- **Wallet Drainer Contracts** — Contracts that appear normal in simulation but drain all assets
- **Behavioral Manipulation** — Series of individually innocent actions that collectively achieve theft
- **Urgency Social Engineering** — Artificial time pressure forcing agents to bypass safety procedures
- **Permission Drift** — Gradual escalation of agent permissions through injected instructions

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI AGENT (any LLM)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ all actions
          ┌────────────▼────────────┐
          │   L0: MCP GATEWAY       │ ← intercepts tool calls
          │   Policy Engine         │
          │   Blockchain Bridge     │
          └──┬──────────┬──────────┘
             │ clean    │ crypto detected
    ┌────────▼──┐  ┌────▼────────────────────────────────┐
    │ MCP       │  │  CRYPTO SECURITY STACK               │
    │ SERVERS   │  │  L1 Input → L2 Memory → L3 Intent   │
    └───────────┘  │  L4 TX    → L5 Watchdog → L6 Gate   │
                   └─────────────────────────────────────┘
```

**Unique competitive advantage:** When L0 MCP Gateway detects a crypto operation, it automatically escalates to the full L1-L6 blockchain security stack. No competitor (including Prompt Security / SentinelOne) has this combined MCP + blockchain protection layer.

---

## 🚀 Quick Start

```bash
pip install shieldai-sdk
```

```python
from shieldai import ShieldAI

# Initialize with your configuration
shield = ShieldAI(
    api_key="your-api-key",
    network="mantle",           # or "ethereum", "arbitrum"
    threshold_usd=10000,        # Human Gate threshold
    whitelist=["uniswap-v4", "aave-v3", "curve"]
)

# Wrap any agent action
@shield.protect
async def agent_action(tx):
    # Your agent logic here
    pass

# Or check explicitly
result = await shield.check_transaction(
    to="0x742d35Cc...",
    amount=5.8,
    token="ETH",
    agent_intent="Portfolio rebalancing on Uniswap V4"
)

if result.verdict == "APPROVED":
    # Execute transaction
    pass
elif result.verdict == "BLOCKED":
    raise SecurityException(f"Blocked: {result.reason}")
elif result.verdict == "HUMAN_GATE":
    # Send mobile push notification and wait for approval
    await shield.request_human_approval(result)
```

---

## 🔌 Integrations

ShieldAI is designed as middleware — drop it into any existing AI agent stack:

| Platform | Status | Notes |
|----------|--------|-------|
| [ElizaOS](https://github.com/elizaOS/eliza) | 🔜 Q2 2026 | Most popular AI agent framework in crypto |
| [Coinbase AgentKit](https://github.com/coinbase/agentkit) | 🔜 Q2 2026 | Native crypto agent framework |
| Claude / Anthropic | ✅ L3 Live | Intent Checker uses Claude Sonnet API |
| Cursor / VS Code | 🔜 Q3 2026 | MCP Gateway for IDE agents |
| Custom agents | ✅ SDK | Use ShieldAI SDK with any LLM |

---

## 📊 Threat Detection Performance (MVP)

| Metric | Value |
|--------|-------|
| Prompt injection patterns | 13 detection rules |
| Known scam addresses | 2M+ database |
| Transaction simulation | Pre-chain via fork |
| Behavioral baseline | 72h learning period |
| Auto-freeze threshold | Anomaly score ≥ 85 |
| Human Gate threshold | Transactions ≥ $10,000 |
| Average response time | < 200ms per layer |

---

## 🗺️ Roadmap

### Phase 1 — Q2 2026
- [ ] Production backend API (FastAPI + Python)
- [ ] Smart contracts deployment on Mantle Testnet
- [ ] ElizaOS SDK integration
- [ ] Coinbase AgentKit SDK integration
- [ ] 10 beta partners onboarded

### Phase 2 — Q3 2026
- [ ] Mantle Mainnet launch (all 7 layers)
- [ ] Self-serve SaaS dashboard
- [ ] GoPlus Security API integration (blacklist)
- [ ] Forta Network threat feeds integration
- [ ] 100 active protected agents

### Phase 3 — Q4 2026
- [ ] Cross-chain expansion (Arbitrum, NEAR)
- [ ] Bug bounty program launch
- [ ] Enterprise white-label offering
- [ ] Series A / strategic partnership

---

## 💰 Pricing

| Plan | Price | Best For |
|------|-------|----------|
| **Free** | $0/month | Individual developers, testing |
| **Pro** | $29/month | Active traders, small teams |
| **Agent** | $99/month | Multi-agent systems, power users |
| **Protocol** | $999/month | DeFi protocols, DAOs |
| **Enterprise** | Custom | Institutions, funds |

---

## 🔐 Security & Audits

- Smart contracts will be audited before Mainnet launch
- All layers are independent — compromise of one doesn't disable others
- Memory Protection uses cryptographic hash chains (tamper-evident)
- Human Gate uses hardware-attested biometric signatures
- Zero-knowledge proof integration planned for Q4 2026

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas where we need help:
- Smart contract development (Solidity / Mantle)
- ML model improvements for anomaly detection
- Additional MCP server integrations
- Security research and responsible disclosure

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🔗 Links

- 🌐 Website: [shieldai.xyz](https://shieldai.xyz) *(coming soon)*
- 📖 Docs: [docs.shieldai.xyz](https://docs.shieldai.xyz) *(coming soon)*
- 🐦 Twitter: [@ShieldAI_xyz](https://twitter.com/ShieldAI_xyz)
- 💬 Discord: [discord.gg/shieldai](https://discord.gg/shieldai) *(coming soon)*
- 📧 Contact: contact@shieldai.xyz

---

## 🙏 Acknowledgments

Built with support from:
- [Mantle Network](https://mantle.xyz) — Blockchain infrastructure and grants
- [Anthropic](https://anthropic.com) — Claude API powering Layer 3 Intent Checker
- [Tenderly](https://tenderly.co) — Transaction simulation infrastructure

---

*ShieldAI — Protecting the Future of Autonomous Finance*
