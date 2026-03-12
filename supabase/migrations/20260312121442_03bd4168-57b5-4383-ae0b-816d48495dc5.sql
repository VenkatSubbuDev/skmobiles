
-- Fix the overly permissive SELECT policy on custom_case_orders
DROP POLICY "Users can view own case orders" ON public.custom_case_orders;
CREATE POLICY "Users can view own case orders" ON public.custom_case_orders FOR SELECT USING (
  public.has_role(auth.uid(), 'admin') OR user_id = auth.uid()
);

-- Create storage bucket for case images
INSERT INTO storage.buckets (id, name, public) VALUES ('case-images', 'case-images', true);

-- Allow anyone to upload to case-images bucket
CREATE POLICY "Anyone can upload case images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'case-images');
CREATE POLICY "Case images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'case-images');
