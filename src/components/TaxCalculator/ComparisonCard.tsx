import { ArrowDown, ArrowUp, TrendingDown, TrendingUp, Scale, Minus } from "lucide-react";
import { TaxResult, formatCurrency } from "@/lib/taxCalculations";

interface ComparisonCardProps {
  result: TaxResult;
}

export function ComparisonCard({ result }: ComparisonCardProps) {
  const { isNewLawBetter, monthlySavings, taxSavings, savingsPercentage } = result;
  const hasChange = Math.abs(taxSavings) > 0;
  
  // Determine styling based on whether the new law is better
  const cardClass = isNewLawBetter && hasChange
    ? "border-success/40 bg-gradient-to-br from-success/5 to-success/10"
    : !isNewLawBetter && hasChange
    ? "border-destructive/40 bg-gradient-to-br from-destructive/5 to-destructive/10"
    : "border-border bg-secondary/30";
  
  const iconBgClass = isNewLawBetter && hasChange
    ? "bg-success/20"
    : !isNewLawBetter && hasChange
    ? "bg-destructive/20"
    : "bg-muted";
  
  const iconClass = isNewLawBetter && hasChange
    ? "text-success"
    : !isNewLawBetter && hasChange
    ? "text-destructive"
    : "text-muted-foreground";
  
  const amountClass = isNewLawBetter && hasChange
    ? "text-success"
    : !isNewLawBetter && hasChange
    ? "text-destructive"
    : "text-foreground";

  return (
    <div 
      className={`card-elevated p-4 md:p-6 border-2 animate-slide-up ${cardClass}`}
      style={{ animationDelay: "0.25s" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          2021 vs 2026 Tax Comparison
        </h3>
      </div>

      {/* Main Comparison Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* Old Tax */}
        <div className="text-center p-4 rounded-xl bg-background/80 border border-border">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            Old Law (2021)
          </p>
          <p className="text-lg md:text-xl font-bold text-foreground">
            {formatCurrency(result.oldLawMonthlyTax)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            /month
          </p>
        </div>

        {/* Arrow/Indicator */}
        <div className="flex items-center justify-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgClass}`}>
            {isNewLawBetter && hasChange ? (
              <TrendingDown className={`w-6 h-6 ${iconClass}`} />
            ) : !isNewLawBetter && hasChange ? (
              <TrendingUp className={`w-6 h-6 ${iconClass}`} />
            ) : (
              <Minus className={`w-6 h-6 ${iconClass}`} />
            )}
          </div>
        </div>

        {/* New Tax */}
        <div className="text-center p-4 rounded-xl bg-background/80 border border-border">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            New Law (2026)
          </p>
          <p className="text-lg md:text-xl font-bold text-foreground">
            {formatCurrency(result.monthlyTax)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            /month
          </p>
        </div>
      </div>

      {/* Net Change Highlight */}
      {hasChange && (
        <div className={`p-4 rounded-xl ${isNewLawBetter ? 'bg-success/10' : 'bg-destructive/10'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClass}`}>
              {isNewLawBetter ? (
                <ArrowDown className={`w-5 h-5 ${iconClass}`} />
              ) : (
                <ArrowUp className={`w-5 h-5 ${iconClass}`} />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${amountClass}`}>
                Under the new law, you will {isNewLawBetter ? "save" : "pay"}{" "}
                <span className="text-base">{formatCurrency(Math.abs(monthlySavings))}</span> monthly
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Annual {isNewLawBetter ? "savings" : "increase"}: {formatCurrency(Math.abs(taxSavings))} 
                {savingsPercentage > 0 && ` (${Math.abs(savingsPercentage).toFixed(1)}% ${isNewLawBetter ? "less" : "more"} tax)`}
              </p>
            </div>
          </div>
        </div>
      )}

      {!hasChange && (
        <div className="p-4 rounded-xl bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">
            No change in tax amount between the old and new law
          </p>
        </div>
      )}

      {/* Effective Rate Comparison */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Effective Tax Rate</span>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              <span className="line-through">{result.oldEffectiveRate.toFixed(1)}%</span>
            </span>
            <span className="text-foreground font-medium">
              → {result.effectiveRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Old Law Details (Collapsible info) */}
      {result.oldTaxBreakdown.usedMinimumTax && (
        <div className="mt-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-xs text-warning-foreground">
            <strong>Note:</strong> Under the old law, the minimum tax rule (1% of gross = {formatCurrency(result.oldTaxBreakdown.minimumTax)}) 
            was applied as it exceeded the calculated tax.
          </p>
        </div>
      )}
    </div>
  );
}
