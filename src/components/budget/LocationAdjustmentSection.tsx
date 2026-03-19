import { MapPin } from "lucide-react";
import type { BudgetAnalysis } from "./types";

const LocationAdjustmentSection = ({ data }: { data: BudgetAnalysis["locationAdjustment"] }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
      <MapPin className="w-4 h-4 text-primary" />
      Location-Based Cost Adjustment
    </h3>
    <div className="space-y-3">
      {(["tier1", "tier2", "tier3"] as const).map((tier) => (
        <div key={tier} className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">{data[tier].label}</p>
            <span className="text-xs font-semibold text-primary">{data[tier].costMultiplier}</span>
          </div>
          <ul className="space-y-0.5">
            {data[tier].keyDifferences.map((diff, i) => (
              <li key={i} className="text-xs text-muted-foreground">• {diff}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default LocationAdjustmentSection;
