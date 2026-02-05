import { supabase } from "@/lib/supabase/client";

export async function getRecipeFull(recipeId: string) {
  const recipeRes = await supabase
    .from("recipes_with_countries")
    .select("*")
    .eq("id", recipeId)
    .single();

  const ingredientsRes = await supabase
    .from("ingredients")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("order_index");

  const instructionsRes = await supabase
    .from("instructions")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("step_number");

  const benefitsRes = await supabase
    .from("nutrition_benefits")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("order_index");

  return {
    recipe: recipeRes.data,
    ingredients: ingredientsRes.data ?? [],
    instructions: instructionsRes.data ?? [],
    benefits: benefitsRes.data ?? [],
    error:
      recipeRes.error || ingredientsRes.error || instructionsRes.error || benefitsRes.error,
  };
}
