import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Loader2, ArrowRight, MapPin, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { BudgetAnalysis } from "./budget/types";
import BusinessOverviewSection from "./budget/BusinessOverviewSection";
import CostBreakdownSection from "./budget/CostBreakdownSection";
import BudgetScenariosSection from "./budget/BudgetScenariosSection";
import LocationAdjustmentSection from "./budget/LocationAdjustmentSection";
import HiddenCostsSection from "./budget/HiddenCostsSection";
import InvestmentSummarySection from "./budget/InvestmentSummarySection";
import ProfitEstimationSection from "./budget/ProfitEstimationSection";
import SmartInsightsSection from "./budget/SmartInsightsSection";
import GrowthPlanSection from "./budget/GrowthPlanSection";

const budgetOptions = ["Low", "Medium", "High"] as const;
const locationOptions = ["Tier 1 (Metro)", "Tier 2", "Tier 3", "Custom"] as const;

const BudgetAdvisor = () => {
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [locationMode, setLocationMode] = useState<string>("Tier 1 (Metro)");
  const [budgetPreference, setBudgetPreference] = useState<string>("Medium");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BudgetAnalysis | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = locationMode === "Custom" ? location.trim() : locationMode;
    if (!businessName.trim()) {
      toast({ title: "Missing info", description: "Please enter a business idea.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("budget-advisor", {
        body: { businessName: businessName.trim(), location: finalLocation, budgetPreference },
      });

      if (error) throw error;
      if (data?.error) {
        toast({ title: "Analysis Failed", description: data.error, variant: "destructive" });
        return;
      }

      setResult(data as BudgetAnalysis);
    } catch (err) {
      console.error("Budget advisor error:", err);
      toast({ title: "Error", description: "Failed to get analysis. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 border-t border-border" id="budget-advisor">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xs font-medium text-accent uppercase tracking-wider">Business Cost Advisor</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-display">
            Complete Business Cost Analysis
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Enter your business idea, location tier, and budget preference to get a detailed cost breakdown, profit estimation, and growth plan tailored for Indian markets.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card overflow-hidden mb-8"
        >
          <div className="p-5 space-y-4">
            {/* Business Name */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Business Idea — e.g. Cloud Kitchen, Chai Franchise, SaaS Product"
                className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40"
                disabled={isLoading}
              />
            </div>

            {/* Location & Budget */}
            <div className="flex gap-3 flex-wrap">
              {/* Location Tier */}
              <div className="flex-1 min-w-[180px]">
                <label className="text-xs text-muted-foreground mb-1 block">Location</label>
                <select
                  value={locationMode}
                  onChange={(e) => setLocationMode(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40"
                  disabled={isLoading}
                >
                  {locationOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Budget Preference */}
              <div className="flex-1 min-w-[180px]">
                <label className="text-xs text-muted-foreground mb-1 block">Budget Level</label>
                <div className="flex gap-1.5">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setBudgetPreference(opt)}
                      disabled={isLoading}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        budgetPreference === opt
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-muted-foreground border-border hover:border-primary/40"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom location input */}
            {locationMode === "Custom" && (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city name — e.g. Jaipur, Pune, Coimbatore"
                  className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center px-5 py-3 border-t border-border bg-secondary/30">
            <span className="text-xs text-muted-foreground">
              {businessName ? `"${businessName}" · ${locationMode === "Custom" ? location || "Custom" : locationMode} · ${budgetPreference} budget` : "Enter your business idea to get started"}
            </span>
            <button
              type="submit"
              disabled={!businessName.trim() || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing costs…
                </>
              ) : (
                <>
                  Get Cost Analysis
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <BusinessOverviewSection data={result.businessOverview} />
              <CostBreakdownSection data={result.costBreakdown} />
              <BudgetScenariosSection data={result.budgetScenarios} />
              <LocationAdjustmentSection data={result.locationAdjustment} />
              <HiddenCostsSection data={result.hiddenCosts} />
              <InvestmentSummarySection data={result.investmentSummary} />
              <ProfitEstimationSection data={result.profitEstimation} />
              <SmartInsightsSection data={result.smartInsights} />
              <GrowthPlanSection data={result.growthPlan} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BudgetAdvisor;
