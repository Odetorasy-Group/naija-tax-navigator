import { useState, useMemo } from "react";
import { InputForm } from "@/components/TaxCalculator/InputForm";
import { ResultCards } from "@/components/TaxCalculator/ResultCards";
import { ComparisonCard } from "@/components/TaxCalculator/ComparisonCard";
import { TaxBreakdown } from "@/components/TaxCalculator/TaxBreakdown";
import { DeductionsSummary } from "@/components/TaxCalculator/DeductionsSummary";
import { calculateTax, TaxInputs } from "@/lib/taxCalculations";
import { PayslipDownload } from "@/components/TaxCalculator/PayslipDownload";

export default function Calculator() {
  const [inputs, setInputs] = useState<TaxInputs>({
    grossSalary: 0,
    isAnnual: false,
    annualRent: 0,
    pensionEnabled: true,
    nhfEnabled: false,
    lifeAssuranceEnabled: false,
  });

  const result = useMemo(() => calculateTax(inputs), [inputs]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Quick Calculator
        </h1>
        <p className="text-muted-foreground mt-1">
          Calculate your PAYE tax under the 2026 Nigeria Tax Reform Act
        </p>
      </div>

      <InputForm inputs={inputs} onInputChange={setInputs} />
      
      {inputs.grossSalary > 0 && (
        <>
          <ResultCards result={result} />
          <ComparisonCard result={result} />
          <TaxBreakdown result={result} />
          <DeductionsSummary result={result} />
          <PayslipDownload inputs={inputs} result={result} />
        </>
      )}
    </div>
  );
}
