import { motion } from "framer-motion";
import { User, CheckCircle, AlertTriangle, TrendingUp, DollarSign, Users, Shield } from "lucide-react";

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

export interface WarRoomReport {
  score: number;
  verdict: string;
  agents: AgentReport[];
}

interface ValidationReportProps {
  report: WarRoomReport;
}

const ValidationReport = ({ report }: ValidationReportProps) => {
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
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Opportunity Score
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-6xl font-bold text-primary glow-text font-mono">{report.score}</span>
            <span className="text-muted-foreground text-lg">/100</span>
          </div>
          <p className="text-sm text-success font-mono mt-2 flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            {report.verdict}
          </p>
        </motion.div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="font-mono text-xs text-primary font-bold tracking-wider">
                      {agent.name}
                    </p>
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
                <p className="text-sm text-secondary-foreground leading-relaxed">
                  {agent.finding}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValidationReport;
