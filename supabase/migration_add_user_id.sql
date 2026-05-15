-- Run this in Supabase SQL Editor to ADD user_id to your existing firms table
-- (Use this if you already ran the first schema and don't want to recreate tables)

-- 1. Add user_id column
ALTER TABLE public.firms
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Add index
CREATE INDEX IF NOT EXISTS firms_user_id_idx ON public.firms (user_id);

-- 3. Drop the old broad write policy and replace with ownership-based ones
DROP POLICY IF EXISTS "firms_auth_write" ON public.firms;

CREATE POLICY "firms_owner_insert"
  ON public.firms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "firms_owner_update"
  ON public.firms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "firms_owner_delete"
  ON public.firms FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Fix products write policy
DROP POLICY IF EXISTS "products_auth_write" ON public.products;

CREATE POLICY "products_owner_write"
  ON public.products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.firms WHERE firms.id = products.firm_id AND firms.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.firms WHERE firms.id = products.firm_id AND firms.user_id = auth.uid())
  );

-- 5. Fix certifications write policy
DROP POLICY IF EXISTS "certs_auth_write" ON public.certifications;

CREATE POLICY "certs_owner_write"
  ON public.certifications FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.firms WHERE firms.id = certifications.firm_id AND firms.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.firms WHERE firms.id = certifications.firm_id AND firms.user_id = auth.uid())
  );

-- 6. Fix leads policy
DROP POLICY IF EXISTS "leads_auth_only" ON public.leads;

CREATE POLICY "leads_owner_only"
  ON public.leads FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.firms WHERE firms.id = leads.firm_id AND firms.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.firms WHERE firms.id = leads.firm_id AND firms.user_id = auth.uid())
  );

-- 7. Helper function to get current user's firm slug
CREATE OR REPLACE FUNCTION public.get_my_firm_slug()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER AS $$
  SELECT slug FROM public.firms
  WHERE user_id = auth.uid()
  ORDER BY created_at ASC
  LIMIT 1;
$$;
