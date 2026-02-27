import { motion } from "framer-motion";
import { User, CheckCircle, AlertTriangle, TrendingUp, DollarSign, Users, Shield } from "lucide-react";

interface Agent {
  name: string;
  role: string;
  icon: React.ElementType;
  status: "complete" | "scanning" | "idle";
  finding: string;
  sentiment: "positive" | "warning" | "neutral";
}

const agents: Agent[] = [
  {
    name: "SCOUT",
    role: "Market Size Analyst",
    icon: TrendingUp,
    status: "complete",
    finding: "TAM estimated at $4.2B with 18% CAGR. Urban organic food market growing 3x faster than traditional grocery.",
    sentiment: "positive",
  },
  {
    name: "VIPER",
    role: "Competitor Intel",
    icon: Users,
    status: "complete",
    finding: "12 active competitors identified. Top 3 hold 60% market share. Gap found in same-day delivery for Tier-2 cities.",
    sentiment: "warning",
  },
  {
    name: "ORACLE",
    role: "Pricing Strategist",
    icon: DollarSign,
    status: "complete",
    finding: "Sweet spot pricing: ₹1,200-1,800/month subscription. 40% margin achievable at 500+ subscribers per city.",
    sentiment: "positive",
  },
  {
    name: "SENTINEL",
    role: "Risk Assessor",
    icon: Shield,
    status: "complete",
    finding: "Cold chain logistics is the primary risk. FSSAI compliance required. Seasonal supply volatility needs hedging.",
    sentiment: "warning",
  },
  {
    name: "ECHO",
    role: "Customer Voice",
    icon: User,
    status: "complete",
    finding: "87% of surveyed urban millennials willing to pay premium for verified organic. Trust & traceability are top demands.",
    sentiment: "positive",
  },
  {
    name: "PHANTOM",
    role: "Trend Tracker",
    icon: TrendingUp,
    status: "complete",
    finding: "#OrganicIndia trending +240% YoY. Government pushing organic farming subsidies. Strong tailwinds detected.",
    sentiment: "positive",
  },
];

const ValidationReport = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
            Sample Output
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            360° Validation Report
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Here's what a real War Room report looks like for an organic produce delivery startup.
          </p>
        </motion.div>

        {/* Score Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8 p-6 rounded-lg bg-card border border-border glow-primary text-center"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Opportunity Score
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-6xl font-bold text-primary glow-text font-mono">78</span>
            <span className="text-muted-foreground text-lg">/100</span>
          </div>
          <p className="text-sm text-success font-mono mt-2 flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            VIABLE — Proceed with caution on logistics
          </p>
        </motion.div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent, index) => (
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
                  <agent.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-xs text-primary font-bold tracking-wider">
                    {agent.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
                <div className="ml-auto">
                  {agent.sentiment === "positive" ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-accent" />
                  )}
                </div>
              </div>
              <p className="text-sm text-secondary-foreground leading-relaxed">
                {agent.finding}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValidationReport;
