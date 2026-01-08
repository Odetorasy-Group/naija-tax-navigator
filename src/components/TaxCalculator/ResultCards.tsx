import { Wallet, Receipt, PiggyBank } from "lucide-react";
import { TaxResult, formatCurrency } from "@/lib/taxCalculations";

interface ResultCardsProps {
  result: TaxResult;
}

export function ResultCards({ result }: ResultCardsProps) {
  const monthlyDeductions = (result.pensionDeduction + result.nhfDeduction) / 12;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      {/* Monthly Take-Home - Hero Card */}
      <div className="sm:col-span-2 stat-card-primary">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium mb-1">
              Monthly Take-Home Pay
            </p>
            <p className="text-3xl md:text-4xl font-bold text-primary-foreground animate-number">
              {formatCurrency(result.monthlyTakeHome)}
            </p>
            <p className="text-primary-foreground/60 text-xs mt-2">
              Annual: {formatCurrency(result.annualTakeHome)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Monthly Tax */}
      <div className="stat-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1">
              Monthly Tax (2026)
            </p>
            <p className="text-xl md:text-2xl font-bold text-foreground">
              {result.isTaxFree ? (
                <span className="text-success">₦0</span>
              ) : (
                formatCurrency(result.monthlyTax)
              )}
            </p>
            {result.isTaxFree && (
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                Tax-Free Threshold
              </span>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-destructive" />
          </div>
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Effective Rate: {result.effectiveRate.toFixed(1)}%
        </p>
      </div>

      {/* Monthly Deductions */}
      <div className="stat-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1">
              Monthly Deductions
            </p>
            <p className="text-xl md:text-2xl font-bold text-foreground">
              {formatCurrency(monthlyDeductions)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-warning" />
          </div>
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Pension + NHF contributions
        </p>
      </div>
    </div>
  );
}
