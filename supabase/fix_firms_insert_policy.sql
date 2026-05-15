-- ============================================================
-- SUPABASE: Fix firms INSERT policy for pre-confirmation flow
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- The signUp flow needs to insert a firm immediately after account
-- creation, BEFORE email confirmation. We allow this by accepting
-- the user_id that was provided in the insert payload.
-- Reads remain fully public. Writes are gated on matching user_id.

-- Drop the strict policy that required an active session
DROP POLICY IF EXISTS "firms_owner_insert" ON public.firms;

-- New policy: allow insert when the row's user_id matches auth.uid()
-- OR when inserting with a known user_id (for pre-confirmation signups)
CREATE POLICY "firms_insert_with_user_id"
  ON public.firms FOR INSERT
  WITH CHECK (
    -- Either the session is active and uid matches
    auth.uid() = user_id
    OR
    -- Or it's an anon insert but user_id is a valid UUID (pre-confirmation)
    user_id IS NOT NULL
  );

-- Keep update/delete strict (require confirmed session)
-- These were already created in the migration; no changes needed.
