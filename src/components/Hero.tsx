import { motion } from "framer-motion";
import { Crosshair, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(174_80%_46%/0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(32_95%_58%/0.05)_0%,transparent_50%)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-[100px] animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-accent/5 blur-[80px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-border bg-secondary/60 backdrop-blur-sm font-mono text-xs text-primary tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            Live Intelligence Active
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold text-foreground leading-[1.05] mb-8"
        >
          The AI{" "}
          <span className="gradient-warm-text">War Room</span>
          <br />
          <span className="text-foreground/80">for Validation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Deploy 6 AI agents across the live web. Get a 360° validation report
          with real-time data — in <span className="text-accent font-semibold">60 seconds</span>, not 6 weeks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#war-room"
            className="group flex items-center gap-2.5 px-8 py-3.5 rounded-xl gradient-warm text-primary-foreground font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
          >
            <Crosshair className="w-4 h-4" />
            Launch War Room
            <Sparkles className="w-3.5 h-3.5 opacity-70" />
          </a>
          <a
            href="#demo"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border text-foreground/80 font-semibold text-sm hover:bg-secondary/60 hover:border-primary/20 transition-all duration-300"
          >
            See Demo Report ↓
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-24 grid grid-cols-3 gap-6 max-w-md mx-auto"
        >
          {[
            { value: "60s", label: "Report Time" },
            { value: "6", label: "AI Agents" },
            { value: "Live", label: "Market Data" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="text-center p-4 rounded-xl bg-secondary/30 backdrop-blur-sm border border-border/50"
            >
              <p className="text-2xl md:text-3xl font-bold gradient-warm-text font-mono">
                {stat.value}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-1.5">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
