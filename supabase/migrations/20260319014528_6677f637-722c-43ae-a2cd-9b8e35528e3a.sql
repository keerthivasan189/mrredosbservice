
-- Bookings table for service booking system
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  vehicle_type TEXT NOT NULL DEFAULT 'Car',
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL DEFAULT '10:00',
  pickup_location TEXT,
  estimated_price NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_agent TEXT,
  notes TEXT,
  rating INTEGER,
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view own bookings
CREATE POLICY "Users can view own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS: Users can insert own bookings
CREATE POLICY "Users can insert own bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS: Users can update own bookings (cancel/reschedule)
CREATE POLICY "Users can update own bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS: Admins can manage all bookings
CREATE POLICY "Admins can manage all bookings"
ON public.bookings FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
