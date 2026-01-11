import { useState } from "react";
import { Download, FileText, Eye, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaxInputs, TaxResult, formatCurrency } from "@/lib/taxCalculations";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PayslipDownloadProps {
  inputs: TaxInputs;
  result: TaxResult;
}

const PAYSLIP_PAYMENT_LINK = "https://flutterwave.com/pay/odetorasy-payslip";
const PAYSLIP_PRICE = 500;

export function PayslipDownload({ inputs, result }: PayslipDownloadProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const displayName = profile?.display_name || profile?.email?.split("@")[0] || "Employee";

  const handleDownloadText = () => {
    if (inputs.grossSalary <= 0) return;
    
    const payslipContent = `
ODETORASY TAX SUITE - PAYSLIP
================================
Generated: ${new Date().toLocaleDateString()}
Employee: ${displayName}

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

  const handlePreviewPDF = () => {
    if (inputs.grossSalary <= 0) {
      toast({
        title: "No Data",
        description: "Please enter your salary to generate a payslip.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const handlePayForDownload = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to purchase a branded payslip.",
        variant: "destructive",
      });
      return;
    }

    // Open Flutterwave payment link
    window.open(PAYSLIP_PAYMENT_LINK, "_blank");
    
    toast({
      title: "Payment Started",
      description: "Complete your payment in the new tab. Your PDF will be ready for download after payment confirmation.",
    });
    
    setShowPreview(false);
  };

  return (
    <>
      <div className="space-y-3">
        <Button
          onClick={handleDownloadText}
          className="w-full gap-2"
          variant="outline"
          disabled={inputs.grossSalary <= 0}
        >
          <Download className="w-4 h-4" />
          Download Payslip (Text) - Free
        </Button>

        <Button
          onClick={handlePreviewPDF}
          className="w-full gap-2"
          variant="default"
          disabled={inputs.grossSalary <= 0}
        >
          <Eye className="w-4 h-4" />
          Preview Branded PDF - ₦{PAYSLIP_PRICE}
        </Button>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">Branded Payslip Preview</DialogTitle>
            <DialogDescription>
              Preview your official payslip. Pay ₦{PAYSLIP_PRICE} to download the PDF.
            </DialogDescription>
          </DialogHeader>

          {/* Payslip Preview */}
          <div className="border rounded-lg p-6 bg-white text-foreground space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary">ODETORASY</h2>
                <p className="text-sm text-muted-foreground">Tax Suite</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">OFFICIAL PAYSLIP</p>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString("en-NG", { 
                    year: "numeric", 
                    month: "long" 
                  })}
                </p>
              </div>
            </div>

            {/* Employee Info */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Employee Name</p>
              <p className="font-semibold text-lg">{displayName}</p>
            </div>

            {/* Earnings */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Earnings
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gross Monthly Salary</span>
                  <span className="font-medium tabular-nums">{formatCurrency(result.monthlyGross)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Gross Annual Salary</span>
                  <span className="tabular-nums">{formatCurrency(result.annualGross)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Statutory Deductions (Monthly)
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>PAYE Tax (2026 Act)</span>
                  <span className="font-medium tabular-nums text-destructive">
                    -{formatCurrency(result.monthlyTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pension (8%)</span>
                  <span className="font-medium tabular-nums text-warning">
                    -{formatCurrency(result.pensionDeduction / 12)}
                  </span>
                </div>
                {result.nhfDeduction > 0 && (
                  <div className="flex justify-between">
                    <span>NHF (2.5%)</span>
                    <span className="font-medium tabular-nums text-warning">
                      -{formatCurrency(result.nhfDeduction / 12)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Net Pay */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Net Monthly Pay</span>
                <span className="font-bold text-2xl tabular-nums text-primary">
                  {formatCurrency(result.monthlyTakeHome)}
                </span>
              </div>
            </div>

            {/* Tax Savings Banner */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <p className="text-sm text-success font-medium">
                🎉 You save {formatCurrency(result.monthlySavings)}/month under the new 2026 Tax Act!
              </p>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <p>Generated by Odetorasy Tax Suite • Nigeria 2026 Tax Reform Act Compliant</p>
              <p className="mt-1">Verification QR code included in downloaded PDF</p>
            </div>

            {/* Watermark for preview */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <p className="text-6xl font-bold text-muted-foreground rotate-[-30deg]">
                PREVIEW
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayForDownload} className="gap-2">
              <CreditCard className="w-4 h-4" />
              Pay ₦{PAYSLIP_PRICE} to Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}