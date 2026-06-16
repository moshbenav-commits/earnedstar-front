-- EarnedStar initial schema
-- Run in Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter','growth','pro','agency')),
  api_key TEXT UNIQUE DEFAULT uuid_generate_v4()::text,
  domain TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  review_count INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  description TEXT,
  image_url TEXT,
  ymm_compatible JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  order_id TEXT,
  ymm_year INTEGER,
  ymm_make TEXT,
  ymm_model TEXT,
  ymm_trim TEXT,
  rating_overall DECIMAL(3,2) NOT NULL,
  rating_fitment DECIMAL(3,2),
  rating_quality DECIMAL(3,2),
  rating_shipping DECIMAL(3,2),
  rating_description DECIMAL(3,2),
  rating_install DECIMAL(3,2),
  review_text TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_url TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  fraud_score INTEGER DEFAULT 0 CHECK (fraud_score BETWEEN 0 AND 100),
  fraud_reasons TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','published','flagged','rejected')),
  business_response TEXT,
  response_at TIMESTAMPTZ,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE TABLE review_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  customer_email TEXT,
  customer_phone TEXT,
  customer_name TEXT,
  order_id TEXT NOT NULL,
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email','sms','link')),
  send_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  review_submitted_at TIMESTAMPTZ,
  token TEXT UNIQUE DEFAULT uuid_generate_v4()::text,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','sent','opened','completed','expired')),
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE review_widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  widget_type TEXT NOT NULL CHECK (widget_type IN ('badge','carousel','list','testimonial','grid','floating')),
  config JSONB DEFAULT '{}',
  embed_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE qa_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  question TEXT NOT NULL,
  answer TEXT,
  ai_generated BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  asked_by TEXT,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE review_requests;

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage own business" ON businesses FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Business sees own reviews" ON reviews FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
CREATE POLICY "Public can read published reviews" ON reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Business sees own requests" ON review_requests FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
CREATE POLICY "Business manages products" ON products FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
CREATE POLICY "Business manages widgets" ON review_widgets FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
CREATE POLICY "Business manages QA" ON qa_items FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_ymm ON reviews(ymm_year, ymm_make, ymm_model);
CREATE INDEX idx_review_requests_token ON review_requests(token);
CREATE INDEX idx_businesses_slug ON businesses(slug);
