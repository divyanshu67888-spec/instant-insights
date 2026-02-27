import { useState } from "react";
import Hero from "@/components/Hero";
import IdeaInput from "@/components/IdeaInput";
import ValidationReport from "@/components/ValidationReport";
import Features from "@/components/Features";
import { motion } from "framer-motion";

const Index = () => {
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (idea: string) => {
    setIsLoading(true);
    // Simulate agent deployment
    setTimeout(() => {
      setIsLoading(false);
      setShowReport(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Hero />
      <Features />
      <IdeaInput onSubmit={handleSubmit} isLoading={isLoading} />

      {showReport && (
        <motion.div
          id="demo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ValidationReport />
        </motion.div>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-mono text-xs text-muted-foreground">
            WAR ROOM v1.0 — AI-Powered Market Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
