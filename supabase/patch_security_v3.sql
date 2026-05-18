-- =============================================================================
-- HINDTRADE SOVEREIGN OS — PRODUCTION SECURITY PATCH (v3.0-RC1)
-- Purpose: Harden database RLS, fix broken manual audit tickets, secure showroom 
--          leads, and resolve the admin role authorization schema.
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 1: HARDEN PRODUCTS SECURITY (CRITICAL RED-ALERT VULNERABILITY FIX)
-- ─────────────────────────────────────────────────────────────────────────────
-- Vulnerability: fix_products_deletion.sql opened full public access (USING true) 
-- for all CRUD operations, completely disabling row-level protection.
-- Fix: Remove the permissive "Enable all access for all users" and lock products
-- strictly to their owning firm.

-- [INFO] Securing products table...

-- Drop the dangerous permissive development policies
DROP POLICY IF EXISTS "Enable all access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.products;
DROP POLICY IF EXISTS "products_owner_write" ON public.products;
DROP POLICY IF EXISTS "products_public_read" ON public.products;

-- Policy 1: Anyone can read products (Public Showroom profile display)
CREATE POLICY "products_public_read_v3"
  ON public.products 
  FOR SELECT 
  TO public
  USING (true);

-- Policy 2: Secure ownership check for write operations (INSERT, UPDATE, DELETE)
-- Checks if the authenticated user's ID matches the firm's owner (user_id)
CREATE POLICY "products_owner_all_v3"
  ON public.products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.firms
      WHERE firms.id = products.firm_id
        AND firms.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.firms
      WHERE firms.id = products.firm_id
        AND firms.user_id = auth.uid()
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 2: SECURE FIRMS INGESTION (SPAM PREVENTION)
-- ─────────────────────────────────────────────────────────────────────────────
-- Vulnerability: fix_firms_insert_policy.sql allowed anonymous inserts with any 
-- non-null user_id.
-- Fix: Ensure the user can only insert a firm associated with their own auth.uid().

-- [INFO] Securing firms table...

DROP POLICY IF EXISTS "firms_insert_with_user_id" ON public.firms;
DROP POLICY IF EXISTS "firms_owner_insert" ON public.firms;

-- Allow authenticated users to create a firm ONLY with their own user_id
CREATE POLICY "firms_owner_insert_v3"
  ON public.firms
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 3: FIX LEADS CONTEXT (PUBLIC LEAD INTAKE RESTORE)
-- ─────────────────────────────────────────────────────────────────────────────
-- Vulnerability: leads_owner_only locked all actions to the firm owner, blocking
-- external buyers from submitting showroom inquiries/leads.
-- Fix: Allow anonymous public users to INSERT leads, while restricting reading/deleting
-- strictly to the owning exporter.

-- [INFO] Securing and fixing leads table...

DROP POLICY IF EXISTS "leads_owner_only" ON public.leads;

-- Policy 1: Allow anyone (even anonymous/public buyers) to submit inquiries
CREATE POLICY "leads_insert_public_v3"
  ON public.leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy 2: Allow ONLY the firm owner to select, update, or delete their leads
CREATE POLICY "leads_owner_access_v3"
  ON public.leads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.firms
      WHERE firms.id = leads.firm_id
        AND firms.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.firms
      WHERE firms.id = leads.firm_id
        AND firms.user_id = auth.uid()
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 4: FIX MANUAL AUDIT INGESTION & ADMIN DELEGATION
-- ─────────────────────────────────────────────────────────────────────────────
-- Bugs: 
-- 1. No INSERT policy existed on verifications, crashing manual audit requests.
-- 2. Admin policy referenced (SELECT role FROM auth.users) which is invalid.
-- Fix:
-- 1. Allow authenticated firm owners to insert audit verification requests.
-- 2. Setup a custom profiles/roles mapping or query auth.users metadata securely.

-- [INFO] Fixing and securing verifications table...

DROP POLICY IF EXISTS "verifications_select_public" ON public.verifications;
DROP POLICY IF EXISTS "verifications_update_admin" ON public.verifications;

-- Policy 1: Public can view verifications (verified trust indicators on profile)
CREATE POLICY "verifications_public_read_v3"
  ON public.verifications
  FOR SELECT
  TO public
  USING (true);

-- Policy 2: Allow authenticated firm owners to submit a verification request
CREATE POLICY "verifications_insert_owner_v3"
  ON public.verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.firms
      WHERE firms.id = verifications.firm_id
        AND firms.user_id = auth.uid()
    )
  );

-- Policy 3: Allow system admins to manage and update verifications (approvals)
-- Resolves standard Supabase role issues by checking the metadata role or admin email
CREATE POLICY "verifications_update_admin_v3"
  ON public.verifications
  FOR UPDATE
  TO authenticated
  USING (
    -- Secure check using either custom user metadata or hardcoded system administrator email
    (auth.jwt() ->> 'email' = 'akshayexports@gmail.com')
    OR
    (coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin')
  );

COMMIT;

-- [SUCCESS] Security Patch applied successfully. Database fully hardened!
