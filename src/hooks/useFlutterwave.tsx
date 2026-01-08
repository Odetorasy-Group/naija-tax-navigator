import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

const PAYMENT_LINKS = {
  monthly: "https://flutterwave.com/pay/7pw6hglkjzpc",
  yearly: "https://flutterwave.com/pay/0lvpipcn5tyw",
};

export function useFlutterwave() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

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

    // Open the appropriate payment link
    const paymentUrl = PAYMENT_LINKS[planType];
    window.open(paymentUrl, "_blank");
    
    toast({
      title: "Payment Started",
      description: "Complete your payment in the new tab. Your Pro access will be activated automatically.",
    });
  }, [user, profile, toast]);

  return { initiatePayment };
}
