import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, Loader2, FlaskConical, Briefcase } from "lucide-react";

interface IdeaInputProps {
  onSubmit: (idea: string, mode: "research" | "business") => void;
  isLoading: boolean;
}

const modes = [
  {
    key: "research" as const,
    label: "Research",
    icon: FlaskConical,
    placeholder:
      "e.g. Investigating the impact of microplastics on freshwater ecosystems using spectroscopic analysis...",
    description: "Validate hypotheses with structured reasoning & live data",
  },
  {
    key: "business" as const,
    label: "Business",
    icon: Briefcase,
    placeholder:
      "e.g. A subscription service delivering farm-fresh organic produce to urban apartments in Bangalore...",
    description: "Generate solid business ideas with market validation & competition analysis",
  },
];

const IdeaInput = ({ onSubmit, isLoading }: IdeaInputProps) => {
  const [idea, setIdea] = useState("");
  const [activeMode, setActiveMode] = useState<"research" | "business">("research");

  const currentMode = modes.find((m) => m.key === activeMode)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) onSubmit(idea.trim(), activeMode);
  };

  return (
    <section className="py-24 px-6 relative" id="war-room">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-mono text-primary text-xs tracking-[0.2em] uppercase mb-4">
            Command Center
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Enter Your Idea
          </h2>
          <p className="text-muted-foreground text-sm">
            Choose a mode and describe your idea — our multi-agent engine will analyze it.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="flex justify-center gap-2 mb-4"
        >
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.key;
            return (
              <button
                key={mode.key}
                type="button"
                onClick={() => setActiveMode(mode.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "gradient-warm text-primary-foreground shadow-lg shadow-primary/15"
                    : "bg-secondary/50 text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </button>
            );
          })}
        </motion.div>

        {/* Mode description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeMode}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-center text-xs text-muted-foreground font-mono mb-6"
          >
            {currentMode.description}
          </motion.p>
        </AnimatePresence>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className="card-premium rounded-2xl p-1.5 transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_40px_hsl(174_80%_46%/0.08)]">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={currentMode.placeholder}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/40 p-5 rounded-xl resize-none focus:outline-none font-mono text-sm leading-relaxed min-h-[140px]"
              disabled={isLoading}
            />
            <div className="flex justify-end p-3 pt-0">
              <button
                type="submit"
                disabled={!idea.trim() || isLoading}
                className="flex items-center gap-2 px-7 py-3 rounded-xl gradient-warm text-primary-foreground font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-primary/15"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Crosshair className="w-4 h-4" />
                      Run Validation
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default IdeaInput;
