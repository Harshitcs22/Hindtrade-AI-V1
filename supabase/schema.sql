-- =============================================================================
-- HINDTRADE SOVEREIGN OS — SUPABASE PRODUCTION SCHEMA v2
-- Multi-Tenant Export Compliance Platform
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TABLE: firms
-- Root identity for every tenant. Linked to auth.users via user_id.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.firms (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ      NOT NULL DEFAULT now(),
  slug           TEXT             UNIQUE NOT NULL,          -- e.g. 'himrock-exports'
  name           TEXT             NOT NULL,
  user_id        UUID             REFERENCES auth.users(id) ON DELETE SET NULL,  -- Owning auth user
  iec_code       TEXT,                                      -- IEC registration number
  trust_score    INTEGER          NOT NULL DEFAULT 50,
  location       TEXT,
  banner_url     TEXT,
  established    INTEGER,
  years_in_trade INTEGER,
  global_rank    TEXT,
  deals_in       TEXT,
  markets        TEXT,
  shipments      TEXT,
  net_worth      TEXT,
  udin           TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS firms_slug_idx     ON public.firms (slug);
CREATE INDEX        IF NOT EXISTS firms_user_id_idx  ON public.firms (user_id);

-- =============================================================================
-- TABLE: products
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  firm_id     UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  hsn_code    TEXT NOT NULL,
  material    JSONB,   -- Array of material strings
  journey     JSONB,   -- Manufacturing steps: [{step,title,description,location}]
  image_url   TEXT,
  audit_trace TEXT
);

CREATE INDEX IF NOT EXISTS products_firm_id_idx  ON public.products (firm_id);
CREATE INDEX IF NOT EXISTS products_journey_gin  ON public.products USING gin (journey);

-- =============================================================================
-- TABLE: certifications
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.certifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  firm_id    UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('verified', 'pending', 'expired', 'active')),
  file_url   TEXT,
  hash       TEXT
);

CREATE INDEX IF NOT EXISTS certifications_firm_id_idx ON public.certifications (firm_id);

-- =============================================================================
-- TABLE: leads
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  firm_id         UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  buyer_name      TEXT,
  inquiry_text    TEXT,
  contact_email   TEXT,
  product_context TEXT
);

CREATE INDEX IF NOT EXISTS leads_firm_id_idx     ON public.leads (firm_id);
CREATE INDEX IF NOT EXISTS leads_firm_created_idx ON public.leads (firm_id, created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- ── firms ──────────────────────────────────────────────────────────────────
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;

-- Anyone can read a firm's public profile (showroom)
CREATE POLICY "firms_public_read"
  ON public.firms FOR SELECT USING (true);

-- Only the owning user can insert their own firm
CREATE POLICY "firms_owner_insert"
  ON public.firms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only the owning user can update their firm
CREATE POLICY "firms_owner_update"
  ON public.firms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only the owning user can delete their firm
CREATE POLICY "firms_owner_delete"
  ON public.firms FOR DELETE
  USING (auth.uid() = user_id);

-- ── products ───────────────────────────────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "products_owner_write"
  ON public.products FOR ALL
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

-- ── certifications ─────────────────────────────────────────────────────────
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certs_public_read"
  ON public.certifications FOR SELECT USING (true);

CREATE POLICY "certs_owner_write"
  ON public.certifications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.firms
      WHERE firms.id = certifications.firm_id
        AND firms.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.firms
      WHERE firms.id = certifications.firm_id
        AND firms.user_id = auth.uid()
    )
  );

-- ── leads (private — only firm owner) ──────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_owner_only"
  ON public.leads FOR ALL
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

-- =============================================================================
-- HELPER FUNCTION: get_my_firm_slug()
-- Returns the slug of the firm owned by the currently authenticated user.
-- Used by the login redirect flow.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_my_firm_slug()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT slug FROM public.firms
  WHERE user_id = auth.uid()
  ORDER BY created_at ASC
  LIMIT 1;
$$;

-- =============================================================================
-- SEED: HIMROCK EXPORTS (Demo firm — uncomment to seed)
-- =============================================================================
/*
INSERT INTO public.firms (slug, name, iec_code, trust_score, location, established,
  years_in_trade, global_rank, deals_in, markets, shipments, net_worth, udin)
VALUES (
  'himrock-exports', 'HIMROCK EXPORTS', 'IEC-0506001234', 100,
  'Jalandhar, IN', 1980, 44, 'TIER 1',
  'Sports Goods, Premium Leather', 'USA, United Kingdom, UAE',
  '120+', '₹12 Cr', '240591B2AASCV1923'
) ON CONFLICT (slug) DO NOTHING;
*/
