import { Shield, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/taxCalculations";
import logo from "@/assets/odetorasy-logo.png";

interface SuiteHeaderProps {
  monthlyTakeHome: number;
}

export function SuiteHeader({ monthlyTakeHome }: SuiteHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <img 
          src={logo} 
          alt="Odetoprasy Tax Suite" 
          className="w-12 h-12 md:w-14 md:h-14 object-contain"
        />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Odetoprasy Tax Suite
          </h1>
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
            <Shield className="w-3 h-3 text-primary" />
            <span>Nigeria 2026 Tax Reform</span>
          </div>
        </div>
      </div>
      
      {monthlyTakeHome > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <Wallet className="w-5 h-5 text-primary" />
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Monthly Take-Home</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(monthlyTakeHome)}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
