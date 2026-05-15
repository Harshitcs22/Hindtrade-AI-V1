-- =============================================================================
-- MIGRATION: ADD TRADE NETWORK PRESENCE
-- Description: Adds JSONB columns to the 'firms' table to support dynamic 
--              Global and Domestic presence tracking.
-- =============================================================================

-- 1. Add global_presence column
ALTER TABLE public.firms 
ADD COLUMN IF NOT EXISTS global_presence JSONB DEFAULT '[]'::jsonb;

-- 2. Add domestic_presence column
ALTER TABLE public.firms 
ADD COLUMN IF NOT EXISTS domestic_presence JSONB DEFAULT '{"isPanIndia": false, "states": []}'::jsonb;

-- 3. Add GIN indexes for efficient JSON querying (optional but recommended for scale)
CREATE INDEX IF NOT EXISTS firms_global_presence_idx ON public.firms USING gin (global_presence);
CREATE INDEX IF NOT EXISTS firms_domestic_presence_idx ON public.firms USING gin (domestic_presence);

-- 4. Add comments for documentation
COMMENT ON COLUMN public.firms.global_presence IS 'Array of active/growing export markets: [{id, name, status, cx, cy, flag, exports}]';
COMMENT ON COLUMN public.firms.domestic_presence IS 'Domestic reach configuration: {isPanIndia: boolean, states: string[]}';
