
-- ==========================================
-- 1. Role system (enum + user_roles table)
-- ==========================================
CREATE TYPE public.app_role AS ENUM ('customer', 'staff', 'super_admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('staff', 'super_admin')
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- ==========================================
-- 2. Profiles table
-- ==========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  mobile_number TEXT,
  profile_photo TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin(auth.uid()));

-- ==========================================
-- 3. Vehicles table
-- ==========================================
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  fuel_type TEXT,
  manufacturing_year INTEGER,
  vehicle_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all vehicles" ON public.vehicles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all vehicles" ON public.vehicles
  FOR ALL USING (public.is_admin(auth.uid()));

-- ==========================================
-- 4. Service Records table
-- ==========================================
CREATE TABLE public.service_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  service_type TEXT NOT NULL,
  description TEXT,
  parts_replaced TEXT,
  service_cost NUMERIC(10,2) DEFAULT 0,
  technician_name TEXT,
  before_image TEXT,
  after_image TEXT,
  invoice_file TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;

-- Customers can view their own vehicle service records
CREATE POLICY "Users can view own service records" ON public.service_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicles v
      WHERE v.id = vehicle_id AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all service records" ON public.service_records
  FOR ALL USING (public.is_admin(auth.uid()));

-- ==========================================
-- 5. Loyalty Points table
-- ==========================================
CREATE TABLE public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  service_dots INTEGER NOT NULL DEFAULT 0 CHECK (service_dots >= 0 AND service_dots <= 5),
  wash_dots INTEGER NOT NULL DEFAULT 0 CHECK (wash_dots >= 0 AND wash_dots <= 5),
  last_reset_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loyalty" ON public.loyalty_points
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicles v
      WHERE v.id = vehicle_id AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all loyalty" ON public.loyalty_points
  FOR ALL USING (public.is_admin(auth.uid()));

-- ==========================================
-- 6. Invoices table
-- ==========================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.service_records(id) ON DELETE CASCADE NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_pdf TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.service_records sr
      JOIN public.vehicles v ON v.id = sr.vehicle_id
      WHERE sr.id = service_id AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all invoices" ON public.invoices
  FOR ALL USING (public.is_admin(auth.uid()));

-- ==========================================
-- 7. Service Reminders table
-- ==========================================
CREATE TABLE public.service_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  reminder_type TEXT NOT NULL,
  reminder_date DATE NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.service_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders" ON public.service_reminders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicles v
      WHERE v.id = vehicle_id AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all reminders" ON public.service_reminders
  FOR ALL USING (public.is_admin(auth.uid()));

-- ==========================================
-- 8. Updated_at trigger function
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_records_updated_at BEFORE UPDATE ON public.service_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loyalty_points_updated_at BEFORE UPDATE ON public.loyalty_points
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- 9. Auto-create profile + customer role on signup
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, profile_photo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 10. Storage buckets for images and files
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-photos', 'vehicle-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Storage policies
CREATE POLICY "Public vehicle photos" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-photos');
CREATE POLICY "Users upload vehicle photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vehicle-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update vehicle photos" ON storage.objects FOR UPDATE USING (bucket_id = 'vehicle-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public service images" ON storage.objects FOR SELECT USING (bucket_id = 'service-images');
CREATE POLICY "Admins upload service images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'service-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Users view own invoices" ON storage.objects FOR SELECT USING (bucket_id = 'invoices' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins upload invoices" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'invoices' AND public.is_admin(auth.uid()));

CREATE POLICY "Public profile photos" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Users upload profile photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update profile photos" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==========================================
-- 11. Indexes for performance
-- ==========================================
CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_vehicles_number ON public.vehicles(vehicle_number);
CREATE INDEX idx_service_records_vehicle_id ON public.service_records(vehicle_id);
CREATE INDEX idx_service_records_date ON public.service_records(service_date);
CREATE INDEX idx_loyalty_vehicle_id ON public.loyalty_points(vehicle_id);
CREATE INDEX idx_invoices_service_id ON public.invoices(service_id);
CREATE INDEX idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_mobile ON public.profiles(mobile_number);
