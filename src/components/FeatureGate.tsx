import { ReactNode } from "react";
import { Lock, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UpgradeButton } from "@/components/TaxCalculator/UpgradeButton";

interface FeatureGateProps {
  children: ReactNode;
  feature: string;
  description?: string;
}

export function FeatureGate({ children, feature, description }: FeatureGateProps) {
  const { isPro } = useAuth();

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-40 pointer-events-none blur-[2px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
        <div className="text-center p-8 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
            Premium Feature
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{feature}</p>
          {description && (
            <p className="text-xs text-muted-foreground/80 mb-6">{description}</p>
          )}
          <UpgradeButton variant="default" />
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <Crown className="w-3.5 h-3.5 text-primary" />
            <span>Unlock all Pro features</span>
          </div>
        </div>
      </div>
    </div>
  );
}
