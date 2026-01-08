import { useState } from "react";
import { Calendar, Home, Briefcase, Heart, Building2, Shield } from "lucide-react";
import { TaxInputs } from "@/lib/taxCalculations";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface InputFormProps {
  inputs: TaxInputs;
  onInputChange: (inputs: TaxInputs) => void;
}

export function InputForm({ inputs, onInputChange }: InputFormProps) {
  const [salaryInput, setSalaryInput] = useState(
    inputs.grossSalary > 0 ? inputs.grossSalary.toString() : ""
  );
  const [rentInput, setRentInput] = useState(
    inputs.annualRent > 0 ? inputs.annualRent.toString() : ""
  );
  const [lifeInsuranceInput, setLifeInsuranceInput] = useState(
    (inputs.lifeInsurancePaid || 0) > 0 ? inputs.lifeInsurancePaid!.toString() : ""
  );

  const handleSalaryChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setSalaryInput(cleanValue);
    onInputChange({
      ...inputs,
      grossSalary: cleanValue ? parseInt(cleanValue, 10) : 0,
    });
  };

  const handleRentChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setRentInput(cleanValue);
    onInputChange({
      ...inputs,
      annualRent: cleanValue ? parseInt(cleanValue, 10) : 0,
    });
  };

  const handleLifeInsuranceChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setLifeInsuranceInput(cleanValue);
    onInputChange({
      ...inputs,
      lifeInsurancePaid: cleanValue ? parseInt(cleanValue, 10) : 0,
    });
  };

  const formatDisplayValue = (value: string) => {
    if (!value) return "";
    const num = parseInt(value, 10);
    return isNaN(num) ? "" : num.toLocaleString("en-NG");
  };

  return (
    <div className="card-elevated p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" />
        Income Details
      </h2>

      {/* Period Toggle */}
      <div className="mb-5 md:mb-6">
        <Label className="text-sm font-medium text-muted-foreground mb-3 block">
          Salary Period
        </Label>
        <div className="flex items-center bg-muted rounded-xl p-1">
          <button
            onClick={() => onInputChange({ ...inputs, isAnnual: false })}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              !inputs.isAnnual
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Monthly
          </button>
          <button
            onClick={() => onInputChange({ ...inputs, isAnnual: true })}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              inputs.isAnnual
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Annual
          </button>
        </div>
      </div>

      {/* Gross Salary Input */}
      <div className="mb-5 md:mb-6">
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
          Gross {inputs.isAnnual ? "Annual" : "Monthly"} Salary
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            ₦
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={formatDisplayValue(salaryInput)}
            onChange={(e) => handleSalaryChange(e.target.value.replace(/,/g, ""))}
            placeholder="0"
            className="input-field pl-8 text-lg font-semibold"
          />
        </div>
      </div>

      {/* Annual Rent Input */}
      <div className="mb-5 md:mb-6">
        <Label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <Home className="w-4 h-4" />
          Annual Rent Paid
          <span className="text-xs text-muted-foreground/70">(for Rent Relief)</span>
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            ₦
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={formatDisplayValue(rentInput)}
            onChange={(e) => handleRentChange(e.target.value.replace(/,/g, ""))}
            placeholder="0"
            className="input-field pl-8"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Relief: 20% of rent, capped at ₦500,000/year
        </p>
      </div>

      {/* Life Insurance Paid (Previous Year) */}
      <div className="mb-5 md:mb-6">
        <Label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Life Insurance Paid (Previous Year)
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            ₦
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={formatDisplayValue(lifeInsuranceInput)}
            onChange={(e) => handleLifeInsuranceChange(e.target.value.replace(/,/g, ""))}
            placeholder="0"
            className="input-field pl-8"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Deducted from annual income before tax is applied
        </p>
      </div>

      {/* Deduction Toggles */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground block">
          Optional Deductions
        </Label>

        <div className="space-y-3">
          {/* Pension Toggle */}
          <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Pension</p>
                <p className="text-xs text-muted-foreground">8% of gross salary</p>
              </div>
            </div>
            <Switch
              checked={inputs.pensionEnabled}
              onCheckedChange={(checked) =>
                onInputChange({ ...inputs, pensionEnabled: checked })
              }
            />
          </div>

          {/* NHF Toggle */}
          <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">NHF</p>
                <p className="text-xs text-muted-foreground">2.5% National Housing Fund</p>
              </div>
            </div>
            <Switch
              checked={inputs.nhfEnabled}
              onCheckedChange={(checked) =>
                onInputChange({ ...inputs, nhfEnabled: checked })
              }
            />
          </div>

          {/* Life Assurance Toggle */}
          <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Life Assurance</p>
                <p className="text-xs text-muted-foreground">Premium deduction</p>
              </div>
            </div>
            <Switch
              checked={inputs.lifeAssuranceEnabled}
              onCheckedChange={(checked) =>
                onInputChange({ ...inputs, lifeAssuranceEnabled: checked })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
