import { motion } from "framer-motion";
import { Search, Zap, Shield, TrendingUp, Globe, Brain } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Live Market Search",
    description: "Real-time data from live search APIs — not stale training data. Current prices, trends, and competitor moves.",
  },
  {
    icon: Brain,
    title: "Agent Personas",
    description: "6 specialized AI agents analyze your idea from every angle: market fit, competition, pricing, risks, and growth.",
  },
  {
    icon: Zap,
    title: "60-Second Reports",
    description: "What used to take weeks and thousands of dollars now takes a single minute. Full 360° validation.",
  },
  {
    icon: Globe,
    title: "Geo-Targeted Intel",
    description: "Localized insights — from petrol prices in Delhi to trending hashtags in New York. Context matters.",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Identify blind spots, regulatory hurdles, and market risks before you invest a single rupee.",
  },
  {
    icon: TrendingUp,
    title: "Opportunity Scoring",
    description: "Proprietary scoring algorithm rates your idea across 12 dimensions. Data-driven go/no-go decisions.",
  },
];

const Features = () => {
  return (
    <section className="py-28 px-6 relative">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(174_80%_46%/0.03)_0%,transparent_60%)]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">
            Intelligence Stack
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Why This Isn't Just{" "}
            <span className="gradient-warm-text">Another AI Chat</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group card-premium rounded-2xl p-7 transition-all duration-500"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2.5 font-display">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
