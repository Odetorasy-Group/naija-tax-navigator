import { Receipt, Building2, Home, Heart, Banknote } from "lucide-react";
import { TaxResult, formatCurrency } from "@/lib/taxCalculations";

interface DeductionsSummaryProps {
  result: TaxResult;
}

export function DeductionsSummary({ result }: DeductionsSummaryProps) {
  const deductions = [
    {
      label: "Pension (8%)",
      amount: result.pensionDeduction,
      icon: Building2,
      enabled: result.pensionDeduction > 0,
    },
    {
      label: "NHF (2.5%)",
      amount: result.nhfDeduction,
      icon: Home,
      enabled: result.nhfDeduction > 0,
    },
    {
      label: "Rent Relief (20%)",
      amount: result.rentRelief,
      icon: Banknote,
      enabled: result.rentRelief > 0,
    },
  ].filter((d) => d.enabled);

  if (deductions.length === 0) {
    return null;
  }

  return (
    <div className="card-elevated p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-primary" />
        Annual Deductions
      </h3>

      <div className="space-y-3">
        {deductions.map((deduction, index) => {
          const Icon = deduction.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">{deduction.label}</span>
              </div>
              <span className="font-semibold text-foreground">
                {formatCurrency(deduction.amount)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Total Deductions
        </span>
        <span className="text-lg font-bold text-foreground">
          {formatCurrency(result.totalDeductions)}
        </span>
      </div>
    </div>
  );
}
