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

  const handleSubmit = async (idea: string) => {
    setIsLoading(true);
    setReport(null);

    try {
      const { data, error } = await supabase.functions.invoke('war-room', {
        body: { idea },
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
      <IdeaInput onSubmit={handleSubmit} isLoading={isLoading} />

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
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-mono text-xs text-muted-foreground">
            RESEARCH VALIDATION ENGINE v3.0 — Multi-Agent AI Analysis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
