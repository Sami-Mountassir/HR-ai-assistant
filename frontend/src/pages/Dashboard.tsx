import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, Shield, Users, BarChart3, Zap, ChevronRight,
  AlertTriangle, CheckCircle2, Clock, ArrowUpRight, Activity,
  Target, Eye, Gauge,
} from "lucide-react";
import AmbientBackground from "@/components/chat/AmbientBackground";

/* ── KPI Data ─────────────────────────────────────────────── */
const kpis = [
  {
    label: "Readiness Score",
    value: "78%",
    change: "+4.2%",
    positive: true,
    icon: TrendingUp,
    color: "text-accent",
    detail: "Across 1,247 employees evaluated this quarter. Engineering leads at 84%, Operations at 71%.",
  },
  {
    label: "Avg. Flight Risk",
    value: "12.3%",
    change: "-1.8%",
    positive: true,
    icon: AlertTriangle,
    color: "text-[#1c69d4]",
    detail: "Down from 14.1% last month. Battery Division remains highest at 18.7%.",
  },
  {
    label: "Succession Coverage",
    value: "64%",
    change: "+7%",
    positive: true,
    icon: Users,
    color: "text-accent",
    detail: "34 of 53 critical roles have identified successors. 8 gaps flagged for immediate attention.",
  },
  {
    label: "Bias Detection",
    value: "94",
    change: "+2",
    positive: true,
    icon: Shield,
    color: "text-accent",
    detail: "Fairness index across promotion, compensation, and development decisions. Target: >90.",
  },
  {
    label: "Simulations Run",
    value: "2,847",
    change: "+312",
    positive: true,
    icon: Zap,
    color: "text-[#1c69d4]",
    detail: "This month: 847 promotion, 623 retention, 412 succession, 965 fairness audits.",
  },
];

/* ── Department risk data ─────────────────────────────────── */
const departments = [
  { name: "Battery Division", risk: 87, readiness: 62, flight: 18.7, color: "bg-destructive" },
  { name: "Autonomous Driving", risk: 72, readiness: 78, flight: 14.2, color: "bg-[#1c69d4]" },
  { name: "Production Munich", risk: 45, readiness: 84, flight: 8.1, color: "bg-accent" },
  { name: "Digital Services", risk: 68, readiness: 71, flight: 15.9, color: "bg-[#1c69d4]" },
  { name: "Supply Chain", risk: 53, readiness: 76, flight: 11.4, color: "bg-accent" },
];

/* ── Recent simulations ───────────────────────────────────── */
const recentSims = [
  { title: "Promotion Readiness — Battery Div.", type: "promotion", status: "completed", confidence: "92%", time: "2h ago" },
  { title: "Retention Risk — Autonomous Driving", type: "retention", status: "completed", confidence: "88%", time: "4h ago" },
  { title: "Fairness Audit — Munich Plant Q4", type: "fairness", status: "in_progress", confidence: "—", time: "Running" },
  { title: "Succession Gaps — Digital Services", type: "succession", status: "completed", confidence: "95%", time: "1d ago" },
  { title: "CV Evaluation — Senior PM Candidates", type: "cv", status: "completed", confidence: "91%", time: "1d ago" },
];

/* ── Talent pipeline ──────────────────────────────────────── */
const talent = [
  { name: "Sophie R.", role: "Production Lead", score: 92, status: "Ready", risk: "Low", avatar: "SR" },
  { name: "Anna K.", role: "Battery Engineer", score: 87, status: "Near-Ready", risk: "Medium", avatar: "AK" },
  { name: "Marcus L.", role: "Software Architect", score: 79, status: "Development", risk: "Low", avatar: "ML" },
  { name: "Dr. Thomas W.", role: "R&D Director", score: 85, status: "Ready", risk: "High", avatar: "TW" },
];

/* ── Fairness metrics ─────────────────────────────────────── */
const fairnessMetrics = [
  { label: "Gender Equity", value: 96, target: 95 },
  { label: "Age Neutrality", value: 91, target: 90 },
  { label: "Tenure Balance", value: 88, target: 90 },
  { label: "Cross-Dept Equity", value: 93, target: 90 },
];

/* ── Component ────────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const [expandedKpi, setExpandedKpi] = useState<number | null>(null);

  const statusColor = (s: string) =>
    s === "completed" ? "text-accent" : s === "in_progress" ? "text-[#1c69d4]" : "text-muted-foreground";
  const statusIcon = (s: string) =>
    s === "completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5 animate-pulse" />;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] relative">
      <AmbientBackground />
      <div className="noise-overlay" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-6">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground" style={{ letterSpacing: "-0.025em" }}>
              Leadership Intelligence
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time organizational health overview</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="glass rounded-lg px-3 py-1.5 text-xs text-muted-foreground border border-border flex items-center gap-2">
              <span>Q4 2025</span>
              <ChevronRight className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/20 bg-accent/5">
              <div className="w-2 h-2 rounded-full bg-accent" style={{ boxShadow: "0 0 6px #0ef0ad" }} />
              <span className="text-xs font-medium text-accent">Live • Munich Plant</span>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-foreground transition-all duration-300
                bg-gradient-to-br from-primary to-[#1c69d4]
                hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,102,177,0.4)]"
            >
              Run New Analysis
            </button>
          </div>
        </div>

        {/* ── KPI Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {kpis.map((kpi, i) => (
            <button
              key={kpi.label}
              onClick={() => setExpandedKpi(expandedKpi === i ? null : i)}
              className={`stat-card rounded-xl p-4 top-glow-border text-left transition-all duration-300 cursor-pointer
                ${expandedKpi === i ? "ring-1 ring-primary/40 bg-primary/5" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                <span className={`text-[10px] font-mono ${kpi.positive ? "text-accent" : "text-destructive"}`}>
                  {kpi.change}
                </span>
              </div>
              <p className={`font-display text-2xl md:text-3xl ${kpi.color}`} style={{ letterSpacing: "-0.03em" }}>
                {kpi.value}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mt-1">
                {kpi.label}
              </p>
              {expandedKpi === i && (
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border leading-relaxed animate-fade-in">
                  {kpi.detail}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* ── Middle: Two Column ──────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-4 mb-4">

          {/* Left — Risk Distribution (3 cols) */}
          <div className="lg:col-span-3 stat-card rounded-xl p-5 top-glow-border">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">Department Risk Distribution</h2>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">5 Departments</span>
            </div>
            <div className="space-y-4">
              {departments.map((d) => (
                <div key={d.name} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground">{d.name}</span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Readiness <strong className="text-foreground">{d.readiness}%</strong></span>
                      <span>Flight <strong className={d.flight > 15 ? "text-destructive" : "text-accent"}>{d.flight}%</strong></span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${d.color}`}
                      style={{ width: `${d.risk}%`, opacity: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mini radar-like chart */}
            <div className="mt-6 flex justify-center">
              <svg viewBox="0 0 200 200" className="w-40 h-40 opacity-80">
                {/* Grid circles */}
                {[80, 60, 40, 20].map((r) => (
                  <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(0,102,177,0.15)" strokeWidth="0.5" />
                ))}
                {/* Axes */}
                {[0, 72, 144, 216, 288].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  return <line key={angle} x1="100" y1="100" x2={100 + Math.cos(rad) * 80} y2={100 + Math.sin(rad) * 80} stroke="rgba(0,102,177,0.15)" strokeWidth="0.5" />;
                })}
                {/* Data polygon */}
                <polygon
                  points={departments.map((d, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const r = (d.risk / 100) * 75;
                    return `${100 + Math.cos(angle) * r},${100 + Math.sin(angle) * r}`;
                  }).join(" ")}
                  fill="rgba(0,102,177,0.15)" stroke="#0066B1" strokeWidth="1.5"
                />
                {/* Labels */}
                {departments.map((d, i) => {
                  const angle = (i * 72 - 90) * (Math.PI / 180);
                  return (
                    <text key={d.name} x={100 + Math.cos(angle) * 95} y={100 + Math.sin(angle) * 95}
                      textAnchor="middle" fill="#8899aa" fontSize="6" fontFamily="'JetBrains Mono', monospace">
                      {d.name.split(" ")[0]}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right — Recent Simulations (2 cols) */}
          <div className="lg:col-span-2 stat-card rounded-xl p-5 top-glow-border">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <h2 className="font-semibold text-sm text-foreground">Recent Simulations</h2>
              </div>
              <button onClick={() => navigate("/chat")} className="text-[10px] font-mono text-primary hover:text-accent transition-colors uppercase tracking-wider flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {recentSims.map((sim) => (
                <div key={sim.title} className="group p-3 rounded-lg bg-foreground/[0.02] border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-foreground leading-tight">{sim.title}</p>
                    <span className={`flex items-center gap-1 text-[10px] font-mono shrink-0 ${statusColor(sim.status)}`}>
                      {statusIcon(sim.status)}
                      {sim.confidence}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{sim.type}</span>
                    <span className="text-[10px] text-muted-foreground">• {sim.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom: Three Column ────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Talent Pipeline */}
          <div className="stat-card rounded-xl p-5 top-glow-border">
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-4 h-4 text-accent" />
              <h2 className="font-semibold text-sm text-foreground">Key Talent Pipeline</h2>
            </div>
            <div className="space-y-3">
              {talent.map((t) => (
                <div key={t.name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[11px] font-semibold text-foreground shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-display font-bold ${t.score >= 90 ? "text-accent" : t.score >= 80 ? "text-[#1c69d4]" : "text-foreground"}`}>
                      {t.score}%
                    </p>
                    <p className={`text-[10px] font-mono ${t.risk === "High" ? "text-destructive" : t.risk === "Medium" ? "text-[#1c69d4]" : "text-accent"}`}>
                      {t.risk} risk
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fairness Overview */}
          <div className="stat-card rounded-xl p-5 top-glow-border">
            <div className="flex items-center gap-2 mb-5">
              <Gauge className="w-4 h-4 text-accent" />
              <h2 className="font-semibold text-sm text-foreground">Fairness Overview</h2>
            </div>
            <div className="space-y-4">
              {fairnessMetrics.map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                    <span className={`text-xs font-mono font-medium ${m.value >= m.target ? "text-accent" : "text-destructive"}`}>
                      {m.value}/100
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden relative">
                    {/* Target marker */}
                    <div className="absolute top-0 h-full w-px bg-muted-foreground/40" style={{ left: `${m.target}%` }} />
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${m.value >= m.target ? "bg-accent" : "bg-destructive"}`}
                      style={{ width: `${m.value}%`, opacity: 0.85 }}
                    />
                  </div>
                </div>
              ))}

              {/* Overall gauge */}
              <div className="flex justify-center pt-4">
                <div className="relative w-28 h-14 overflow-hidden">
                  <svg viewBox="0 0 120 60" className="w-full h-full">
                    <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="#0ef0ad" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray="157" strokeDashoffset={157 * (1 - 0.92)} />
                  </svg>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <p className="font-display text-xl text-accent leading-none">92</p>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Overall</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="stat-card rounded-xl p-5 top-glow-border">
            <div className="flex items-center gap-2 mb-5">
              <Eye className="w-4 h-4 text-[#1c69d4]" />
              <h2 className="font-semibold text-sm text-foreground">Activity Feed</h2>
            </div>
            <div className="space-y-3">
              {[
                { text: "Promotion readiness batch complete", sub: "847 employees analyzed", time: "12m ago", dot: "bg-accent" },
                { text: "Bias alert: Tenure imbalance detected", sub: "Supply Chain division", time: "38m ago", dot: "bg-destructive" },
                { text: "New succession candidate identified", sub: "Dr. Thomas W. → VP Engineering", time: "1h ago", dot: "bg-[#1c69d4]" },
                { text: "Retention model updated", sub: "Incorporated Q4 survey data", time: "2h ago", dot: "bg-accent" },
                { text: "Fairness audit completed", sub: "Munich Plant — Score: 94/100", time: "3h ago", dot: "bg-accent" },
                { text: "Flight risk alert", sub: "3 key engineers flagged in Battery Div.", time: "5h ago", dot: "bg-destructive" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 group cursor-pointer">
                  <div className="flex flex-col items-center pt-1.5">
                    <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                    {i < 5 && <div className="w-px flex-1 bg-border/50 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-sm text-foreground leading-tight group-hover:text-primary transition-colors">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
