import { useState } from "react";
import Hero from "@/components/Hero";
import IdeaInput from "@/components/IdeaInput";
import ValidationReport, { WarRoomReport } from "@/components/ValidationReport";
import Features from "@/components/Features";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [report, setReport] = useState<WarRoomReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (idea: string, mode: "research" | "business" = "research") => {
    setIsLoading(true);
    setReport(null);

    try {
      const { data, error } = await supabase.functions.invoke('war-room', {
        body: { idea, mode },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Analysis Failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setReport(data as WarRoomReport);
    } catch (err) {
      console.error('War Room error:', err);
      toast({
        title: "Error",
        description: "Failed to analyze your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Hero />
      <Features />
      <IdeaInput onSubmit={(idea, mode) => handleSubmit(idea, mode)} isLoading={isLoading} />

      {report && (
        <motion.div
          id="demo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ValidationReport report={report} />
        </motion.div>
      )}

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="w-12 h-[1px] gradient-warm mx-auto rounded-full" />
          <blockquote className="text-sm md:text-base text-muted-foreground italic leading-relaxed max-w-xl mx-auto">
            "Designed to assist academic and applied researchers by quickly validating hypotheses with live data and structured reasoning — reducing weeks of work into minutes."
          </blockquote>
          <p className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.2em] uppercase">
            Research Validation Engine v3.0 — Multi-Agent AI Analysis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
