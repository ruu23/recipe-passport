// lib/supabase/api.ts
import { supabase } from './client'
import { auth } from './auth'
import type { Database } from "./database.types"

type Role = 'user' | 'editor' | 'admin'
type IngredientRow = Database["public"]["Tables"]["ingredients"]["Row"]
type InstructionRow = Database["public"]["Tables"]["instructions"]["Row"]
type NutritionRow = Database["public"]["Tables"]["nutrition_benefits"]["Row"]

async function requireAuth() {
  const user = await auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user
}

async function getMyRole(): Promise<Role> {
  const user = await requireAuth()
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data.role as Role
}

async function requireEditorOrAdmin() {
  const role = await getMyRole()
  if (role !== 'editor' && role !== 'admin') throw new Error('Editor/Admin only')
}

async function requireAdmin() {
  const role = await getMyRole()
  if (role !== 'admin') throw new Error('Admin only')
}

// =====================================================
// COUNTRIES API
// =====================================================
export const countriesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getByName(name: string) {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('name', name)
      .single()

    if (error) throw error
    return data
  },

  // ===== EDITOR/ADMIN =====
  async create(country: {
    name: string
    flag_emoji?: string
    description?: string
    image_url?: string
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('countries')
      .insert(country)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: {
    name?: string
    flag_emoji?: string
    description?: string
    image_url?: string
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('countries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ✅ Admin only delete
  async delete(id: string) {
    await requireAdmin()
    const { error } = await supabase
      .from('countries')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// =====================================================
// RECIPES API
// =====================================================
export const recipesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('recipes_with_countries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByCountry(countryId: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        countries ( id, name, flag_emoji )
      `)
      .eq('country_id', countryId)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        countries ( id, name, flag_emoji, description ),
        ingredients ( id, name, quantity, order_index ),
        instructions ( id, step_number, instruction_text ),
        nutrition_benefits ( id, ingredient_name, benefit_text, order_index )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    // ✅ Sort for UI
    const ingredients = (data.ingredients ?? []) as IngredientRow[]
    const instructions = (data.instructions ?? []) as InstructionRow[]
    const nutrition = (data.nutrition_benefits ?? []) as NutritionRow[]

    ingredients.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    instructions.sort((a, b) => (a.step_number ?? 0) - (b.step_number ?? 0))
    nutrition.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))

    return {
    ...data,
    ingredients,
    instructions,
    nutrition_benefits: nutrition,
    }
  },

  async search(query: string) {
    const safe = query.replace(/[%_,]/g, '\\$&') // simple sanitize
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        countries ( id, name, flag_emoji )
      `)
      .or(`name.ilike.%${safe}%,name_local.ilike.%${safe}%,description.ilike.%${safe}%`)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  // ===== EDITOR/ADMIN =====
  async create(recipe: {
    country_id: string
    name: string
    name_local?: string
    description?: string
    history?: string
    image_url?: string
    prep_time?: number
    cook_time?: number
    servings?: number
    difficulty_level?: 'easy' | 'medium' | 'hard'
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipe)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: {
    country_id?: string
    name?: string
    name_local?: string
    description?: string
    history?: string
    image_url?: string
    prep_time?: number
    cook_time?: number
    servings?: number
    difficulty_level?: 'easy' | 'medium' | 'hard'
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ✅ Admin only delete
  async delete(id: string) {
    await requireAdmin()
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Ingredients (editor/admin create/update, admin delete حسب RLS)
  async addIngredient(ingredient: {
    recipe_id: string
    name: string
    quantity?: string
    order_index?: number
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('ingredients')
      .insert(ingredient)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateIngredient(id: string, updates: {
    name?: string
    quantity?: string
    order_index?: number
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('ingredients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ✅ Admin only delete (UX guard)
  async deleteIngredient(id: string) {
    await requireAdmin()
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async addInstruction(instruction: {
    recipe_id: string
    step_number: number
    instruction_text: string
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('instructions')
      .insert(instruction)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateInstruction(id: string, updates: {
    step_number?: number
    instruction_text?: string
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('instructions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ✅ Admin only delete
  async deleteInstruction(id: string) {
    await requireAdmin()
    const { error } = await supabase
      .from('instructions')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async addNutritionBenefit(benefit: {
    recipe_id: string
    ingredient_name: string
    benefit_text: string
    order_index?: number
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('nutrition_benefits')
      .insert(benefit)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateNutritionBenefit(id: string, updates: {
    ingredient_name?: string
    benefit_text?: string
    order_index?: number
  }) {
    await requireEditorOrAdmin()
    const { data, error } = await supabase
      .from('nutrition_benefits')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ✅ Admin only delete
  async deleteNutritionBenefit(id: string) {
    await requireAdmin()
    const { error } = await supabase
      .from('nutrition_benefits')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// =====================================================
// USER FAVORITES API
// =====================================================
export const favoritesAPI = {
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        created_at,
        recipes (
          *,
          countries ( id, name, flag_emoji )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async addFavorite(userId: string, recipeId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, recipe_id: recipeId })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeFavorite(userId: string, recipeId: string) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)

    if (error) throw error
  },

  async isFavorite(userId: string, recipeId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .maybeSingle()

    if (error) throw error
    return !!data
  },
}

// =====================================================
// SEARCH HISTORY API
// =====================================================
export const searchHistoryAPI = {
  async getUserHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('recipe_search_history')
      .select('*')
      .eq('user_id', userId)
      .order('searched_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  async addSearch(userId: string, query: string) {
    const { data, error } = await supabase
      .from('recipe_search_history')
      .insert({ user_id: userId, search_query: query })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async clearHistory(userId: string) {
    const { error } = await supabase
      .from('recipe_search_history')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
  },
}

// =====================================================
// USER PROFILE API
// =====================================================
export const userAPI = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: {
    full_name?: string
    age_or_birth?: string
  }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
