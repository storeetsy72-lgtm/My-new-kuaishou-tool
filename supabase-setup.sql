-- Create the reviews table
CREATE TABLE public.reviews (
    id uuid primary key default gen_random_uuid(),
    rating smallint not null check (rating between 1 and 5),
    comment text,
    owner_token text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create a view for public access (hides owner_token)
CREATE VIEW public.public_reviews AS
SELECT id, rating, comment, created_at, updated_at
FROM public.reviews;

-- Grant access to the view
GRANT SELECT ON public.public_reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;

-- Revoke direct table access from anon and authenticated to prevent reading owner_token
REVOKE ALL ON public.reviews FROM anon, authenticated;

-- Create the create_review RPC
CREATE OR REPLACE FUNCTION public.create_review(
    _rating int,
    _comment text,
    _owner_token text
) RETURNS uuid AS $$
DECLARE
    new_id uuid;
BEGIN
    IF _rating < 1 OR _rating > 5 THEN
        RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;
    
    -- Check for spam
    IF _comment ~* '(?:https?:\/\/|www\.)|(?:\b|\.)(?:com|net|org|in|io|co|xyz|me|us|uk|info|biz|tv|edu|gov|app|dev)\b|dot\s+(?:com|net|org|in|io)|\[\.\]|\(\.\)' THEN
        RAISE EXCEPTION 'Links are not allowed in reviews.';
    END IF;

    INSERT INTO public.reviews (rating, comment, owner_token)
    VALUES (_rating, substring(_comment from 1 for 300), _owner_token)
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the update_review_owned RPC
CREATE OR REPLACE FUNCTION public.update_review_owned(
    _id uuid,
    _rating int,
    _comment text,
    _owner_token text
) RETURNS void AS $$
BEGIN
    IF _rating < 1 OR _rating > 5 THEN
        RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;

    -- Check for spam
    IF _comment ~* '(?:https?:\/\/|www\.)|(?:\b|\.)(?:com|net|org|in|io|co|xyz|me|us|uk|info|biz|tv|edu|gov|app|dev)\b|dot\s+(?:com|net|org|in|io)|\[\.\]|\(\.\)' THEN
        RAISE EXCEPTION 'Links are not allowed in reviews.';
    END IF;

    UPDATE public.reviews
    SET rating = _rating,
        comment = substring(_comment from 1 for 300),
        updated_at = now()
    WHERE id = _id AND owner_token = _owner_token;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Review not found or not owned by you';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the delete_review_owned RPC
CREATE OR REPLACE FUNCTION public.delete_review_owned(
    _id uuid,
    _owner_token text
) RETURNS void AS $$
BEGIN
    DELETE FROM public.reviews
    WHERE id = _id AND owner_token = _owner_token;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Review not found or not owned by you';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.create_review(int, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_review_owned(uuid, int, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_review_owned(uuid, text) TO anon, authenticated;
