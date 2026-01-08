import { Calculator, Shield } from "lucide-react";

export function Header() {
  return (
    <header className="text-center mb-8 md:mb-12 animate-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 mb-4 md:mb-6">
        <Calculator className="w-8 h-8 md:w-10 md:h-10 text-primary" />
      </div>
      
      <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-3">
        Nigeria PAYE Tax Calculator
      </h1>
      
      <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto mb-3 md:mb-4">
        Calculate your income tax based on the 2026 Tax Reform Act
      </p>
      
      <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium">
        <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
        <span>Updated for 2026 Tax Law</span>
      </div>
    </header>
  );
}
