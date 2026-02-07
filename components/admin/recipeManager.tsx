import { useState, useEffect, useRef } from "react";
import {
  getRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getCountries,
  getIngredients,
  getInstructions,
  getNutritionBenefits,
} from "@/lib/supabase/admin";

import { supabase } from "@/lib/supabase/client";

interface Recipe {
  id: string;
  name: string;
  name_local?: string | null;
  description?: string | null;
  history?: string | null;
  image_url?: string | null;
  ingredients_image_url?: string | null;

  prep_time?: number | null;
  cook_time?: number | null;
  servings?: number | null;
  difficulty_level?: "easy" | "medium" | "hard" | null;
  country_id?: string | null;
  country_name?: string | null;
  flag_emoji?: string | null;

  quote_text?: string | null;
  quote_highlight?: string | null;
}

interface Country {
  id: string;
  name: string;
  flag_emoji?: string | null;
}

interface Ingredient {
  id: string;
  name: string;
  quantity?: string | null;
  order_index: number;
}

interface Instruction {
  id: string;
  step_number: number;
  instruction_text: string;
}

interface Benefit {
  id: string;
  ingredient_name: string;
  benefit_text: string;
  order_index: number;
}

const BUCKET = "recipe-images";

/**
 * Upload recipe image to Supabase Storage and return a public url.
 */
async function uploadRecipeImage(file: File, recipeId: string) {
  if (!file.type.startsWith("image/")) {
    return { url: null as string | null, error: new Error("File must be an image") };
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const fileName = `${Date.now()}.${ext}`;
  const path = `recipes/${recipeId}/${fileName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  if (uploadError) return { url: null as string | null, error: uploadError };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null as any };
}

/**
 * ✅ Upload ONE ingredients image per recipe
 */
async function uploadIngredientsImage(file: File, recipeId: string) {
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `recipes/${recipeId}/ingredients.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    cacheControl: "3600",
    contentType: file.type,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ----------------------------
// ✅ Normalizers
// ----------------------------
function normalizeRecipes(rows: any[]): Recipe[] {
  return (rows || [])
    .filter((r) => r && r.id && r.name)
    .map((r) => ({
      id: String(r.id),
      name: String(r.name ?? ""),
      name_local: r.name_local ?? null,
      description: r.description ?? null,
      history: r.history ?? null,
      image_url: r.image_url ?? null,
      ingredients_image_url: r.ingredients_image_url ?? null,
      prep_time: r.prep_time ?? null,
      cook_time: r.cook_time ?? null,
      servings: r.servings ?? null,
      difficulty_level: r.difficulty_level ?? null,
      country_id: r.country_id ?? null,
      country_name: r.country_name ?? null,
      flag_emoji: r.flag_emoji ?? null,
      quote_text: r.quote_text ?? null,
      quote_highlight: r.quote_highlight ?? null,
    }));
}

function normalizeCountries(rows: any[]): Country[] {
  return (rows || [])
    .filter((c) => c && c.id && c.name)
    .map((c) => ({
      id: String(c.id),
      name: String(c.name ?? ""),
      flag_emoji: c.flag_emoji ?? null,
    }));
}

function normalizeIngredients(rows: any[]): Ingredient[] {
  return (rows || [])
    .filter((i) => i && i.id && i.name)
    .map((i) => ({
      id: String(i.id),
      name: String(i.name ?? ""),
      quantity: i.quantity ?? null,
      order_index: i.order_index ?? 0,
    }))
    .sort((a, b) => a.order_index - b.order_index);
}

function normalizeInstructions(rows: any[]): Instruction[] {
  return (rows || [])
    .filter((s) => s && s.id && s.instruction_text)
    .map((s) => ({
      id: String(s.id),
      step_number: s.step_number ?? 1,
      instruction_text: String(s.instruction_text ?? ""),
    }))
    .sort((a, b) => a.step_number - b.step_number);
}

function normalizeBenefits(rows: any[]): Benefit[] {
  return (rows || [])
    .filter((b) => b && b.id && (b.benefit_text || b.ingredient_name))
    .map((b) => ({
      id: String(b.id),
      ingredient_name: String(b.ingredient_name ?? ""),
      benefit_text: String(b.benefit_text ?? ""),
      order_index: b.order_index ?? 0,
    }))
    .sort((a, b) => a.order_index - b.order_index);
}

export default function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    name_local: "",
    description: "",
    history: "",
    image_url: "",
    prep_time: "",
    cook_time: "",
    servings: "",
    difficulty_level: "medium" as "easy" | "medium" | "hard",
    country_id: "",
    quote_text: "",
    quote_highlight: "",
  });

  // Ingredients / Instructions / Benefits
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  const [newIngredient, setNewIngredient] = useState({ name: "", quantity: "" });
  const [newInstruction, setNewInstruction] = useState("");
  const [newBenefit, setNewBenefit] = useState({ ingredient_name: "", benefit_text: "" });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Recipe image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Ingredients image upload (ONE per recipe)
  const [ingredientsImage, setIngredientsImage] = useState<File | null>(null);
  const [ingredientsPreview, setIngredientsPreview] = useState<string>("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    if (!ingredientsImage) return;
    const url = URL.createObjectURL(ingredientsImage);
    setIngredientsPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [ingredientsImage]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    const [recipesRes, countriesRes] = await Promise.all([getRecipes(), getCountries()]);

    if (recipesRes.error) {
      setError("Failed to load recipes");
      console.error(recipesRes.error);
    } else {
      setRecipes(normalizeRecipes((recipesRes as any).data || []));
    }

    if (countriesRes.error) {
      setError("Failed to load countries");
      console.error(countriesRes.error);
    } else {
      setCountries(normalizeCountries((countriesRes as any).data || []));
    }

    setLoading(false);
  };

  const loadRecipeDetails = async (recipeId: string) => {
    const [ingredientsRes, instructionsRes, benefitsRes] = await Promise.all([
      getIngredients(recipeId),
      getInstructions(recipeId),
      getNutritionBenefits(recipeId),
    ]);

    if (!ingredientsRes.error) setIngredients(normalizeIngredients((ingredientsRes as any).data || []));
    if (!instructionsRes.error) setInstructions(normalizeInstructions((instructionsRes as any).data || []));
    if (!benefitsRes.error) setBenefits(normalizeBenefits((benefitsRes as any).data || []));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const baseRecipeData = {
      name: formData.name,
      name_local: formData.name_local || undefined,
      description: formData.description || undefined,
      history: formData.history || undefined,
      image_url: formData.image_url || undefined,
      prep_time: formData.prep_time ? parseInt(formData.prep_time, 10) : undefined,
      cook_time: formData.cook_time ? parseInt(formData.cook_time, 10) : undefined,
      servings: formData.servings ? parseInt(formData.servings, 10) : undefined,
      difficulty_level: formData.difficulty_level,
      country_id: formData.country_id || undefined,
      quote_text: formData.quote_text?.trim() || undefined,
      quote_highlight: formData.quote_highlight?.trim() || undefined,
    };

    try {
      setUploading(true);

      let recipeId = editingRecipe?.id;

      // ✅ Update OR create recipe first
      if (editingRecipe) {
        let finalImageUrl = baseRecipeData.image_url;

        if (imageFile) {
          const up = await uploadRecipeImage(imageFile, editingRecipe.id);
          if (up.error) throw up.error;
          finalImageUrl = up.url || undefined;
        }

        const { error: upErr } = await updateRecipe(editingRecipe.id, {
          ...baseRecipeData,
          image_url: finalImageUrl,
        });

        if (upErr) throw upErr;

        recipeId = editingRecipe.id;
        setSuccess("Recipe updated successfully!");
      } else {
        const { data, error: addErr } = await addRecipe(baseRecipeData);
        if (addErr) throw addErr;

        const created = (data as any)?.[0];
        recipeId = created?.id as string | undefined;
        if (!recipeId) throw new Error("Recipe not created (missing id)");

        if (imageFile) {
          const up = await uploadRecipeImage(imageFile, recipeId);
          if (up.error) throw up.error;

          const { error: imgErr } = await updateRecipe(recipeId, { image_url: up.url! });
          if (imgErr) throw imgErr;
        }

        setSuccess("Recipe created! Now add ingredients, instructions, benefits.");
      }

      // ✅ Upload Ingredients image (ONE per recipe)
      if (ingredientsImage && recipeId) {
        const url = await uploadIngredientsImage(ingredientsImage, recipeId);
        const { error: ingImgErr } = await updateRecipe(recipeId, { ingredients_image_url: url });
        if (ingImgErr) throw ingImgErr;

        // keep preview & clear file input
        setIngredientsImage(null);
        setIngredientsPreview("");
      }

      // keep selection & reload details
      setSelectedRecipe(recipeId || null);
      if (recipeId) await loadRecipeDetails(recipeId);
      await fetchData();

      // clear recipe image input
      setImageFile(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  // ---------- handlers below are unchanged (ingredients/instructions/benefits) ----------
  const handleEdit = async (recipe: Recipe) => {
    setSuccess("");
    setError("");

    setEditingRecipe(recipe);
    setSelectedRecipe(recipe.id);

    setFormData({
      name: recipe.name,
      name_local: recipe.name_local || "",
      description: recipe.description || "",
      history: recipe.history || "",
      image_url: recipe.image_url || "",
      prep_time: recipe.prep_time?.toString() || "",
      cook_time: recipe.cook_time?.toString() || "",
      servings: recipe.servings?.toString() || "",
      difficulty_level: recipe.difficulty_level || "medium",
      country_id: recipe.country_id || "",
      quote_text: recipe.quote_text || "",
      quote_highlight: recipe.quote_highlight || "",
    });

    setImageFile(null);
    setImagePreview(recipe.image_url || "");
    setIngredientsImage(null);
    setIngredientsPreview(recipe.ingredients_image_url || "");

    if (fileInputRef.current) fileInputRef.current.value = "";

    setShowForm(true);
    await loadRecipeDetails(recipe.id);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await deleteRecipe(id);
      if (error) throw error;
      setSuccess("Recipe deleted successfully!");
      fetchData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete recipe");
    }
  };

  

  const handleCancel = () => {
    setShowForm(false);
    setEditingRecipe(null);
    setSelectedRecipe(null);

    setIngredients([]);
    setInstructions([]);
    setBenefits([]);

    setNewIngredient({ name: "", quantity: "" });
    setNewInstruction("");
    setNewBenefit({ ingredient_name: "", benefit_text: "" });

    setFormData({
      name: "",
      name_local: "",
      description: "",
      history: "",
      image_url: "",
      prep_time: "",
      cook_time: "",
      servings: "",
      difficulty_level: "medium",
      country_id: "",
      quote_text: "",
      quote_highlight: "",
    });

    setImageFile(null);
    setImagePreview("");
    setIngredientsImage(null);
    setIngredientsPreview("");

    if (fileInputRef.current) fileInputRef.current.value = "";

    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#E8B44F] border-t-[#6B4423] rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-[#6B4423]">Loading recipes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#6B4423]">Recipes ({recipes.length})</h2>
        <button
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          className="bg-[#6B4423] text-white px-4 py-2 rounded hover:bg-[#8B5A2B] transition-colors"
        >
          {showForm ? "✕ Cancel" : "+ Add Recipe"}
        </button>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-[#6B4423] mb-4">{editingRecipe ? "Edit Recipe" : "Add New Recipe"}</h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ✅ Ingredients Image Upload (ONE per recipe) */}
            <div className="border-t pt-4">
              <label className="block text-sm font-semibold text-[#6B4423] mb-2">
                Ingredients Image (one image for the Ingredients page)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIngredientsImage(e.target.files?.[0] ?? null)}
                className="w-full px-4 py-2 border-2 border-[#D4A439] rounded"
              />

              {(ingredientsPreview || editingRecipe?.ingredients_image_url) && (
                <div className="mt-3">
                  <p className="text-sm text-[#6B4423] font-semibold mb-2">Preview</p>
                  <img
                    src={ingredientsPreview || editingRecipe?.ingredients_image_url || ""}
                    alt="Ingredients preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className={`bg-[#6B4423] text-white px-6 py-2 rounded transition-colors ${
                  uploading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#8B5A2B]"
                }`}
              >
                {uploading ? "Saving..." : editingRecipe ? "Update Recipe" : "Add Recipe"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recipes List (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {!!recipe.image_url && (
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )}

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-[#6B4423]">{recipe.name}</h3>
                  {!!recipe.name_local && <p className="text-sm text-gray-500">{recipe.name_local}</p>}
                </div>
                {!!recipe.flag_emoji && <span className="text-2xl">{recipe.flag_emoji}</span>}
              </div>

              {!!recipe.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(recipe)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(recipe.id, recipe.name)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No recipes added yet.</p>
          <p className="text-gray-400 text-sm mt-2">Click {`"Add Recipe"`} to get started!</p>
        </div>
      )}
    </div>
  );
}
