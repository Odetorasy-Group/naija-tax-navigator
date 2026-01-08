import { AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-8 md:mt-12 animate-fade-in" style={{ animationDelay: "0.5s" }}>
      <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
        <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Disclaimer:</strong> Based on the 2025 Tax Act 
            (Effective January 2026). This calculator provides estimates for informational purposes only. 
            Please consult a qualified tax professional for official filing and personalized advice.
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        © {new Date().getFullYear()} Odetoprasy Tax Suite • Built with 🇳🇬 for Nigerian taxpayers
      </p>
    </footer>
  );
}
