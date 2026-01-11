-- Add display_name column to profiles table for user identification
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name text;

-- Add saved_salary column to global_settings for Dashboard data
ALTER TABLE public.global_settings 
ADD COLUMN IF NOT EXISTS saved_salary numeric NOT NULL DEFAULT 0;