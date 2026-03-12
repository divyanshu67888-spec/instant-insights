import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Loader2, ArrowRight, TrendingUp, Clock, Shield, MapPin, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Recommendation {
  rank: number;
  name: string;
  category: string;
  investmentRange: string;
  expectedMonthlyRevenue: string;
  timeToBreakeven: string;
  profitMargin: string;
  riskLevel: "low" | "medium" | "high";
  description: string;
  requirements: string[];
  pros: string[];
  cons: string[];
}

interface BudgetResult {
  recommendations: Recommendation[];
  budgetBreakdown: {
    totalBudget: string;
    recommendedReserve: string;
    deployableCapital: string;
    advice: string;
  };
  marketInsight: string;
}

const riskColors = {
  low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  high: "text-red-400 bg-red-400/10 border-red-400/20",
};

const BudgetAdvisor = () => {
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numBudget = parseFloat(budget.replace(/,/g, ""));
    if (!numBudget || numBudget <= 0) {
      toast({ title: "Invalid budget", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setExpandedCard(null);

    try {
      const { data, error } = await supabase.functions.invoke("budget-advisor", {
        body: { budget: numBudget, currency, location: location.trim() },
      });

      if (error) throw error;
      if (data?.error) {
        toast({ title: "Analysis Failed", description: data.error, variant: "destructive" });
        return;
      }

      setResult(data as BudgetResult);
    } catch (err) {
      console.error("Budget advisor error:", err);
      toast({ title: "Error", description: "Failed to get recommendations. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBudgetInput = (value: string) => {
    const raw = value.replace(/[^0-9.]/g, "");
    setBudget(raw);
  };

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "INR", symbol: "₹" },
    { code: "AED", symbol: "د.إ" },
    { code: "CAD", symbol: "C$" },
  ];

  const currentSymbol = currencies.find((c) => c.code === currency)?.symbol || "$";

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
            <span className="text-xs font-medium text-accent uppercase tracking-wider">Budget Advisor</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-display">
            What business can you start with your budget?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Enter your available investment amount and get AI-powered recommendations for the best business opportunities matched to your capital.
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
            <div className="flex gap-3">
              {/* Currency Select */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 w-24"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>

              {/* Budget Input */}
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {currentSymbol}
                </span>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => formatBudgetInput(e.target.value)}
                  placeholder="10,000"
                  className="w-full bg-secondary border border-border rounded-lg pl-8 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (optional) — e.g. New York, Dubai, London"
                className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-between items-center px-5 py-3 border-t border-border bg-secondary/30">
            <span className="text-xs text-muted-foreground">
              {budget ? `${currentSymbol}${parseFloat(budget || "0").toLocaleString()}` : "Enter your investment budget"}
            </span>
            <button
              type="submit"
              disabled={!budget || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Finding businesses…
                </>
              ) : (
                <>
                  Get recommendations
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
              className="space-y-6"
            >
              {/* Budget Breakdown */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Budget Breakdown
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
                    <p className="text-sm font-semibold text-foreground">{result.budgetBreakdown.totalBudget}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Emergency Reserve</p>
                    <p className="text-sm font-semibold text-accent">{result.budgetBreakdown.recommendedReserve}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Deployable Capital</p>
                    <p className="text-sm font-semibold text-primary">{result.budgetBreakdown.deployableCapital}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{result.budgetBreakdown.advice}</p>
              </div>

              {/* Market Insight */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-medium text-primary mb-1">Market Insight</p>
                <p className="text-sm text-foreground/80">{result.marketInsight}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Top Business Recommendations
                </h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => {
                    const isExpanded = expandedCard === i;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-xl border border-border bg-card overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedCard(isExpanded ? null : i)}
                          className="w-full text-left p-4 flex items-start gap-4 hover:bg-secondary/30 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">#{rec.rank}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-foreground">{rec.name}</h4>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${riskColors[rec.riskLevel]}`}>
                                {rec.riskLevel} risk
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{rec.category}</p>
                            <div className="flex gap-4 mt-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> {rec.investmentRange}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> {rec.expectedMonthlyRevenue}/mo
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {rec.timeToBreakeven}
                              </span>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-0 border-t border-border">
                                <p className="text-sm text-foreground/80 mt-3 mb-4">{rec.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="bg-secondary/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
                                    <p className="text-sm font-semibold text-primary">{rec.profitMargin}</p>
                                  </div>
                                  <div className="bg-secondary/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground mb-1">Breakeven</p>
                                    <p className="text-sm font-semibold text-foreground">{rec.timeToBreakeven}</p>
                                  </div>
                                </div>

                                {/* Requirements */}
                                <div className="mb-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Requirements
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {rec.requirements.map((req, j) => (
                                      <span key={j} className="text-[11px] px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                                        {req}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Pros & Cons */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs font-medium text-emerald-400 mb-1.5 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Pros
                                    </p>
                                    <ul className="space-y-1">
                                      {rec.pros.map((pro, j) => (
                                        <li key={j} className="text-xs text-muted-foreground">• {pro}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-amber-400 mb-1.5 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" /> Cons
                                    </p>
                                    <ul className="space-y-1">
                                      {rec.cons.map((con, j) => (
                                        <li key={j} className="text-xs text-muted-foreground">• {con}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BudgetAdvisor;
