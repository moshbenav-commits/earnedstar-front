-- Phase 19–20: crawlability flags + AI review summary storage
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS public_profile_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS review_summary_ai TEXT,
  ADD COLUMN IF NOT EXISTS review_summary_generated_at TIMESTAMPTZ;

COMMENT ON COLUMN businesses.public_profile_enabled IS 'When false, exclude merchant from sitemap and public discovery';
COMMENT ON COLUMN businesses.review_summary_ai IS 'AI-generated What customers say blurb (display only, not JSON-LD)';
COMMENT ON COLUMN businesses.review_summary_generated_at IS 'When review_summary_ai was last generated';
