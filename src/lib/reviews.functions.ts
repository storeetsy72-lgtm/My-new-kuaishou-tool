import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(300).nullable().optional(),
});

const ownedSchema = ratingSchema.extend({
  id: z.string().uuid(),
  token: z.string().min(10).max(120),
});

export const createReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ratingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const token = crypto.randomUUID() + crypto.randomUUID().slice(0, 8);
    const { data: row, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        rating: data.rating,
        comment: data.comment?.trim() ? data.comment.trim().slice(0, 300) : null,
        owner_token: token,
      })
      .select("id")
      .single();
    if (error || !row) throw new Error(error?.message ?? "Could not save review");
    return { id: row.id as string, token };
  });

export const updateReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ownedSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, count } = await supabaseAdmin
      .from("reviews")
      .update(
        {
          rating: data.rating,
          comment: data.comment?.trim() ? data.comment.trim().slice(0, 300) : null,
          updated_at: new Date().toISOString(),
        },
        { count: "exact" },
      )
      .eq("id", data.id)
      .eq("owner_token", data.token);
    if (error) throw new Error(error.message);
    if (!count) throw new Error("Review not found");
    return { ok: true };
  });

export const deleteReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), token: z.string().min(10).max(120) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", data.id)
      .eq("owner_token", data.token);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
