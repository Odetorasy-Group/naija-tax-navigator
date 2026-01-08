import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlutterwave } from "@/hooks/useFlutterwave";
import { useAuth } from "@/hooks/useAuth";

interface UpgradeButtonProps {
  variant?: "default" | "compact" | "banner";
}

export function UpgradeButton({ variant = "default" }: UpgradeButtonProps) {
  const { initiatePayment } = useFlutterwave();
  const { isPro } = useAuth();

  if (isPro) {
    return (
      <div className="flex items-center gap-2 text-primary">
        <Crown className="w-4 h-4" />
        <span className="text-sm font-medium">Pro</span>
      </div>
    );
  }

  const handleUpgrade = () => {
    // Default to monthly plan
    initiatePayment("152790", 2500, "monthly");
  };

  if (variant === "compact") {
    return (
      <Button
        onClick={handleUpgrade}
        size="sm"
        className="gap-1.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      >
        <Crown className="w-3.5 h-3.5" />
        Upgrade
      </Button>
    );
  }

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Unlock Pro Features</h3>
              <p className="text-sm text-muted-foreground">
                Unlimited employees, bulk export & branded payslips
              </p>
            </div>
          </div>
          <Button
            onClick={handleUpgrade}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80"
          >
            <Crown className="w-4 h-4" />
            Upgrade - ₦2,500/mo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleUpgrade}
      className="gap-2 w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
    >
      <Crown className="w-4 h-4" />
      Upgrade to Pro - ₦2,500/mo
    </Button>
  );
}
