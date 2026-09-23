
CREATE TABLE public.parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage parts" ON public.parts FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Public can read active parts" ON public.parts FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Authenticated can read parts" ON public.parts FOR SELECT TO authenticated USING (true);
