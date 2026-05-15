-- Fix RLS for products table to allow deletions
-- This ensures that the 'Decommission Asset' action persists across refreshes

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing delete policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Enable delete for all users" ON products;

-- Create a policy that allows anyone to delete (Development Mode)
-- In production, this should be tied to the firm's owner/auth.uid()
CREATE POLICY "Enable delete for all users" ON "public"."products"
AS PERMISSIVE FOR DELETE
TO public
USING (true);

-- Also ensure SELECT, INSERT, UPDATE are enabled
DROP POLICY IF EXISTS "Enable all access for all users" ON products;
CREATE POLICY "Enable all access for all users" ON "public"."products"
AS PERMISSIVE FOR ALL
TO public
USING (true)
WITH CHECK (true);