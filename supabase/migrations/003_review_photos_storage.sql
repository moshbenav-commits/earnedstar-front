-- Review photo storage bucket (run in Supabase SQL editor after creating bucket in Storage UI)
-- Dashboard: Storage → New bucket → name: review-photos → Public bucket: ON

-- Allow public read
CREATE POLICY "Public read review photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

-- Service role uploads via earnedstar-back (bypasses RLS with service key)
