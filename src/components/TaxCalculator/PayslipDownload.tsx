import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaxInputs, TaxResult, formatCurrency } from "@/lib/taxCalculations";
import { useAuth } from "@/hooks/useAuth";
import { FeatureGate } from "@/components/FeatureGate";

interface PayslipDownloadProps {
  inputs: TaxInputs;
  result: TaxResult;
}

export function PayslipDownload({ inputs, result }: PayslipDownloadProps) {
  const { isPro } = useAuth();

  const handleDownloadText = () => {
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
    <div className="space-y-3">
      <Button
        onClick={handleDownloadText}
        className="w-full gap-2"
        variant="outline"
      >
        <Download className="w-4 h-4" />
        Download Payslip (Text)
      </Button>

      <FeatureGate feature="Branded PDF Payslip" description="Generate official payslips with your company branding and QR verification code">
        <Button
          className="w-full gap-2"
          variant="default"
        >
          <FileText className="w-4 h-4" />
          Download Branded PDF
        </Button>
      </FeatureGate>
    </div>
  );
}
