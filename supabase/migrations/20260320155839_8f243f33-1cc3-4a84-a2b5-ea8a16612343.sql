
-- Site settings (key-value store for admin-editable website config)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL DEFAULT '',
  setting_label text NOT NULL DEFAULT '',
  setting_group text NOT NULL DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (public website needs them)
CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can read settings" ON public.site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Services catalog (admin-editable)
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Both',
  price_car numeric NOT NULL DEFAULT 0,
  price_bike numeric NOT NULL DEFAULT 0,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active services" ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can read services" ON public.services FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Seed default settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_label, setting_group) VALUES
  ('shop_name', 'Mr Red OSB Service', 'Shop Name', 'general'),
  ('shop_phone', '+919886919869', 'Phone Number', 'general'),
  ('shop_email', 'mrredosbservice@gmail.com', 'Email', 'general'),
  ('shop_map_url', 'https://maps.app.goo.gl/QJCsnfeVUYQs7RYR9', 'Google Maps URL', 'general'),
  ('shop_whatsapp', '919886919869', 'WhatsApp Number', 'general'),
  ('shop_address', 'Bangalore, India', 'Address', 'general'),
  ('loyalty_service_dots_max', '5', 'Service Dots for Reward', 'loyalty'),
  ('loyalty_service_discount', '50', 'Service Reward Discount %', 'loyalty'),
  ('loyalty_wash_dots_max', '5', 'Wash Dots for Reward', 'loyalty'),
  ('loyalty_wash_reward', 'Free Wash', 'Wash Reward', 'loyalty'),
  ('reminder_interval_months', '3', 'Reminder Interval (months)', 'reminders'),
  ('reminder_km_interval', '3000', 'Reminder KM Interval', 'reminders');

-- Seed default services
INSERT INTO public.services (name, category, price_car, price_bike, sort_order) VALUES
  ('General Service', 'Both', 1500, 900, 1),
  ('Oil Change', 'Both', 800, 500, 2),
  ('Full Service', 'Both', 3500, 2100, 3),
  ('Wash & Detailing', 'Both', 500, 300, 4),
  ('Brake Service', 'Both', 2000, 1200, 5),
  ('Engine Repair', 'Both', 5000, 3000, 6),
  ('Tyre Replacement', 'Both', 3000, 1800, 7),
  ('AC Service', 'Car', 1800, 0, 8);

-- Update triggers
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
