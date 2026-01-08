import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlutterwave } from "@/hooks/useFlutterwave";
import { useAuth } from "@/hooks/useAuth";

export function ExpiredBanner() {
  const { profile } = useAuth();
  const { initiatePayment } = useFlutterwave();

  // Check if subscription has expired
  if (!profile?.subscription_end_date) return null;

  const endDate = new Date(profile.subscription_end_date);
  const now = new Date();

  if (endDate > now) return null;

  const planType = profile.plan_type || "monthly";
  const planId = planType === "yearly" ? "152789" : "152790";
  const amount = planType === "yearly" ? 25000 : 2500;

  const handleRenew = () => {
    initiatePayment(planId, amount, planType as "monthly" | "yearly");
  };

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Account Expired</h3>
            <p className="text-sm text-muted-foreground">
              Your Pro subscription expired on {endDate.toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button
          onClick={handleRenew}
          className="gap-2 bg-gradient-to-r from-primary to-primary/80"
        >
          <RefreshCw className="w-4 h-4" />
          Renew Subscription
        </Button>
      </div>
    </div>
  );
}
