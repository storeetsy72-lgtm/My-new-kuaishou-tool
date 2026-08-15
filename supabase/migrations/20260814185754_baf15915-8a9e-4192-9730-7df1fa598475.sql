ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS owner_token text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS reviews_owner_token_idx ON public.reviews (owner_token);

REVOKE ALL ON public.reviews FROM anon;
REVOKE ALL ON public.reviews FROM authenticated;
GRANT SELECT (id, rating, comment, created_at, updated_at) ON public.reviews TO anon;
GRANT SELECT (id, rating, comment, created_at, updated_at) ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;