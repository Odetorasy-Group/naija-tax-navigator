import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

const FLW_PUBLIC_KEY = "FLWPUBK-3699194b04f750837b81b63391a67c11-X";

interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  payment_plan?: string;
  customer: {
    email: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  callback: (response: FlutterwaveResponse) => void;
  onclose: () => void;
}

interface FlutterwaveResponse {
  status: string;
  transaction_id: number;
  tx_ref: string;
}

declare global {
  interface Window {
    FlutterwaveCheckout: (config: FlutterwaveConfig) => void;
  }
}

export function useFlutterwave() {
  const { user, profile, upgradeToPro } = useAuth();
  const { toast } = useToast();

  const loadFlutterwaveScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.FlutterwaveCheckout) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Flutterwave"));
      document.body.appendChild(script);
    });
  }, []);

  const initiatePayment = useCallback(async (
    planId: string = "152790",
    amount: number = 2500,
    planType: "monthly" | "yearly" = "monthly"
  ) => {
    if (!user || !profile) {
      toast({
        title: "Login Required",
        description: "Please log in to upgrade to Pro.",
        variant: "destructive",
      });
      return;
    }

    try {
      await loadFlutterwaveScript();

      const txRef = `odetorasy-${Date.now()}-${user.id.slice(0, 8)}`;
      const periodLabel = planType === "yearly" ? "Yearly" : "Monthly";

      window.FlutterwaveCheckout({
        public_key: FLW_PUBLIC_KEY,
        tx_ref: txRef,
        amount: amount,
        currency: "NGN",
        payment_options: "card,banktransfer,ussd",
        payment_plan: planId,
        customer: {
          email: profile.email,
          name: profile.email.split("@")[0],
        },
        customizations: {
          title: "Odetorasy Pro",
          description: `${periodLabel} Pro Subscription`,
          logo: "https://cdn.lovable.dev/logo.png",
        },
        callback: async (response) => {
          if (response.status === "successful") {
            await upgradeToPro(planType, response.transaction_id.toString(), planId);
            toast({
              title: "Welcome to Pro! 🎉",
              description: `You now have ${periodLabel.toLowerCase()} access to all features.`,
            });
          } else {
            toast({
              title: "Payment Failed",
              description: "Please try again or contact support.",
              variant: "destructive",
            });
          }
        },
        onclose: () => {
          // User closed the modal without completing payment
        },
      });
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Could not load payment gateway. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, profile, loadFlutterwaveScript, upgradeToPro, toast]);

  return { initiatePayment };
}
