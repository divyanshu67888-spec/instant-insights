import { motion } from "framer-motion";
import { Search, Zap, Shield, TrendingUp, Globe, Brain } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Live market data",
    description: "Pulls real-time data from search APIs — current prices, trends, and competitor activity. Not stale training data.",
  },
  {
    icon: Brain,
    title: "6 specialized agents",
    description: "Each agent analyzes a different dimension: market fit, competition, pricing, risks, opportunities, and growth potential.",
  },
  {
    icon: Zap,
    title: "Results in 60 seconds",
    description: "What used to require weeks of research and thousands in consulting fees now takes a single minute.",
  },
  {
    icon: Globe,
    title: "Geo-targeted insights",
    description: "Localized intelligence — from petrol prices in Delhi to trending topics in New York. Context that matters.",
  },
  {
    icon: Shield,
    title: "Risk identification",
    description: "Surface blind spots, regulatory hurdles, and market risks before committing any resources.",
  },
  {
    icon: TrendingUp,
    title: "Opportunity scoring",
    description: "Rates your idea across 12 dimensions with a clear go/no-go recommendation backed by data.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 max-w-lg"
        >
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
            How it works
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
            Six agents, one report, zero guesswork
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-card p-7 hover:bg-secondary/50 transition-colors"
            >
              <feature.icon className="w-5 h-5 text-primary mb-4" />
              <h3 className="text-sm font-semibold text-foreground mb-2">
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
