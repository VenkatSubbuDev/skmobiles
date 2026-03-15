-- Create site_settings table
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial custom case prices
INSERT INTO public.site_settings (key, value, description) VALUES
  ('custom_case_sale_price', '299', 'Current sale price for custom phone cases'),
  ('custom_case_original_price', '499', 'Original MRP for custom phone cases')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
