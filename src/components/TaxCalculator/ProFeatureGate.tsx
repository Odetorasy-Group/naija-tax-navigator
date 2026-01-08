import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UpgradeButton } from "./UpgradeButton";

interface ProFeatureGateProps {
  children: ReactNode;
  feature: string;
}

export function ProFeatureGate({ children, feature }: ProFeatureGateProps) {
  const { isPro } = useAuth();

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none blur-[1px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
        <div className="text-center p-6 max-w-xs">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Pro Feature</h3>
          <p className="text-sm text-muted-foreground mb-4">{feature}</p>
          <UpgradeButton variant="compact" />
        </div>
      </div>
    </div>
  );
}
