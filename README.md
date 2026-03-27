[README (1).md](https://github.com/user-attachments/files/26306802/README.1.md)
# 🛡️ ShieldAI — AI Agent Security Layer

> **The first 10-layer security platform for autonomous AI agents operating in crypto and DeFi environments.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Network: Mantle](https://img.shields.io/badge/Network-Mantle-purple)](https://mantle.xyz)
[![Network: Arbitrum](https://img.shields.io/badge/Network-Arbitrum-blue)](https://arbitrum.io)
[![Status: MVP](https://img.shields.io/badge/Status-MVP%20Live-green)](https://shield-xyz-lab.github.io/ShieldAI)
[![Layers: 10/10](https://img.shields.io/badge/Layers-10%2F10%20Complete-orange)](https://shield-xyz-lab.github.io/ShieldAI)

---

## 🚨 The Problem

In 2025, over **$17 billion** was stolen from crypto. Three new attack categories emerged in 2025-2026 that no existing security tool addresses:

- **GTG-1002** (Sept 2025) — State-sponsored AI attack: 1024 req/sec, 30 simultaneous targets, 80-90% autonomous. Victim companies noticed nothing.
- **Slopsquatting** (2025) — 20% of AI-suggested npm packages are hallucinations. Attackers pre-register them with reverse shells. 86,000 downloads before detection.
- **Reward Hacking + Anti-AI-Detection Malware** (2025) — AI agents game metrics. Malware contains hidden strings to bypass AI security tools.

ShieldAI addresses all 10 documented attack categories.

---

## ✅ The Solution — 10 Security Layers

ShieldAI wraps any autonomous AI agent (Claude, GPT-4, AgentKit, ElizaOS) with 10 independent security layers:

| Layer | Name | Function | Threat Covered | Status |
|-------|------|----------|----------------|--------|
| **L0** | MCP Gateway | Intercepts ALL AI tool calls before execution. Policy Engine. Blockchain Bridge to L1-L9. | Data exfiltration, unknown servers, tool poisoning | ✓ Active |
| **L1** | Input Firewall | Dual-Engine: hardcoded rules (100% deterministic) + LLM scanner. 13 injection patterns. Anti-AI-detection bypass proof. | Prompt injection, anti-AI-detection malware | ✓ Active |
| **L2** | Memory Protection | Cryptographic hash chain. Immutable rules store. Write-time validation. Snapshot restore after attacks. | Memory poisoning, rule injection, history tampering | ✓ Active |
| **L3** | Intent Checker | Claude Sonnet API semantic analysis. Source trust scoring. Behavioral consistency. Outcome pre-verification. | Scope creep, social engineering, behavioral drift | ✓ Active |
| **L4** | TX Guardian | Pre-chain simulation on mainnet fork. 2M+ scam addresses. Drainer/honeypot bytecode detection. Mantle + Arbitrum RPC native. | Wallet drainers, honeypots, scam contracts | ✓ Active |
| **L5** | Agent Watchdog | Behavioral baseline 72h. Isolation Forest ML. Auto-freeze at score 85+. Reward hacking behavioral patterns. | Behavioral drift, burst attacks, coordinated manipulation | ✓ Active |
| **L6** | Human Gate | Hardware-attested biometric mobile auth. 60-second timeout = auto-block. $10,000 threshold. Immutable audit trail. | Unauthorized high-value operations, social engineering | ✓ Active |
| **L7** | Outbound Firewall | Rate limiter >500 req/min. Domain whitelist. 47 weapon-code patterns. Micro-exfiltration detection. GTG-1002 signature. | **State-sponsored attacks, lateral movement, covert exfiltration** | ★ NEW 2026 |
| **L8** | Package Guardian | Slopsquatting detection. Reputation scoring (7 signals). Reverse shell sandbox. Pre-install verification. Private registry. | **Supply chain attacks, reverse shells, hallucination exploitation** | ★ NEW 2026 |
| **L9** | Outcome Verifier | Metric-outcome Pearson correlation divergence. Goodhart's Law defense. Complaint suppression detection. Anti-AI-detection hardcoded rules. | **Reward hacking, metric gaming, anti-AI-detection malware** | ★ NEW 2026 |

---

## 🎯 Live Demo

Every layer has an interactive browser demo — no installation required:

| Layer | Demo | Description |
|-------|------|-------------|
| L0 MCP Gateway | [→ Demo](shieldai-layer0.html) | Intercept and inspect MCP tool calls in real-time |
| L1 Input Firewall | [→ Demo](shieldai-layer1.html) | Test 13 prompt injection detection patterns |
| L2 Memory Protection | [→ Demo](shieldai-layer2.html) | Simulate memory poisoning attacks and defenses |
| L3 Intent Checker | [→ Demo](shieldai-layer3.html) | AI-powered semantic intent analysis (live Claude API) |
| L4 TX Guardian | [→ Demo](shieldai-layer4.html) | Simulate transaction validation and drainer detection |
| L5 Agent Watchdog | [→ Demo](shieldai-layer5.html) | Behavioral anomaly scoring and auto-freeze |
| L6 Human Gate | [→ Demo](shieldai-layer6.html) | Mobile biometric authorization flow |
| L7 Outbound Firewall | [→ Demo](shieldai-layer7.html) | **NEW** — State-sponsored attack defense, rate limiting, domain whitelist |
| L8 Package Guardian | [→ Demo](shieldai-layer8.html) | **NEW** — Slopsquatting detection, reverse shell sandbox |
| L9 Outcome Verifier | [→ Demo](shieldai-layer9.html) | **NEW** — Reward hacking detection, anti-AI-detection defense |

---

## ⚡ Attack Vectors Covered

ShieldAI protects against **10 categories of AI agent attacks**:

- **Prompt Injection** — Hidden instructions in external data override the agent's system prompt
- **Memory Poisoning** — Attacker injects false "memories" that permanently alter agent behavior
- **MCP Tool Poisoning** — Malicious tool responses contain embedded instructions executed as commands
- **Wallet Drainer Contracts** — Contracts that appear normal but drain all assets on execution
- **Behavioral Manipulation** — Series of innocent-looking actions that collectively achieve theft
- **Urgency Social Engineering** — Artificial time pressure forces agents to bypass safety procedures
- **Permission Drift** — Gradual escalation of permissions through injected instructions
- **State-Sponsored AI Attack** *(NEW 2026)* — AI agent weaponized against external targets at 1000+ req/sec
- **Slopsquatting / Supply Chain** *(NEW 2026)* — AI hallucinated packages exploited with malicious payloads
- **Reward Hacking + Anti-AI-Detection** *(NEW 2026)* — Agent games metrics; malware bypasses AI security tools

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                AI AGENT (any LLM)                    │
└─────────────────────┬────────────────────────────────┘
                      │ all actions
         ┌────────────▼────────────────┐
         │   L0: MCP GATEWAY           │ ← intercepts all tool calls
         │   Policy Engine             │
         │   Outbound Firewall (L7)    │ ← blocks state-actor attacks
         │   Package Guardian (L8)     │ ← supply chain defense
         │   Blockchain Bridge         │
         └──┬───────────┬─────────────┘
            │ clean     │ threat detected
   ┌────────▼──┐  ┌─────▼──────────────────────────────┐
   │ MCP       │  │  FULL 10-LAYER DEFENSE STACK        │
   │ SERVERS   │  │  L1 → L2 → L3 → L4 → L5 → L6      │
   └───────────┘  │  L7 → L8 → L9                      │
                  └────────────────────────────────────┘
```

**Unique advantage over all competitors:**
- SentinelOne / Prompt Security — MCP security only (no blockchain, no L7-L9)
- CertiK — smart contract audits only (no runtime AI protection)
- Chainalysis — on-chain analytics only (no real-time agent defense)
- **ShieldAI — all 10 layers, full-stack, every documented attack vector**

---

## 🚀 Quick Start

```bash
pip install shieldai-sdk
```

```python
from shieldai import ShieldAI

shield = ShieldAI(
    api_key="your-api-key",
    network="mantle",
    threshold_usd=10000,
    whitelist=["uniswap-v4", "aave-v3", "curve"]
)

result = await shield.check_transaction(
    to="0x742d35Cc...",
    amount=5.8,
    token="ETH",
    agent_intent="Portfolio rebalancing on Uniswap V4"
)

if result.verdict == "APPROVED":
    pass
elif result.verdict == "BLOCKED":
    raise SecurityException(f"Blocked: {result.reason}")
elif result.verdict == "HUMAN_GATE":
    await shield.request_human_approval(result)
```

---

## 🔌 Integrations

| Platform | Status | Notes |
|----------|--------|-------|
| ElizaOS | 🔜 Q2 2026 | Most popular AI agent framework in crypto |
| Coinbase AgentKit | 🔜 Q2 2026 | Native crypto agent framework |
| Arbitrum Vibekit | 🔜 Q2 2026 | npm: @shieldai/vibekit-security |
| Claude / Anthropic | ✅ Live | L3 Intent Checker uses Claude Sonnet API |
| Custom agents | ✅ SDK | Compatible with any LLM |

---

## 🗺️ Roadmap

### Phase 1 — Q2 2026
- [ ] Production backend API (FastAPI + Python)
- [ ] Smart contracts on Mantle + Arbitrum Testnet
- [ ] ElizaOS and AgentKit SDK
- [ ] L8 Package Guardian private registry (500+ verified packages)
- [ ] 10 beta partners onboarded

### Phase 2 — Q3 2026
- [ ] Mantle + Arbitrum Mainnet (all 10 layers)
- [ ] Self-serve SaaS dashboard
- [ ] L9 Outcome Verifier — reward hacking research on arXiv
- [ ] 100 active protected agents

### Phase 3 — Q4 2026
- [ ] Cross-chain expansion (NEAR, Base)
- [ ] Bug bounty program
- [ ] Enterprise white-label
- [ ] Series A / strategic partnership

---

## 💰 Pricing

| Plan | Price | Best For |
|------|-------|----------|
| **Free** | $0/month | Developers, testing |
| **Pro** | $29/month | Active traders, small teams |
| **Agent** | $99/month | Multi-agent systems |
| **Protocol** | $999/month | DeFi protocols, DAOs |
| **Enterprise** | Custom | Institutions, funds |

---

## 📊 Detection Performance

| Metric | Value |
|--------|-------|
| Prompt injection patterns | 13 hardcoded + LLM semantic |
| Known scam addresses | 2M+ database |
| Outbound rate threshold | 500 req/min (GTG-1002 defense) |
| Package reputation signals | 7 scoring factors |
| Reward hacking detection | Pearson correlation < 0.3 |
| Auto-freeze threshold | Anomaly score ≥ 85 |
| Human Gate threshold | Transactions ≥ $10,000 |
| Response time | < 200ms per layer |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🔗 Links

- 🐦 Twitter: [@ShieldAI_xyz](https://twitter.com/ShieldAI_xyz)
- 📧 Contact: contact@shieldai.xyz
- 🌐 GitHub: [shield-xyz-lab/ShieldAI](https://github.com/shield-xyz-lab/ShieldAI)

---

*ShieldAI — Protecting the Future of Autonomous Finance*
