-- Add missing DELETE policy on global_settings table
CREATE POLICY "Users can delete own settings" 
ON public.global_settings 
FOR DELETE 
USING (auth.uid() = user_id);