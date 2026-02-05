import { supabase } from "@/lib/supabase/client";

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select(`
      recipe_id,
      recipes:recipes_with_countries (
        id,
        name,
        image_url,
        country_name,
        flag_emoji
      )
    `)
    .eq("user_id", userId);

  if (error) return { data: null, error };

  return {
    data: data.map((row: any) => row.recipes),
    error: null,
  };
}
