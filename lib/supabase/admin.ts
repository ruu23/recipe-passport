import { supabase } from "@/lib/supabase/client";

// ==================== COUNTRIES ====================

/**
 * Fetch all countries
 */
export async function getCountries() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name');
  return { data, error };
}

/**
 * Add a new country
 */
export async function addCountry(country: {
  name: string;
  flag_emoji?: string;
  description?: string;
  image_url?: string;
}) {
  const { data, error } = await supabase
    .from('countries')
    .insert([country])
    .select();

  return { data, error };
}

/**
 * Update a country
 */
export async function updateCountry(
  id: string,
  country: {
    name?: string;
    flag_emoji?: string;
    description?: string;
    image_url?: string;
  }
) {
  const { data, error } = await supabase
    .from('countries')
    .update(country)
    .eq('id', id)
    .select();

  return { data, error };
}

/**
 * Delete a country
 */
export async function deleteCountry(id: string) {
  const { data, error } = await supabase
    .from('countries')
    .delete()
    .eq('id', id);

  return { data, error };
}

// ==================== RECIPES ====================

/**
 * Fetch all recipes with country info
 */
export async function getRecipes() {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      id,
      name,
      name_local,
      description,
      history,
      image_url,
      ingredients_image_url,
      prep_time,
      cook_time,
      servings,
      difficulty_level,
      country_id,
      created_at,
      countries (
        name,
        flag_emoji
      )
    `
    )
    .order("created_at", { ascending: false });

  const mapped =
    data?.map((r: any) => ({
      ...r,
      country_name: r.countries?.name ?? null,
      flag_emoji: r.countries?.flag_emoji ?? null,
    })) ?? [];

  return { data: mapped, error };
}



/**
 * Add a new recipe
 */
export async function addRecipe(recipe: {
  name: string;
  name_local?: string;
  description?: string;
  history?: string;
  image_url?: string;
  ingredients_image_url?: string; // ✅ add
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty_level?: 'easy' | 'medium' | 'hard';
  country_id?: string;
}) {
  const { data, error } = await supabase
    .from('recipes')
    .insert([recipe])
    .select();

  return { data, error };
}


/**
 * Update a recipe
 */
export async function updateRecipe(
  id: string,
  recipe: {
    name?: string;
    name_local?: string;
    description?: string;
    history?: string;
    image_url?: string;
    ingredients_image_url?: string; // ✅ add
    prep_time?: number;
    cook_time?: number;
    servings?: number;
    difficulty_level?: 'easy' | 'medium' | 'hard';
    country_id?: string;
  }
) {
  const { data, error } = await supabase
    .from('recipes')
    .update(recipe)
    .eq('id', id)
    .select();

  return { data, error };
}


/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string) {
  const { data, error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id);

  return { data, error };
}

// ==================== INGREDIENTS ====================

/**
 * Get ingredients for a recipe
 */
export async function getIngredients(recipeId: string) {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('order_index');

  return { data, error };
}

/**
 * Add ingredient to recipe
 */
export async function addIngredient(ingredient: {
  recipe_id: string;
  name: string;
  quantity?: string;
  order_index?: number;
}) {
  const { data, error } = await supabase
    .from('ingredients')
    .insert([ingredient])
    .select();

  return { data, error };
}

/**
 * Update ingredient
 */
export async function updateIngredient(
  id: string,
  ingredient: {
    name?: string;
    quantity?: string;
    order_index?: number;
  }
) {
  const { data, error } = await supabase
    .from('ingredients')
    .update(ingredient)
    .eq('id', id)
    .select();

  return { data, error };
}

/**
 * Delete ingredient
 */
export async function deleteIngredient(id: string) {
  const { data, error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id);

  return { data, error };
}

// ==================== INSTRUCTIONS ====================

/**
 * Get instructions for a recipe
 */
export async function getInstructions(recipeId: string) {
  const { data, error } = await supabase
    .from('instructions')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('step_number');

  return { data, error };
}

/**
 * Add instruction to recipe
 */
export async function addInstruction(instruction: {
  recipe_id: string;
  step_number: number;
  instruction_text: string;
}) {
  const { data, error } = await supabase
    .from('instructions')
    .insert([instruction])
    .select();

  return { data, error };
}

/**
 * Update instruction
 */
export async function updateInstruction(
  id: string,
  instruction: {
    step_number?: number;
    instruction_text?: string;
  }
) {
  const { data, error } = await supabase
    .from('instructions')
    .update(instruction)
    .eq('id', id)
    .select();

  return { data, error };
}

/**
 * Delete instruction
 */
export async function deleteInstruction(id: string) {
  const { data, error } = await supabase
    .from('instructions')
    .delete()
    .eq('id', id);

  return { data, error };
}

// ==================== NUTRITION BENEFITS ====================

/**
 * Get nutrition benefits for a recipe
 */
export async function getNutritionBenefits(recipeId: string) {
  const { data, error } = await supabase
    .from('nutrition_benefits')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('order_index');

  return { data, error };
}

/**
 * Add nutrition benefit to recipe
 */
export async function addNutritionBenefit(benefit: {
  recipe_id: string;
  ingredient_name: string;
  benefit_text: string;
  order_index?: number;
}) {
  const { data, error } = await supabase
    .from('nutrition_benefits')
    .insert([benefit])
    .select();

  return { data, error };
}

/**
 * Update nutrition benefit
 */
export async function updateNutritionBenefit(
  id: string,
  benefit: {
    ingredient_name?: string;
    benefit_text?: string;
    order_index?: number;
  }
) {
  const { data, error } = await supabase
    .from('nutrition_benefits')
    .update(benefit)
    .eq('id', id)
    .select();

  return { data, error };
}

/**
 * Delete nutrition benefit
 */
export async function deleteNutritionBenefit(id: string) {
  const { data, error } = await supabase
    .from('nutrition_benefits')
    .delete()
    .eq('id', id);

  return { data, error };
}