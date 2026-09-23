-- Fix 1: Add DELETE policies on storage buckets

-- Users can delete their own vehicle photos
CREATE POLICY "Users delete own vehicle photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'vehicle-photos' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Users can delete their own profile photos
CREATE POLICY "Users delete own profile photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'profile-photos' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- Admins can delete service images
CREATE POLICY "Admins delete service images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'service-images' AND is_admin(auth.uid()));

-- Fix 2: Remove bookings from realtime publication to prevent unauthorized subscriptions
ALTER PUBLICATION supabase_realtime DROP TABLE public.bookings;

-- Fix 3: Tighten user_roles - drop the overly broad ALL policy on {public} and replace with scoped policies
DROP POLICY IF EXISTS "Super admins can manage roles" ON public.user_roles;

-- Super admins can do everything on user_roles (scoped to authenticated)
CREATE POLICY "Super admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- Also update "Admins can view all roles" to be scoped to authenticated
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Update "Users can view own roles" to be scoped to authenticated
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);