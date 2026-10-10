-- Seed the admin user for local development
DO $$
DECLARE
  admin_uid UUID := 'a8e803fb-9ec3-4456-96b6-39bd121b66e6';
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    admin_uid,
    'authenticated',
    'authenticated',
    'mrredosbservice@gmail.com',
    crypt('Mrred@2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert identity (required for login)
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    admin_uid,
    format('{"sub":"%s","email":"%s"}', admin_uid::text, 'mrredosbservice@gmail.com')::jsonb,
    'email',
    now(),
    now(),
    now()
  ) ON CONFLICT DO NOTHING;

  -- Insert profile
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (admin_uid, 'Local Admin', 'mrredosbservice@gmail.com')
  ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;

  -- Insert super admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_uid, 'super_admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
