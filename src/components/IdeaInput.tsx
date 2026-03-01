import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, Loader2 } from "lucide-react";

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

const IdeaInput = ({ onSubmit, isLoading }: IdeaInputProps) => {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) onSubmit(idea.trim());
  };

  return (
    <section className="py-20 px-6 relative" id="war-room">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
            Research Input
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Enter Your Research Idea
          </h2>
          <p className="text-muted-foreground">
            Describe your research idea, business concept, or hypothesis — our 4-agent validation engine will analyze it.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className="rounded-lg border border-border bg-card glow-primary p-1">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. A subscription service delivering farm-fresh organic produce to urban apartments in Bangalore..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 p-4 rounded-md resize-none focus:outline-none font-mono text-sm leading-relaxed min-h-[120px]"
              disabled={isLoading}
            />
            <div className="flex justify-end p-2">
              <button
                type="submit"
                disabled={!idea.trim() || isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validating...
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
