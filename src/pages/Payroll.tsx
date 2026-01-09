import { PayrollManager } from "@/components/TaxCalculator/PayrollManager";

export default function Payroll() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Payroll Manager
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage employee payroll and calculate taxes in bulk
        </p>
      </div>

      <PayrollManager />
    </div>
  );
}
