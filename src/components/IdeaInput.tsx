import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, FlaskConical, Briefcase } from "lucide-react";

interface IdeaInputProps {
  onSubmit: (idea: string, mode: "research" | "business") => void;
  isLoading: boolean;
}

const modes = [
  {
    key: "research" as const,
    label: "Research",
    icon: FlaskConical,
    placeholder: "e.g. Investigating the impact of microplastics on freshwater ecosystems...",
    description: "Validate hypotheses with structured reasoning and live data",
  },
  {
    key: "business" as const,
    label: "Business",
    icon: Briefcase,
    placeholder: "e.g. A subscription service delivering organic produce to urban apartments...",
    description: "Market validation with competition analysis and revenue strategy",
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
    <section className="py-20 px-6 border-t border-border" id="war-room">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Describe your idea
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose a mode and let our agents do the rest.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex gap-1 p-1 bg-card border border-border rounded-lg w-fit mb-2"
        >
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.key;
            return (
              <button
                key={mode.key}
                type="button"
                onClick={() => setActiveMode(mode.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {mode.label}
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activeMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground mb-4"
          >
            {currentMode.description}
          </motion.p>
        </AnimatePresence>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
        >
          <div className="rounded-xl border border-border bg-card overflow-hidden focus-within:border-primary/40 transition-colors">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={currentMode.placeholder}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/40 p-4 resize-none focus:outline-none text-sm leading-relaxed min-h-[120px]"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center px-4 py-3 border-t border-border bg-secondary/30">
              <span className="text-xs text-muted-foreground">
                {idea.length > 0 ? `${idea.length} characters` : "Be as specific as possible"}
              </span>
              <button
                type="submit"
                disabled={!idea.trim() || isLoading}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    Run analysis
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default IdeaInput;
