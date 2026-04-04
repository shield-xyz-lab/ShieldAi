import { useState, useEffect, useRef } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  bg:       "#080B12",
  surface:  "#0D1117",
  card:     "#111827",
  border:   "#1E2D45",
  borderHi: "#2A4A6B",
  blue:     "#0B4FFF",
  electric: "#00D4FF",
  mint:     "#00FFB3",
  amber:    "#FFB800",
  red:      "#FF3D3D",
  green:    "#10B981",
  white:    "#F0F4FF",
  gray:     "#4B5A6E",
  muted:    "#8892A4",
  text:     "#C8D8EC",
};

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const AGENTS = [
  { id: "AGT-001", name: "TradingBot Alpha", chain: "Arbitrum", status: "safe", anomaly: 0.03, txToday: 47, spentToday: 23.4, limit: 100, lastTx: "12s ago", verified: true },
  { id: "AGT-002", name: "DAO Payroll Agent", chain: "Mantle",   status: "safe", anomaly: 0.07, txToday: 12, spentToday: 1840, limit: 5000, lastTx: "2m ago",  verified: true },
  { id: "AGT-003", name: "Yield Optimizer",  chain: "Base",     status: "warn", anomaly: 0.61, txToday: 203, spentToday: 89.2, limit: 50,  lastTx: "3s ago",  verified: false },
  { id: "AGT-004", name: "NFT Scout Bot",    chain: "Arbitrum", status: "safe", anomaly: 0.11, txToday: 8,  spentToday: 4.1,  limit: 20,  lastTx: "8m ago",  verified: true },
  { id: "AGT-005", name: "Arb Executor",     chain: "Mantle",   status: "frozen", anomaly: 0.94, txToday: 891, spentToday: 412, limit: 50, lastTx: "now",    verified: false },
];

const COMPLIANCE_ITEMS = [
  { article: "Art. 9", title: "Risk Management System", status: "pass", detail: "Continuous monitoring active, anomaly baseline established" },
  { article: "Art. 13", title: "Transparency & Logging", status: "pass", detail: "All agent actions logged immutably on-chain" },
  { article: "Art. 14", title: "Human Oversight", status: "pass", detail: "Kill-switch active, owner alerts configured" },
  { article: "Art. 15", title: "Accuracy & Robustness", status: "warn", detail: "Behavior baseline still training — 68h remaining" },
  { article: "Art. 17", title: "Quality Management", status: "pass", detail: "SpendGuard policies deployed and audited" },
  { article: "Art. 72", title: "Incident Reporting", status: "pass", detail: "AGT-005 freeze event logged and reported" },
];

const MCP_CALLS = [
  { time: "00:00:03", agent: "AGT-003", tool: "uniswap_swap",    risk: "HIGH",  action: "BLOCKED",  reason: "Velocity: 203 calls/min (baseline: 12)" },
  { time: "00:00:07", agent: "AGT-001", tool: "price_feed",      risk: "LOW",   action: "ALLOWED",  reason: "Normal pattern" },
  { time: "00:00:09", agent: "AGT-005", tool: "transfer_funds",  risk: "CRIT",  action: "FROZEN",   reason: "Amount $412 exceeds limit $50 + anomaly 0.94" },
  { time: "00:00:14", agent: "AGT-002", tool: "batch_pay",       risk: "MED",   action: "ALLOWED",  reason: "Within policy, owner pre-approved" },
  { time: "00:00:18", agent: "AGT-004", tool: "nft_bid",         risk: "LOW",   action: "ALLOWED",  reason: "Normal pattern, whitelisted contract" },
  { time: "00:00:22", agent: "AGT-003", tool: "approve_token",   risk: "HIGH",  action: "BLOCKED",  reason: "Non-whitelisted contract 0x4f3a..." },
];

const BASELINE_DATA = [
  { label: "00:00", agts: [2,1,0,0,0] },
  { label: "04:00", agts: [3,2,1,0,0] },
  { label: "08:00", agts: [8,4,2,1,0] },
  { label: "12:00", agts: [12,7,8,3,2] },
  { label: "16:00", agts: [9,5,12,2,1] },
  { label: "20:00", agts: [6,3,4,1,0] },
  { label: "now",   agts: [47,12,203,8,891] },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function AnomalyBar({ score }) {
  const pct = Math.round(score * 100);
  const color = score < 0.3 ? C.green : score < 0.6 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width 1s ease", borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color, fontFamily: "monospace", minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    safe:   { label: "SAFE",   bg: "#0A2818", color: C.green,    border: "#0D4A2A" },
    warn:   { label: "WARN",   bg: "#2A1A00", color: C.amber,    border: "#4A3000" },
    frozen: { label: "FROZEN", bg: "#2A0A0A", color: C.red,      border: "#4A1A1A" },
  };
  const s = map[status] || map.safe;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 10, fontFamily: "monospace",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`, letterSpacing: 1 }}>
      {s.label}
    </span>
  );
}

function RiskBadge({ risk }) {
  const map = {
    LOW:  { bg: "#0A2818", color: C.green },
    MED:  { bg: "#1A1800", color: C.amber },
    HIGH: { bg: "#2A1200", color: "#FF8C00" },
    CRIT: { bg: "#2A0A0A", color: C.red },
  };
  const s = map[risk] || map.LOW;
  return (
    <span style={{ padding: "1px 6px", borderRadius: 2, fontSize: 10, fontFamily: "monospace",
      background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}>
      {risk}
    </span>
  );
}

function ActionBadge({ action }) {
  const map = {
    ALLOWED: { color: C.green },
    BLOCKED: { color: C.amber },
    FROZEN:  { color: C.red },
  };
  const s = map[action] || { color: C.muted };
  return <span style={{ fontSize: 11, fontFamily: "monospace", color: s.color, fontWeight: 700 }}>{action}</span>;
}

function Chip({ label, color }) {
  return (
    <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 10,
      background: color + "18", color, border: `1px solid ${color}44`,
      fontFamily: "monospace", letterSpacing: 0.5 }}>
      {label}
    </span>
  );
}

function SpendBar({ spent, limit }) {
  const pct = Math.min((spent / limit) * 100, 100);
  const color = pct < 60 ? C.electric : pct < 85 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", minWidth: 60 }}>
        ${spent}<span style={{ color: C.gray }}>/${limit}</span>
      </span>
    </div>
  );
}

// ─── MINI SPARKLINE ──────────────────────────────────────────────────────────
function Sparkline({ data, color = C.electric }) {
  const max = Math.max(...data, 1);
  const w = 80, h = 24;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={parseFloat(pts.split(" ").pop().split(",")[0])} cy={parseFloat(pts.split(" ").pop().split(",")[1])}
        r={3} fill={color} />
    </svg>
  );
}

// ─── MINI BAR CHART ──────────────────────────────────────────────────────────
function BaselineChart({ data, agentIdx }) {
  const vals = data.map(d => d.agts[agentIdx]);
  const max = Math.max(...vals, 1);
  const colors = [C.electric, C.mint, C.amber, C.green, C.red];
  const color = colors[agentIdx];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
      {data.map((d, i) => {
        const h = Math.max((vals[i] / max) * 40, 2);
        const isLast = i === data.length - 1;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ width: 8, height: h, background: isLast ? color : color + "66",
              borderRadius: "2px 2px 0 0", transition: "height 0.5s ease" }} />
          </div>
        );
      })}
    </div>
  );
}

// ─── LIVE TICKER ─────────────────────────────────────────────────────────────
function LiveTicker({ value, color = C.electric }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(v => v + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return <span style={{ color, fontFamily: "monospace", fontWeight: 700 }}>{display.toLocaleString()}</span>;
}

// ─── PULSE DOT ───────────────────────────────────────────────────────────────
function PulseDot({ color = C.green, size = 8 }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%",
        background: color, opacity: 0.3, animation: "pulse 2s infinite" }} />
      <span style={{ position: "absolute", inset: 2, borderRadius: "50%", background: color }} />
    </span>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, accent = C.electric, badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 3, height: 32, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: accent, fontFamily: "monospace",
            letterSpacing: 2, fontWeight: 700 }}>{icon} {title}</span>
          {badge && <span style={{ padding: "1px 6px", borderRadius: 2, fontSize: 9,
            background: accent + "22", color: accent, border: `1px solid ${accent}44`,
            fontFamily: "monospace" }}>{badge}</span>}
        </div>
        {subtitle && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function ShieldAI() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [liveLog, setLiveLog] = useState(MCP_CALLS);
  const [tick, setTick] = useState(0);
  const [frozenAgent, setFrozenAgent] = useState("AGT-005");

  // Simulate live log updates
  useEffect(() => {
    const tools = ["price_feed", "token_approve", "swap_exact", "transfer", "read_balance", "nft_bid"];
    const agents = ["AGT-001", "AGT-002", "AGT-003", "AGT-004"];
    const risks = ["LOW", "LOW", "LOW", "MED", "HIGH"];
    const interval = setInterval(() => {
      const risk = risks[Math.floor(Math.random() * risks.length)];
      const newCall = {
        time: new Date().toTimeString().slice(0, 8),
        agent: agents[Math.floor(Math.random() * agents.length)],
        tool: tools[Math.floor(Math.random() * tools.length)],
        risk,
        action: risk === "HIGH" ? "BLOCKED" : "ALLOWED",
        reason: risk === "HIGH" ? "Anomaly threshold exceeded" : "Normal pattern",
      };
      setLiveLog(prev => [newCall, ...prev.slice(0, 11)]);
      setTick(t => t + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "overview",    label: "OVERVIEW",    icon: "◈" },
    { id: "compliance",  label: "EU AI ACT",   icon: "⚖" },
    { id: "baseline",    label: "BASELINE AI", icon: "◎" },
    { id: "mcp",         label: "MCP GATEWAY", icon: "⬡" },
    { id: "spendguard",  label: "SPENDGUARD",  icon: "⛊" },
  ];

  const totalBlocked = liveLog.filter(l => l.action !== "ALLOWED").length;
  const totalAllowed = liveLog.filter(l => l.action === "ALLOWED").length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'DM Mono', 'Fira Code', monospace" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.surface}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(2.5);opacity:0} }
        @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .tab-btn { cursor:pointer; transition: all 0.2s; }
        .tab-btn:hover { background: ${C.border} !important; }
        .agent-row { cursor:pointer; transition: background 0.15s; }
        .agent-row:hover { background: ${C.border}22 !important; }
        .freeze-btn { cursor:pointer; transition: all 0.2s; }
        .freeze-btn:hover { opacity:0.8; transform:scale(0.97); }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "12px 24px",
        display: "flex", alignItems: "center", gap: 16,
        background: C.surface, position: "sticky", top: 0, zIndex: 100 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, border: `2px solid ${C.electric}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" ,
            background: C.electric + "22" }}>
            <span style={{ fontSize: 12, color: C.electric }}>⛊</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.white,
              fontFamily: "'Instrument Serif', serif", letterSpacing: 0.5 }}>ShieldAI</div>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2 }}>v3.0 · RUNTIME SECURITY</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Live stats */}
        {[
          { label: "AGENTS MONITORED", value: <LiveTicker value={250847} color={C.electric} />, dot: C.green },
          { label: "EVENTS TODAY",     value: <LiveTicker value={1284731} color={C.mint} />,    dot: C.mint },
          { label: "BLOCKED",          value: <LiveTicker value={4821} color={C.red} />,        dot: C.red },
          { label: "COMPLIANCE",       value: <span style={{ color: C.green, fontWeight: 700 }}>5/6 ✓</span>, dot: C.green },
        ].map((s, i) => (
          <div key={i} style={{ padding: "4px 14px", borderLeft: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <PulseDot color={s.dot} size={6} />
              <span style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 13 }}>{s.value}</div>
          </div>
        ))}

        <div style={{ padding: "4px 14px", borderLeft: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 2 }}>EU AI ACT</div>
          <div style={{ fontSize: 10, padding: "2px 8px", background: C.green + "22",
            color: C.green, border: `1px solid ${C.green}44`, borderRadius: 3 }}>COMPLIANT</div>
        </div>
      </div>

      {/* ── NAV TABS ── */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`,
        background: C.surface, padding: "0 24px" }}>
        {tabs.map(tab => (
          <button key={tab.id} className="tab-btn"
            onClick={() => setActiveTab(tab.id)}
            style={{ padding: "10px 20px", border: "none", cursor: "pointer",
              fontSize: 10, letterSpacing: 1.5, fontFamily: "inherit", fontWeight: 500,
              background: activeTab === tab.id ? C.card : "transparent",
              color: activeTab === tab.id ? C.electric : C.muted,
              borderBottom: activeTab === tab.id ? `2px solid ${C.electric}` : "2px solid transparent",
              transition: "all 0.2s" }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>

        {/* ════════════ OVERVIEW ════════════ */}
        {activeTab === "overview" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <SectionHeader icon="◈" title="AGENT MONITOR" subtitle="Real-time protection across all monitored agents"
              badge="LIVE" accent={C.electric} />

            {/* Agent table */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 120px 100px 80px 80px 100px",
                padding: "8px 16px", borderBottom: `1px solid ${C.border}`,
                background: C.surface }}>
                {["AGENT", "CHAIN", "STATUS", "ANOMALY SCORE", "SPEND TODAY", "TX/DAY", "VERIFIED", "ACTION"].map(h => (
                  <div key={h} style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5 }}>{h}</div>
                ))}
              </div>

              {AGENTS.map((agent, i) => (
                <div key={agent.id} className="agent-row"
                  onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                  style={{ display: "grid",
                    gridTemplateColumns: "1fr 80px 80px 120px 100px 80px 80px 100px",
                    padding: "10px 16px", borderBottom: `1px solid ${C.border}22`,
                    background: selectedAgent?.id === agent.id ? C.border + "33" : "transparent",
                    alignItems: "center" }}>

                  <div>
                    <div style={{ fontSize: 12, color: C.white, fontWeight: 500 }}>{agent.name}</div>
                    <div style={{ fontSize: 10, color: C.gray, fontFamily: "monospace" }}>{agent.id}</div>
                  </div>
                  <Chip label={agent.chain} color={agent.chain === "Arbitrum" ? C.electric : agent.chain === "Mantle" ? C.mint : C.amber} />
                  <StatusBadge status={agent.status} />
                  <AnomalyBar score={agent.anomaly} />
                  <SpendBar spent={agent.spentToday} limit={agent.limit} />
                  <span style={{ fontSize: 12, color: C.text, fontFamily: "monospace" }}>{agent.txToday}</span>
                  <span style={{ fontSize: 11, color: agent.verified ? C.green : C.muted }}>
                    {agent.verified ? "✓ YES" : "✗ NO"}
                  </span>

                  <div style={{ display: "flex", gap: 6 }}>
                    {agent.status !== "frozen" ? (
                      <button className="freeze-btn"
                        onClick={e => { e.stopPropagation(); setFrozenAgent(agent.id); }}
                        style={{ padding: "3px 8px", fontSize: 9, letterSpacing: 1, fontFamily: "inherit",
                          background: C.red + "22", color: C.red, border: `1px solid ${C.red}44`,
                          borderRadius: 3, cursor: "pointer" }}>FREEZE</button>
                    ) : (
                      <span style={{ fontSize: 9, color: C.red, letterSpacing: 1, animation: "blink 1s infinite" }}>● FROZEN</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Agent detail panel */}
            {selectedAgent && (
              <div style={{ marginTop: 16, background: C.card, border: `1px solid ${C.electric}44`,
                borderRadius: 6, padding: 20, animation: "fadeIn 0.2s ease" }}>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>AGENT DETAIL</div>
                    <div style={{ fontSize: 18, color: C.white, fontFamily: "'Instrument Serif', serif" }}>
                      {selectedAgent.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{selectedAgent.id} · {selectedAgent.chain}</div>
                  </div>
                  {[
                    { label: "ANOMALY SCORE", value: (selectedAgent.anomaly * 100).toFixed(0) + "%",
                      color: selectedAgent.anomaly < 0.3 ? C.green : selectedAgent.anomaly < 0.6 ? C.amber : C.red },
                    { label: "TX TODAY", value: selectedAgent.txToday, color: C.electric },
                    { label: "SPENT TODAY", value: "$" + selectedAgent.spentToday, color: C.mint },
                    { label: "DAILY LIMIT", value: "$" + selectedAgent.limit, color: C.muted },
                    { label: "LAST TX", value: selectedAgent.lastTx, color: C.text },
                  ].map((stat, i) => (
                    <div key={i} style={{ minWidth: 100 }}>
                      <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 4 }}>{stat.label}</div>
                      <div style={{ fontSize: 20, color: stat.color, fontFamily: "monospace", fontWeight: 700 }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
              {[
                { label: "SAFE AGENTS", value: AGENTS.filter(a => a.status === "safe").length, total: AGENTS.length, color: C.green },
                { label: "WARNINGS", value: AGENTS.filter(a => a.status === "warn").length, total: AGENTS.length, color: C.amber },
                { label: "FROZEN", value: AGENTS.filter(a => a.status === "frozen").length, total: AGENTS.length, color: C.red },
                { label: "MCP BLOCKED", value: totalBlocked, total: totalBlocked + totalAllowed, color: C.electric },
              ].map((s, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: 16 }}>
                  <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 32, color: s.color, fontWeight: 700 }}>{s.value}</span>
                    <span style={{ fontSize: 13, color: C.gray }}>/ {s.total}</span>
                  </div>
                  <div style={{ marginTop: 8, height: 2, background: C.border, borderRadius: 1 }}>
                    <div style={{ width: `${(s.value / Math.max(s.total, 1)) * 100}%`,
                      height: "100%", background: s.color, borderRadius: 1, transition: "width 1s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════ EU AI ACT COMPLIANCE ════════════ */}
        {activeTab === "compliance" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <SectionHeader icon="⚖" title="EU AI ACT COMPLIANCE LOGGER"
              subtitle="Automated audit trail mapped to EU AI Act articles — ready for regulatory inspection"
              badge="ART. 9–72" accent={C.mint} />

            {/* Compliance score */}
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, marginBottom: 16 }}>
              <div style={{ background: C.card, border: `1px solid ${C.mint}44`, borderRadius: 6, padding: 20,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12 }}>COMPLIANCE SCORE</div>
                <div style={{ position: "relative", width: 100, height: 100 }}>
                  <svg width={100} height={100} viewBox="0 0 100 100">
                    <circle cx={50} cy={50} r={42} fill="none" stroke={C.border} strokeWidth={8} />
                    <circle cx={50} cy={50} r={42} fill="none" stroke={C.mint} strokeWidth={8}
                      strokeDasharray={`${(5/6)*264} 264`} strokeLinecap="round"
                      transform="rotate(-90 50 50)" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 22, color: C.mint, fontWeight: 700 }}>83%</div>
                    <div style={{ fontSize: 9, color: C.muted }}>5 / 6</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, padding: "4px 12px", background: C.mint + "22",
                  color: C.mint, border: `1px solid ${C.mint}44`, borderRadius: 3,
                  fontSize: 10, letterSpacing: 1 }}>SUBSTANTIALLY COMPLIANT</div>
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20 }}>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12 }}>COMPLIANCE SUMMARY</div>
                <p style={{ fontSize: 12, color: C.text, lineHeight: 1.7, marginBottom: 12 }}>
                  ShieldAI automatically generates EU AI Act compliant audit logs for every agent action.
                  All logs are stored immutably on-chain and can be exported as compliance evidence packages
                  for regulatory inspection within seconds.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ padding: "4px 10px", background: C.green + "22", color: C.green,
                    border: `1px solid ${C.green}44`, borderRadius: 3, fontSize: 10 }}>5 PASSED</div>
                  <div style={{ padding: "4px 10px", background: C.amber + "22", color: C.amber,
                    border: `1px solid ${C.amber}44`, borderRadius: 3, fontSize: 10 }}>1 WARNING</div>
                  <div style={{ padding: "4px 10px", background: C.red + "22", color: C.red,
                    border: `1px solid ${C.red}44`, borderRadius: 3, fontSize: 10 }}>0 FAILED</div>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {COMPLIANCE_ITEMS.map((item, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: "14px 20px",
                  borderLeft: `3px solid ${item.status === "pass" ? C.green : C.amber}`,
                  animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 10, color: item.status === "pass" ? C.green : C.amber,
                      fontFamily: "monospace", minWidth: 56, fontWeight: 700 }}>{item.article}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: C.white, fontWeight: 500 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{item.detail}</div>
                    </div>
                    <span style={{ fontSize: 11, color: item.status === "pass" ? C.green : C.amber,
                      fontFamily: "monospace" }}>
                      {item.status === "pass" ? "✓ PASS" : "⚠ WARN"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Export button */}
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  const report = {
                    generated: new Date().toISOString(),
                    project: "ShieldAI v3.0",
                    standard: "EU AI Act 2024/1689",
                    complianceScore: "83%",
                    articles: COMPLIANCE_ITEMS.map(item => ({
                      article: item.article,
                      title: item.title,
                      status: item.status,
                      detail: item.detail,
                      timestamp: new Date().toISOString(),
                    })),
                    agents: AGENTS.map(a => ({
                      id: a.id,
                      name: a.name,
                      chain: a.chain,
                      status: a.status,
                      anomalyScore: a.anomaly,
                      txToday: a.txToday,
                      spentToday: a.spentToday,
                      dailyLimit: a.limit,
                    })),
                    networks: [
                      { network: "Arbitrum One", contract: "0x4A3b...f82c", status: "testnet" },
                      { network: "Mantle", contract: "0x9F1a...d441", status: "testnet" },
                    ],
                    disclaimer: "ShieldAI provides technical tooling to support EU AI Act compliance. This report is not legal certification.",
                  };
                  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `shieldai_compliance_report_${new Date().toISOString().slice(0,10)}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                style={{ padding: "10px 20px", background: C.mint + "22", color: C.mint,
                  border: `1px solid ${C.mint}44`, borderRadius: 4, fontSize: 10,
                  letterSpacing: 1.5, fontFamily: "inherit", cursor: "pointer" }}>
                ↓ EXPORT EVIDENCE PACKAGE
              </button>
              <button
                onClick={() => window.open("https://arbiscan.io/address/0xE03C389DF391549E44c2aa807576c9eE2956C2d8", "_blank")}
                style={{ padding: "10px 20px", background: "transparent", color: C.muted,
                  border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 10,
                  letterSpacing: 1.5, fontFamily: "inherit", cursor: "pointer" }}>
                ↗ VIEW ON-CHAIN AUDIT LOG
              </button>
            </div>
          </div>
        )}

        {/* ════════════ BASELINE AI ════════════ */}
        {activeTab === "baseline" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <SectionHeader icon="◎" title="BEHAVIOR BASELINE AI"
              subtitle="Each agent learns its own normal — anomaly detection activates after 72h training window"
              badge="ADAPTIVE" accent={C.amber} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {AGENTS.map((agent, i) => {
                const vals = BASELINE_DATA.map(d => d.agts[i]);
                const current = vals[vals.length - 1];
                const avg = Math.round(vals.slice(0, -1).reduce((a, b) => a + b, 0) / (vals.length - 1));
                const deviation = avg > 0 ? ((current - avg) / avg * 100).toFixed(0) : 0;
                const isAnomalous = Math.abs(deviation) > 50;
                const colors = [C.electric, C.mint, C.amber, C.green, C.red];
                const color = colors[i];

                return (
                  <div key={agent.id} style={{ background: C.card, border: `1px solid ${isAnomalous ? C.red + "66" : C.border}`,
                    borderRadius: 6, padding: 16, animation: `fadeIn 0.3s ease ${i * 0.06}s both` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 12, color: C.white, fontWeight: 500 }}>{agent.name}</div>
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{agent.id}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Sparkline data={vals} color={color} />
                        <StatusBadge status={agent.status} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[
                        { label: "CURRENT TX/H", value: current, color },
                        { label: "AVG BASELINE", value: avg, color: C.muted },
                        { label: "DEVIATION", value: deviation + "%", color: isAnomalous ? C.red : C.green },
                      ].map((s, j) => (
                        <div key={j}>
                          <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 3 }}>{s.label}</div>
                          <div style={{ fontSize: 18, color: s.color, fontFamily: "monospace", fontWeight: 700 }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 6 }}>24H ACTIVITY</div>
                      <BaselineChart data={BASELINE_DATA} agentIdx={i} />
                    </div>

                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 3, background: C.border, borderRadius: 2 }}>
                        <div style={{ width: `${Math.min(agent.anomaly * 100, 100)}%`,
                          height: "100%", background: isAnomalous ? C.red : color, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 10, color: isAnomalous ? C.red : C.muted, fontFamily: "monospace" }}>
                        RISK {(agent.anomaly * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Training status */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 }}>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12 }}>BASELINE MODEL STATUS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "TRAINING WINDOW", value: "72 hours", sub: "minimum before enforcement" },
                  { label: "MODEL TYPE", value: "ISOLATION FOREST", sub: "on-chain inference via Giza" },
                  { label: "FALSE POSITIVE RATE", value: "< 0.8%", sub: "last 30 days" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5 }}>{s.label}</div>
                    <div style={{ fontSize: 14, color: C.amber, fontWeight: 700, margin: "4px 0" }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: C.gray }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════ MCP GATEWAY ════════════ */}
        {activeTab === "mcp" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <SectionHeader icon="⬡" title="MCP SECURITY GATEWAY"
              subtitle="Every agent tool call intercepted, scored, and enforced before execution"
              badge="LIVE STREAM" accent={C.electric} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>

              {/* Live log */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`,
                  background: C.surface, display: "flex", alignItems: "center", gap: 8 }}>
                  <PulseDot color={C.electric} size={7} />
                  <span style={{ fontSize: 10, color: C.electric, letterSpacing: 1.5 }}>LIVE MCP INTERCEPT LOG</span>
                  <span style={{ marginLeft: "auto", fontSize: 9, color: C.muted }}>
                    TICK #{tick}
                  </span>
                </div>

                {/* Header */}
                <div style={{ display: "grid",
                  gridTemplateColumns: "70px 70px 130px 55px 70px 1fr",
                  padding: "6px 16px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                  {["TIME", "AGENT", "TOOL", "RISK", "ACTION", "REASON"].map(h => (
                    <div key={h} style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5 }}>{h}</div>
                  ))}
                </div>

                {liveLog.map((call, i) => (
                  <div key={i} style={{ display: "grid",
                    gridTemplateColumns: "70px 70px 130px 55px 70px 1fr",
                    padding: "8px 16px", borderBottom: `1px solid ${C.border}11`,
                    background: i === 0 ? C.border + "22" : "transparent",
                    alignItems: "center", animation: i === 0 ? "fadeIn 0.3s ease" : "none" }}>
                    <span style={{ fontSize: 10, color: C.gray, fontFamily: "monospace" }}>{call.time}</span>
                    <span style={{ fontSize: 10, color: C.electric, fontFamily: "monospace" }}>{call.agent}</span>
                    <span style={{ fontSize: 10, color: C.text, fontFamily: "monospace" }}>{call.tool}</span>
                    <RiskBadge risk={call.risk} />
                    <ActionBadge action={call.action} />
                    <span style={{ fontSize: 10, color: C.muted }}>{call.reason}</span>
                  </div>
                ))}
              </div>

              {/* Gateway stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "TOTAL INTERCEPTED", value: liveLog.length * 847, color: C.electric },
                  { label: "BLOCKED THIS SESSION", value: totalBlocked, color: C.red },
                  { label: "THREATS PREVENTED", value: 3, color: C.amber },
                  { label: "AVG LATENCY", value: "< 2ms", color: C.green },
                ].map((s, i) => (
                  <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 6, padding: "14px 16px" }}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 24, color: s.color, fontWeight: 700 }}>{s.value}</div>
                  </div>
                ))}

                <div style={{ background: C.card, border: `1px solid ${C.amber}44`,
                  borderRadius: 6, padding: 14 }}>
                  <div style={{ fontSize: 9, color: C.amber, letterSpacing: 1.5, marginBottom: 8 }}>HOW IT WORKS</div>
                  <div style={{ fontSize: 11, color: C.text, lineHeight: 1.7 }}>
                    ShieldAI sits between every AI agent and its MCP tools. Each call is scored against
                    the agent's baseline before execution. High-risk calls are blocked or queued for owner approval.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ SPENDGUARD ════════════ */}
        {activeTab === "spendguard" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <SectionHeader icon="⛊" title="SPENDGUARD"
              subtitle="On-chain spend policies enforced before every transaction — deployed on Arbitrum & Mantle"
              badge="ON-CHAIN" accent={C.mint} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {AGENTS.map((agent, i) => (
                <div key={agent.id} style={{ background: C.card,
                  border: `1px solid ${agent.status === "frozen" ? C.red + "66" : agent.status === "warn" ? C.amber + "44" : C.border}`,
                  borderRadius: 6, padding: 16, animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{agent.name}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{agent.id}</div>
                    </div>
                    <StatusBadge status={agent.status} />
                  </div>

                  {/* Policy rules */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "DAILY LIMIT", value: "$" + agent.limit, color: C.mint },
                      { label: "SPENT TODAY", value: "$" + agent.spentToday,
                        color: (agent.spentToday / agent.limit) > 0.85 ? C.red : C.text },
                      { label: "TX COUNT", value: agent.txToday + " / day", color: C.text },
                      { label: "ANOMALY", value: (agent.anomaly * 100).toFixed(0) + "%",
                        color: agent.anomaly > 0.6 ? C.red : agent.anomaly > 0.3 ? C.amber : C.green },
                    ].map((rule, j) => (
                      <div key={j} style={{ display: "flex", justifyContent: "space-between",
                        padding: "6px 10px", background: C.surface, borderRadius: 4,
                        border: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 10, color: C.muted, letterSpacing: 1 }}>{rule.label}</span>
                        <span style={{ fontSize: 11, color: rule.color, fontFamily: "monospace", fontWeight: 700 }}>{rule.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <SpendBar spent={agent.spentToday} limit={agent.limit} />
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <div style={{ padding: "3px 8px", background: C.green + "22", color: C.green,
                      border: `1px solid ${C.green}33`, borderRadius: 3, fontSize: 9, letterSpacing: 1 }}>
                      ✓ WHITELIST ACTIVE
                    </div>
                    {agent.status === "frozen" && (
                      <div style={{ padding: "3px 8px", background: C.red + "22", color: C.red,
                        border: `1px solid ${C.red}33`, borderRadius: 3, fontSize: 9,
                        letterSpacing: 1, animation: "blink 1s infinite" }}>
                        ● FROZEN BY SHIELDAI
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Contract info */}
            <div style={{ marginTop: 16, background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 6, padding: 16 }}>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12 }}>DEPLOYED CONTRACTS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { network: "Arbitrum One", address: "0xE03C...2d8", fullAddress: "0xE03C389DF391549E44c2aa807576c9eE2956C2d8", status: "LIVE ✓", color: C.electric, url: "https://arbiscan.io/address/0xE03C389DF391549E44c2aa807576c9eE2956C2d8" },
                  { network: "Mantle",       address: "Q2 2026",      fullAddress: null, status: "SOON", color: C.mint, url: null },
                  { network: "Base",         address: "Q3 2026",      fullAddress: null, status: "PLANNED", color: C.muted, url: null },
                ].map((c, i) => (
                  <div key={i}
                    onClick={() => c.url && window.open(c.url, "_blank")}
                    style={{ padding: 12, background: C.surface,
                      border: `1px solid ${c.color}44`, borderRadius: 4,
                      cursor: c.url ? "pointer" : "default" }}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5 }}>{c.network}</div>
                    <div style={{ fontSize: 11, color: c.color, fontFamily: "monospace", margin: "4px 0" }}>{c.address}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 9, padding: "2px 6px", display: "inline-block",
                        background: c.color + "22", color: c.color, borderRadius: 2, letterSpacing: 1 }}>{c.status}</div>
                      {c.url && <span style={{ fontSize: 9, color: C.gray }}>↗ Arbiscan</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: C.surface,
                border: `1px solid ${C.electric}33`, borderRadius: 4 }}>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 4 }}>DEPLOYMENT TX</div>
                <div style={{ fontSize: 10, color: C.electric, fontFamily: "monospace",
                  cursor: "pointer", wordBreak: "break-all" }}
                  onClick={() => window.open("https://arbiscan.io/tx/0x1a4bddcf4312c3dfe71796cb05551304b0dadf582d97b9888b520c2ee2f9c950", "_blank")}>
                  0x1a4bddcf4312c3dfe71796cb05551304b0dadf582d97b9888b520c2ee2f9c950 ↗
                </div>
                <div style={{ fontSize: 9, color: C.gray, marginTop: 4 }}>
                  Block #448899709 · Verified 2026-04-04 08:51:41 UTC · Exact Match ✓
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 24px",
        display: "flex", alignItems: "center", gap: 16, background: C.surface }}>
        <span style={{ fontSize: 9, color: C.gray, letterSpacing: 2 }}>SHIELDAI v3.0</span>
        <span style={{ fontSize: 9, color: C.border }}>|</span>
        <span style={{ fontSize: 9, color: C.muted }}>getshieldai.xyz</span>
        <span style={{ fontSize: 9, color: C.border }}>|</span>
        <span style={{ fontSize: 9, color: C.muted }}>@ShieldAI2026</span>
        <span style={{ fontSize: 9, color: C.border }}>|</span>
        <span style={{ fontSize: 9, color: C.muted }}>Deployed on Arbitrum · Mantle</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PulseDot color={C.green} size={6} />
          <span style={{ fontSize: 9, color: C.green, letterSpacing: 1 }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
}

