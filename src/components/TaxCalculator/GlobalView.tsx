import { useMemo } from "react";
import { Globe, ArrowRightLeft, DollarSign } from "lucide-react";
import { 
  calculateTax, 
  formatCurrency, 
  CURRENCY_RATES, 
  convertFromNGN,
  TaxInputs 
} from "@/lib/taxCalculations";

interface GlobalViewProps {
  sharedGross: number;
}

export function GlobalView({ sharedGross }: GlobalViewProps) {
  const result = useMemo(() => {
    if (sharedGross <= 0) return null;
    return calculateTax({
      grossSalary: sharedGross,
      isAnnual: false,
      annualRent: 0,
      pensionEnabled: true,
      nhfEnabled: true,
      lifeAssuranceEnabled: false,
    });
  }, [sharedGross]);

  const currencies = [
    { code: "USD" as const, symbol: "$", name: "US Dollar", flag: "🇺🇸" },
    { code: "GBP" as const, symbol: "£", name: "British Pound", flag: "🇬🇧" },
    { code: "EUR" as const, symbol: "€", name: "Euro", flag: "🇪🇺" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="card-elevated p-4 md:p-6 animate-slide-up">
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Global Salary Comparison
        </h2>

        <p className="text-sm text-muted-foreground mb-4">
          See how your Nigerian salary compares internationally. Exchange rates are approximate.
        </p>

        <div className="p-4 rounded-xl bg-secondary/50 border border-border mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🇳🇬</span>
            <div>
              <p className="text-xs text-muted-foreground">Nigerian Naira (NGN)</p>
              <p className="text-xl font-bold text-foreground">
                {sharedGross > 0 ? formatCurrency(sharedGross) : "₦0"}/month
              </p>
            </div>
          </div>
          {sharedGross <= 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Enter a salary in the Standard Calculator tab to see conversions
            </p>
          )}
        </div>

        {sharedGross > 0 && (
          <div className="flex items-center justify-center my-4">
            <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
          </div>
        )}

        {sharedGross > 0 && (
          <div className="space-y-3">
            {currencies.map((currency) => {
              const convertedGross = convertFromNGN(sharedGross, currency.code);
              const convertedNet = result ? convertFromNGN(result.monthlyTakeHome, currency.code) : 0;
              
              return (
                <div 
                  key={currency.code}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currency.flag}</span>
                      <div>
                        <p className="text-xs text-muted-foreground">{currency.name} ({currency.code})</p>
                        <p className="text-lg font-bold text-foreground">
                          {currency.symbol}{convertedGross.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Net Take-Home</p>
                      <p className="text-sm font-semibold text-primary">
                        {currency.symbol}{convertedNet.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exchange Rates Info */}
      <div className="card-elevated p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          Current Exchange Rates
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Approximate rates for reference only. Actual rates may vary.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {currencies.map((currency) => (
            <div 
              key={currency.code}
              className="p-2 rounded-lg bg-secondary/50 text-center"
            >
              <p className="text-xs text-muted-foreground">{currency.code}</p>
              <p className="text-sm font-medium text-foreground">
                ₦{CURRENCY_RATES[currency.code].toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {result && sharedGross > 0 && (
        <div className="card-elevated p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Nigerian Tax Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Gross</span>
              <span className="font-medium">{formatCurrency(sharedGross)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">PAYE Tax (2026)</span>
              <span className="font-medium text-destructive">-{formatCurrency(result.monthlyTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deductions</span>
              <span className="font-medium text-warning">-{formatCurrency((result.pensionDeduction + result.nhfDeduction) / 12)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Net</span>
              <span className="font-bold text-primary">{formatCurrency(result.monthlyTakeHome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Effective Tax Rate</span>
              <span className="font-medium">{result.effectiveRate.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
