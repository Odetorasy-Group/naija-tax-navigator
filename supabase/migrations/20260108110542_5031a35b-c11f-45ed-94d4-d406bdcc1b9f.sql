-- Add new columns to profiles table for subscription management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS subscription_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS transaction_id text,
ADD COLUMN IF NOT EXISTS plan_id text;

-- Add constraint for plan_type
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_plan_type CHECK (plan_type IN ('monthly', 'yearly'));