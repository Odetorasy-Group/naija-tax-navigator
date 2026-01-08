import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, verif-hash",
};

// Zod schema for Flutterwave webhook payload validation
const FlutterwaveChargePayloadSchema = z.object({
  event: z.string().min(1),
  data: z.object({
    status: z.string(),
    customer: z.object({
      email: z.string().email(),
    }),
    payment_plan: z.union([z.string(), z.number()]).optional().nullable(),
    id: z.union([z.string(), z.number()]),
    amount: z.number().positive(),
  }),
});

const FlutterwaveCancelPayloadSchema = z.object({
  event: z.literal("subscription.cancelled"),
  data: z.object({
    customer: z.object({
      email: z.string().email(),
    }),
  }),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook signature
    const secretHash = Deno.env.get("FLW_SECRET_HASH");
    const signature = req.headers.get("verif-hash");

    if (!secretHash || signature !== secretHash) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawPayload = await req.json();
    console.log("Flutterwave webhook received:", JSON.stringify(rawPayload));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const event = rawPayload.event;

    // Handle charge.completed events
    if (event === "charge.completed") {
      // Validate payload structure
      const validation = FlutterwaveChargePayloadSchema.safeParse(rawPayload);
      if (!validation.success) {
        console.error("Invalid charge payload:", validation.error.errors);
        return new Response(JSON.stringify({ error: "Invalid payload structure", details: validation.error.errors }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const payload = validation.data;
      const data = payload.data;

      if (data.status !== "successful") {
        console.log("Charge not successful, skipping:", data.status);
        return new Response(JSON.stringify({ received: true, skipped: "not successful" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const customerEmail = data.customer.email;
      const planId = data.payment_plan?.toString() ?? null;
      const transactionId = data.id.toString();
      const amount = data.amount;

      // Determine plan type based on amount or plan ID
      const isYearly = planId === "152789" || amount === 25000;
      const planType = isYearly ? "yearly" : "monthly";
      const daysToAdd = isYearly ? 365 : 30;

      // Calculate new subscription end date
      const now = new Date();
      const subscriptionEndDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

      // Update user profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_status: "pro",
          plan_type: planType,
          plan_id: planId,
          transaction_id: transactionId,
          subscription_end_date: subscriptionEndDate.toISOString(),
          last_payment_date: now.toISOString(),
        })
        .eq("email", customerEmail);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update profile" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Successfully updated subscription for ${customerEmail} to ${planType}`);
    }

    // Handle subscription cancellation
    if (event === "subscription.cancelled") {
      // Validate payload structure
      const validation = FlutterwaveCancelPayloadSchema.safeParse(rawPayload);
      if (!validation.success) {
        console.error("Invalid cancel payload:", validation.error.errors);
        return new Response(JSON.stringify({ error: "Invalid payload structure", details: validation.error.errors }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const customerEmail = validation.data.data.customer.email;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_status: "free",
        })
        .eq("email", customerEmail);

      if (updateError) {
        console.error("Error cancelling subscription:", updateError);
      } else {
        console.log(`Subscription cancelled for ${customerEmail}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
