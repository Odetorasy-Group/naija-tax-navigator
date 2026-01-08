import { Link } from "react-router-dom";
import { AlertCircle, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-8 md:mt-12 animate-fade-in" style={{ animationDelay: "0.5s" }}>
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-md bg-muted/50 border border-border">
        <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Disclaimer:</strong> Based on the Nigeria Tax Act 2025 
          (Effective January 2026). This calculator provides estimates for informational purposes only. 
          Please consult a qualified tax professional for official filing and personalized advice.
        </p>
      </div>

      {/* Trust Footer */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <a 
              href="mailto:support@odetorasy.com" 
              className="hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Compliance Badge */}
          <div className="trust-badge">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>2026 Tax Act Verified</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} Odetorasy Tax Suite • Built with 🇳🇬 for Nigerian taxpayers
        </p>
      </div>
    </footer>
  );
}