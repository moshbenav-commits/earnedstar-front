-- Merchant-controlled SEO for public Review Profile pages
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT;

COMMENT ON COLUMN businesses.seo_title IS 'Optional override for <title> on /store/[slug]';
COMMENT ON COLUMN businesses.seo_description IS 'Optional meta description for Google indexing';
