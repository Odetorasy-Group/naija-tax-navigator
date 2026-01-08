import { BarChart3 } from "lucide-react";
import { TaxResult, formatCurrency } from "@/lib/taxCalculations";

interface TaxBreakdownProps {
  result: TaxResult;
}

export function TaxBreakdown({ result }: TaxBreakdownProps) {
  const maxTaxable = Math.max(...result.taxBands.map((b) => b.taxableAmount), 1);

  if (result.isTaxFree || result.taxBands.length === 0) {
    return null;
  }

  return (
    <div className="card-elevated p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        Tax Band Breakdown
      </h3>

      <div className="space-y-3">
        {result.taxBands.map((band, index) => {
          const widthPercent = (band.taxableAmount / maxTaxable) * 100;
          const colors = [
            "bg-success",
            "bg-primary/70",
            "bg-primary",
            "bg-warning/80",
            "bg-warning",
            "bg-destructive/80",
          ];

          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{band.label}</span>
                <span className="font-medium text-foreground">
                  {(band.rate * 100).toFixed(0)}%
                </span>
              </div>
              
              <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 ${colors[index]} rounded-lg transition-all duration-700 ease-out`}
                  style={{ width: `${Math.max(widthPercent, 2)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <span className="text-xs font-medium text-foreground/80 z-10">
                    {formatCurrency(band.taxableAmount)}
                  </span>
                  <span className="text-xs font-semibold text-foreground z-10">
                    Tax: {formatCurrency(band.taxAmount)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Annual Tax</span>
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(result.annualTax)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-muted-foreground">Chargeable Income</span>
          <span className="text-sm font-medium text-foreground">
            {formatCurrency(result.chargeableIncome)}
          </span>
        </div>
      </div>
    </div>
  );
}
