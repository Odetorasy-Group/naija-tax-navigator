import { useState, useMemo } from "react";
import { Target, Lightbulb, TrendingUp } from "lucide-react";
import { findGrossFromNet, formatCurrency } from "@/lib/taxCalculations";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface IncomeTargeterProps {
  onGrossFound?: (gross: number) => void;
}

export function IncomeTargeter({ onGrossFound }: IncomeTargeterProps) {
  const [targetNetInput, setTargetNetInput] = useState("");
  const [pensionEnabled, setPensionEnabled] = useState(true);
  const [nhfEnabled, setNhfEnabled] = useState(true);

  const targetNet = targetNetInput ? parseInt(targetNetInput.replace(/,/g, ""), 10) : 0;

  const result = useMemo(() => {
    if (targetNet <= 0) return null;
    return findGrossFromNet(targetNet, pensionEnabled, nhfEnabled);
  }, [targetNet, pensionEnabled, nhfEnabled]);

  const handleInputChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setTargetNetInput(cleanValue);
  };

  const formatDisplayValue = (value: string) => {
    if (!value) return "";
    const num = parseInt(value, 10);
    return isNaN(num) ? "" : num.toLocaleString("en-NG");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="card-elevated p-4 md:p-6 animate-slide-up">
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Target Net Income
        </h2>

        <div className="mb-5 md:mb-6">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Target Monthly Net Pay (What you want in your bank)
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              ₦
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={formatDisplayValue(targetNetInput)}
              onChange={(e) => handleInputChange(e.target.value.replace(/,/g, ""))}
              placeholder="e.g. 500,000"
              className="input-field pl-8 text-lg font-semibold"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Include Pension (8%)</p>
            </div>
            <Switch checked={pensionEnabled} onCheckedChange={setPensionEnabled} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Include NHF (2.5%)</p>
            </div>
            <Switch checked={nhfEnabled} onCheckedChange={setNhfEnabled} />
          </div>
        </div>
      </div>

      {result && (
        <>
          {/* Required Gross Card */}
          <div className="stat-card-primary animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium mb-1">
                  Required Monthly Gross
                </p>
                <p className="text-3xl md:text-4xl font-bold text-primary-foreground animate-number">
                  {formatCurrency(result.requiredGross / 12)}
                </p>
                <p className="text-primary-foreground/60 text-xs mt-2">
                  Annual: {formatCurrency(result.requiredGross)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="card-elevated p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Salary Breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Net Pay</span>
                <span className="font-medium text-foreground">{formatCurrency(targetNet)}/month</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Required Gross</span>
                <span className="font-medium text-foreground">{formatCurrency(result.requiredGross / 12)}/month</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">PAYE Tax (2026)</span>
                <span className="font-medium text-destructive">-{formatCurrency(result.result.monthlyTax)}</span>
              </div>
              {pensionEnabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pension (8%)</span>
                  <span className="font-medium text-warning">-{formatCurrency(result.result.pensionDeduction / 12)}</span>
                </div>
              )}
              {nhfEnabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NHF (2.5%)</span>
                  <span className="font-medium text-warning">-{formatCurrency(result.result.nhfDeduction / 12)}</span>
                </div>
              )}
              <div className="h-px bg-border" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Effective Tax Rate</span>
                <span className="font-medium text-foreground">{result.result.effectiveRate.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Negotiation Tip */}
          <div className="card-elevated p-4 md:p-6 bg-accent/30 border-accent animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Negotiation Tip</h4>
                <p className="text-sm text-muted-foreground">
                  Ask for at least <span className="font-semibold text-primary">{formatCurrency(result.requiredGross / 12)}</span> monthly 
                  (or <span className="font-semibold text-primary">{formatCurrency(result.requiredGross)}</span> annually) 
                  to account for the new 2026 tax brackets and ensure you take home {formatCurrency(targetNet)}.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
