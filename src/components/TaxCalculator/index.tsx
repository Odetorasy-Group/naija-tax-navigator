import { useState, useMemo } from "react";
import { Header } from "./Header";
import { InputForm } from "./InputForm";
import { ResultCards } from "./ResultCards";
import { ComparisonCard } from "./ComparisonCard";
import { TaxBreakdown } from "./TaxBreakdown";
import { DeductionsSummary } from "./DeductionsSummary";
import { Footer } from "./Footer";
import { calculateTax, TaxInputs } from "@/lib/taxCalculations";

export function TaxCalculator() {
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
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-6 md:py-12 px-4">
        <Header />
        
        <div className="space-y-4 md:space-y-6">
          <InputForm inputs={inputs} onInputChange={setInputs} />
          
          {inputs.grossSalary > 0 && (
            <>
              <ResultCards result={result} />
              <ComparisonCard result={result} />
              <TaxBreakdown result={result} />
              <DeductionsSummary result={result} />
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
