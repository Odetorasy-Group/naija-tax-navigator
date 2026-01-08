import { useState } from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useFlutterwave } from "@/hooks/useFlutterwave";
import { useAuth } from "@/hooks/useAuth";

const MONTHLY_PLAN = {
  id: "152790",
  price: 2500,
  period: "month",
};

const YEARLY_PLAN = {
  id: "152789",
  price: 25000,
  period: "year",
};

const features = [
  "Unlimited employees in Payroll Manager",
  "Bulk Excel/CSV Export",
  "Official branded PDF payslips",
  "Priority support",
  "All future features included",
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);
  const { initiatePayment } = useFlutterwave();
  const { isPro, user } = useAuth();

  const selectedPlan = isYearly ? YEARLY_PLAN : MONTHLY_PLAN;
  const savings = isYearly ? (2500 * 12 - 25000) : 0;

  const handleSubscribe = () => {
    initiatePayment(selectedPlan.id, selectedPlan.price, isYearly ? "yearly" : "monthly");
  };

  if (isPro) {
    return (
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">You're a Pro!</h2>
        <p className="text-muted-foreground">
          Enjoy unlimited access to all premium features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="data-[state=checked]:bg-primary"
        />
        <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly
        </span>
        {isYearly && (
          <span className="bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded-full">
            Save ₦{savings.toLocaleString()}
          </span>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="card-elevated p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-2">Free</h3>
          <div className="mb-4">
            <span className="text-3xl font-bold text-foreground">₦0</span>
            <span className="text-muted-foreground">/forever</span>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              Standard Tax Calculator
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              Income Targeter
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              Payroll Manager (3 employees)
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              Basic PDF download
            </li>
          </ul>
          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="relative card-elevated p-6 rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
          {isYearly && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Best Value
              </span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Pro
          </h3>
          <div className="mb-4">
            <span className="text-3xl font-bold text-foreground">
              ₦{selectedPlan.price.toLocaleString()}
            </span>
            <span className="text-muted-foreground">/{selectedPlan.period}</span>
          </div>
          <ul className="space-y-3 mb-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            onClick={handleSubscribe}
            className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80"
            disabled={!user}
          >
            <Crown className="w-4 h-4" />
            {user ? "Subscribe Now" : "Sign in to Subscribe"}
          </Button>
        </div>
      </div>
    </div>
  );
}
