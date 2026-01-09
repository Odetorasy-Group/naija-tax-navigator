import { IncomeTargeter } from "@/components/TaxCalculator/IncomeTargeter";

export default function Targeter() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Income Targeter
        </h1>
        <p className="text-muted-foreground mt-1">
          Reverse-calculate the gross salary needed for your target take-home pay
        </p>
      </div>

      <IncomeTargeter />
    </div>
  );
}
