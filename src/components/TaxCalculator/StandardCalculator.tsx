import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import { InputForm } from "./InputForm";
import { ResultCards } from "./ResultCards";
import { ComparisonCard } from "./ComparisonCard";
import { TaxBreakdown } from "./TaxBreakdown";
import { DeductionsSummary } from "./DeductionsSummary";
import { calculateTax, TaxInputs, formatCurrency } from "@/lib/taxCalculations";
import { Button } from "@/components/ui/button";

interface StandardCalculatorProps {
  inputs: TaxInputs;
  onInputChange: (inputs: TaxInputs) => void;
}

export function StandardCalculator({ inputs, onInputChange }: StandardCalculatorProps) {
  const result = useMemo(() => calculateTax(inputs), [inputs]);

  const handleDownloadPayslip = () => {
    if (inputs.grossSalary <= 0) return;
    
    const payslipContent = `
ODETORASY TAX SUITE - PAYSLIP
================================
Generated: ${new Date().toLocaleDateString()}

EARNINGS
--------
Gross Monthly Salary: ${formatCurrency(result.monthlyGross)}
Gross Annual Salary: ${formatCurrency(result.annualGross)}

DEDUCTIONS (Monthly)
--------------------
PAYE Tax (2026): ${formatCurrency(result.monthlyTax)}
Pension (8%): ${formatCurrency(result.pensionDeduction / 12)}
NHF (2.5%): ${formatCurrency(result.nhfDeduction / 12)}

NET PAY
-------
Monthly Take-Home: ${formatCurrency(result.monthlyTakeHome)}
Annual Take-Home: ${formatCurrency(result.annualTakeHome)}

COMPARISON
----------
Old Law Tax: ${formatCurrency(result.oldLawMonthlyTax)}/month
New Law Tax: ${formatCurrency(result.monthlyTax)}/month
Monthly Savings: ${formatCurrency(result.monthlySavings)}

Effective Tax Rate: ${result.effectiveRate.toFixed(2)}%

================================
Calculated using Nigeria 2026 Tax Reform Act
    `.trim();

    const blob = new Blob([payslipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <InputForm inputs={inputs} onInputChange={onInputChange} />
      
      {inputs.grossSalary > 0 && (
        <>
          <ResultCards result={result} />
          <ComparisonCard result={result} />
          <TaxBreakdown result={result} />
          <DeductionsSummary result={result} />
          
          <Button
            onClick={handleDownloadPayslip}
            className="w-full gap-2"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            Download Payslip
          </Button>
        </>
      )}
    </div>
  );
}
