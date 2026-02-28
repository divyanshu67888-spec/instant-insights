import { motion } from "framer-motion";
import { User, CheckCircle, AlertTriangle, TrendingUp, DollarSign, Users, Shield, Lightbulb, Rocket, Zap, Target } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, AreaChart, Area } from "recharts";

const iconMap: Record<string, React.ElementType> = {
  SCOUT: TrendingUp,
  VIPER: Users,
  ORACLE: DollarSign,
  SENTINEL: Shield,
  ECHO: User,
  PHANTOM: TrendingUp,
};

export interface AgentReport {
  name: string;
  role: string;
  finding: string;
  sentiment: "positive" | "warning" | "neutral";
}

export interface Competitor {
  name: string;
  marketShare: number;
  strength: string;
  weakness: string;
}

export interface DimensionScore {
  dimension: string;
  score: number;
}

export interface MarketMetrics {
  tam: string;
  sam: string;
  som: string;
  cagr: string;
  yearOverYear: { year: string; value: number }[];
}

export interface Improvement {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  type: "core" | "outOfBox";
}

export interface WarRoomReport {
  score: number;
  verdict: string;
  agents: AgentReport[];
  marketMetrics?: MarketMetrics;
  competitors?: Competitor[];
  dimensionScores?: DimensionScore[];
  improvements?: Improvement[];
}

interface ValidationReportProps {
  report: WarRoomReport;
}

const CHART_COLORS = [
  "hsl(186, 100%, 50%)",
  "hsl(39, 100%, 55%)",
  "hsl(142, 70%, 45%)",
  "hsl(270, 70%, 60%)",
  "hsl(340, 80%, 55%)",
  "hsl(200, 80%, 55%)",
];

const impactColor: Record<string, string> = {
  high: "text-success",
  medium: "text-accent",
  low: "text-muted-foreground",
};

const ValidationReport = ({ report }: ValidationReportProps) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
            AI-Generated Report
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            360° Validation Report
          </h2>
        </motion.div>

        {/* Score Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8 p-6 rounded-lg bg-card border border-border glow-primary text-center"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Opportunity Score</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-6xl font-bold text-primary glow-text font-mono">{report.score}</span>
            <span className="text-muted-foreground text-lg">/100</span>
          </div>
          <p className="text-sm text-success font-mono mt-2 flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            {report.verdict}
          </p>
        </motion.div>

        {/* Dimension Radar + Market Growth Charts */}
        {(report.dimensionScores || report.marketMetrics?.yearOverYear) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {report.dimensionScores && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-5 rounded-lg bg-card border border-border"
              >
                <p className="font-mono text-xs text-primary tracking-widest uppercase mb-4">Dimension Analysis</p>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={report.dimensionScores}>
                    <PolarGrid stroke="hsl(222, 25%, 16%)" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                    <Radar dataKey="score" stroke="hsl(186, 100%, 50%)" fill="hsl(186, 100%, 50%)" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {report.marketMetrics?.yearOverYear && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-5 rounded-lg bg-card border border-border"
              >
                <p className="font-mono text-xs text-primary tracking-widest uppercase mb-1">Market Growth Projection</p>
                {report.marketMetrics.cagr && (
                  <p className="text-xs text-muted-foreground mb-3">CAGR: {report.marketMetrics.cagr}</p>
                )}
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={report.marketMetrics.yearOverYear}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(186, 100%, 50%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(186, 100%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
                    <XAxis dataKey="year" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(222, 40%, 9%)", border: "1px solid hsl(222, 25%, 16%)", borderRadius: 8, fontSize: 12 }}
                      formatter={(value: number) => [`$${value}B`, "Market Size"]}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(186, 100%, 50%)" fill="url(#areaGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        )}

        {/* TAM / SAM / SOM */}
        {report.marketMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {[
              { label: "TAM", value: report.marketMetrics.tam },
              { label: "SAM", value: report.marketMetrics.sam },
              { label: "SOM", value: report.marketMetrics.som },
            ].map((m) => (
              <div key={m.label} className="p-4 rounded-lg bg-card border border-border text-center">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{m.label}</p>
                <p className="text-xl md:text-2xl font-bold text-primary font-mono mt-1">{m.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {report.agents.map((agent, index) => {
            const Icon = iconMap[agent.name] || TrendingUp;
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-5 rounded-lg bg-card border border-border hover:border-glow transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-primary font-bold tracking-wider">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                  <div className="ml-auto">
                    {agent.sentiment === "positive" ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : agent.sentiment === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-accent" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-secondary-foreground leading-relaxed">{agent.finding}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Market Competition */}
        {report.competitors && report.competitors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <p className="font-mono text-sm text-primary tracking-widest uppercase">Market Competition</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Pie Chart */}
              <div className="p-5 rounded-lg bg-card border border-border">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Market Share Distribution</p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={report.competitors}
                      dataKey="marketShare"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      strokeWidth={2}
                      stroke="hsl(222, 40%, 9%)"
                      label={({ name, marketShare }) => `${name} ${marketShare}%`}
                      labelLine={false}
                    >
                      {report.competitors.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "hsl(222, 40%, 9%)", border: "1px solid hsl(222, 25%, 16%)", borderRadius: 8, fontSize: 12 }}
                      formatter={(value: number) => [`${value}%`, "Market Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Competitor Cards */}
              <div className="space-y-3">
                {report.competitors.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 rounded-lg bg-card border border-border flex items-start gap-3"
                  >
                    <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-mono text-sm font-bold text-foreground">{c.name}</p>
                        <span className="font-mono text-xs text-primary">{c.marketShare}%</span>
                      </div>
                      <p className="text-xs text-success">✓ {c.strength}</p>
                      <p className="text-xs text-accent">⚠ {c.weakness}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Dimension Bar Chart */}
        {report.dimensionScores && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 p-5 rounded-lg bg-card border border-border"
          >
            <p className="font-mono text-xs text-primary tracking-widest uppercase mb-4">Opportunity Breakdown</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={report.dimensionScores} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                <YAxis type="category" dataKey="dimension" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} width={100} />
                <Tooltip
                  contentStyle={{ background: "hsl(222, 40%, 9%)", border: "1px solid hsl(222, 25%, 16%)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {report.dimensionScores.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Improvements & Out-of-Box Ideas */}
        {report.improvements && report.improvements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-accent" />
              <p className="font-mono text-sm text-accent tracking-widest uppercase">Improvements & Bold Ideas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.improvements.map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg bg-card border border-border hover:border-glow transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {idea.type === "outOfBox" ? (
                      <Rocket className="w-4 h-4 text-accent" />
                    ) : (
                      <Zap className="w-4 h-4 text-primary" />
                    )}
                    <p className="font-mono text-xs font-bold text-foreground">{idea.title}</p>
                    <span className={`ml-auto font-mono text-[10px] uppercase tracking-wider ${impactColor[idea.impact]}`}>
                      {idea.impact}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{idea.description}</p>
                  <span className={`inline-block mt-2 font-mono text-[10px] px-2 py-0.5 rounded ${idea.type === "outOfBox" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                    {idea.type === "outOfBox" ? "OUT OF BOX" : "CORE"}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ValidationReport;
