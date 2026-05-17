-- ════════════════════════════════════════════════════════════════════════════════
-- MIGRATION: Multi-Tenant Dashboard Architecture for HindTrade AI
-- Purpose: Establish production-grade B2B Trade Platform database schema
-- ════════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE: firms (Core firm identity and metadata)
-- ─────────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  established_year INTEGER,
  moq INTEGER,
  location TEXT,
  net_worth TEXT,
  rank INTEGER,
  iec_status TEXT CHECK (iec_status IN ('PENDING', 'VERIFIED', 'FAILED', 'REJECTED')) DEFAULT 'PENDING',
  sovereign_trust_score INTEGER DEFAULT 0,
  identity_anchored BOOLEAN DEFAULT false,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9\-]+$')
);

-- Ensure new columns exist before creating indexes (handles existing DBs)
ALTER TABLE firms
  ADD COLUMN IF NOT EXISTS iec_status TEXT CHECK (iec_status IN ('PENDING', 'VERIFIED', 'FAILED', 'REJECTED')) DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS sovereign_trust_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS identity_anchored BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS created_by UUID;

-- Ensure indexes exist (no-op if already present)
CREATE INDEX IF NOT EXISTS idx_firms_slug ON firms(slug);
CREATE INDEX IF NOT EXISTS idx_firms_iec_status ON firms(iec_status);
CREATE INDEX IF NOT EXISTS idx_firms_created_by ON firms(created_by);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='firms' AND column_name='updated_at') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_firms_updated_at ON firms(updated_at DESC)';
  END IF;
END
$$;

-- Compatibility steps moved earlier to ensure index creation is safe

-- Copy legacy column values into new normalized columns where applicable
DO $$
BEGIN
  -- Map iec_code -> iec_status if present
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='firms' AND column_name='iec_code') THEN
    EXECUTE 'UPDATE firms SET iec_status = iec_code WHERE iec_status IS NULL AND iec_code IS NOT NULL';
  END IF;

  -- Map trust_score -> sovereign_trust_score if present
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='firms' AND column_name='trust_score') THEN
    EXECUTE 'UPDATE firms SET sovereign_trust_score = trust_score WHERE sovereign_trust_score IS NULL AND trust_score IS NOT NULL';
  END IF;

  -- Map established -> established_year if present
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='firms' AND column_name='established') THEN
    EXECUTE 'UPDATE firms SET established_year = established WHERE established_year IS NULL AND established IS NOT NULL';
  END IF;
END
$$;

-- Ensure `updated_at` exists on `firms`, `products`, `certifications` for older DBs
ALTER TABLE firms
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE IF EXISTS certifications
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- If a legacy certifications table exists, migrate rows into verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT,
  status TEXT CHECK (status IN ('UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PENDING')) DEFAULT 'PENDING',
  reviewed_by UUID,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrate certifications -> verifications if certifications table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='certifications') THEN
    INSERT INTO verifications (id, firm_id, document_type, document_url, status, comments, created_at, updated_at)
    SELECT id, firm_id, name, file_url,
      CASE WHEN lower(status) IN ('verified','active') THEN 'APPROVED' WHEN lower(status) = 'pending' THEN 'PENDING' ELSE 'UNDER_REVIEW' END,
      hash, created_at, created_at
    FROM certifications
    WHERE NOT EXISTS (SELECT 1 FROM verifications v WHERE v.id = certifications.id);
  END IF;
END
$$;

-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE: firm_metrics (Performance KPIs and rolling metrics)
-- ─────────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS firm_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID UNIQUE NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  shipment_success_rate NUMERIC(5, 2) DEFAULT 0.00,
  avg_lead_time_days INTEGER DEFAULT 0,
  active_countries_count INTEGER DEFAULT 0,
  total_shipments_done INTEGER DEFAULT 0,
  ai_response_time TEXT DEFAULT 'Instant',
  total_revenue_usd NUMERIC(15, 2) DEFAULT 0,
  year_over_year_growth NUMERIC(5, 2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure updated_at exists on firm_metrics when migrating into existing DBs
ALTER TABLE firm_metrics
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_firm_metrics_firm_id ON firm_metrics(firm_id);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='firm_metrics' AND column_name='updated_at') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_firm_metrics_updated_at ON firm_metrics(updated_at DESC)';
  END IF;
END
$$;

-- ─────────────────────────────────────────────────────────────────────────────────
-- TABLE: verifications (Human-In-The-Loop verification pipeline)
-- ─────────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT,
  status TEXT CHECK (status IN ('UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PENDING')) DEFAULT 'PENDING',
  reviewed_by UUID,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure updated_at exists on verifications for older DBs
ALTER TABLE verifications
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_verifications_firm_id ON verifications(firm_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_document_type ON verifications(document_type);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verifications' AND column_name='updated_at') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_verifications_updated_at ON verifications(updated_at DESC)';
  END IF;
END
$$;

-- ─────────────────────────────────────────────────────────────────────────────────
-- TRIGGER: Auto-update firm updated_at on any change
-- ─────────────────────────────────────────────────────────────────────────────────z
CREATE OR REPLACE FUNCTION update_firm_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER firm_update_timestamp
BEFORE UPDATE ON firms
FOR EACH ROW
EXECUTE FUNCTION update_firm_timestamp();

-- ─────────────────────────────────────────────────────────────────────────────────
-- TRIGGER: Auto-update firm_metrics timestamp on verification approval
-- ─────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_metrics_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE firm_metrics
  SET updated_at = NOW()
  WHERE firm_id = NEW.firm_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verification_update_metrics_timestamp
AFTER UPDATE ON verifications
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_metrics_timestamp();

-- ─────────────────────────────────────────────────────────────────────────────────
-- SAMPLE DATA (Demo firm for testing)
-- ─────────────────────────────────────────────────────────────────────────────────
INSERT INTO firms (
  id, slug, name, industry, established_year, moq, location, net_worth, 
  rank, iec_status, sovereign_trust_score, identity_anchored
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'himrock-exports',
  'HIMROCK EXPORTS',
  'sports goods and sportswear',
  1980,
  1000,
  'Jalandhar, Punjab, India',
  '₹12 Cr',
  1,
  'VERIFIED',
  85,
  true
)
ON CONFLICT DO NOTHING;

-- Create metrics for demo firm
INSERT INTO firm_metrics (
  firm_id, shipment_success_rate, avg_lead_time_days, active_countries_count,
  total_shipments_done, total_revenue_usd, year_over_year_growth
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  98.2,
  14,
  12,
  1000,
  2400000,
  18.5
)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────────────────────────
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE firm_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Allow public READ on firms (for profile pages)
CREATE POLICY firms_select_public ON firms
  FOR SELECT USING (true);

-- Allow public READ on firm_metrics
CREATE POLICY firm_metrics_select_public ON firm_metrics
  FOR SELECT USING (true);

-- Allow authorized users to UPDATE their own firm
CREATE POLICY firms_update_own ON firms
  FOR UPDATE USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Allow public READ on verifications
CREATE POLICY verifications_select_public ON verifications
  FOR SELECT USING (true);

-- Allow admins to UPDATE verifications
CREATE POLICY verifications_update_admin ON verifications
  FOR UPDATE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );
