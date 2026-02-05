import { useState, useEffect, useRef } from "react";
import {
  getRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getCountries,
  getIngredients,
  addIngredient,
  deleteIngredient,
  getInstructions,
  addInstruction,
  deleteInstruction,
  getNutritionBenefits,
  addNutritionBenefit,
  deleteNutritionBenefit,
} from "@/lib/supabase/admin";

import { supabase } from "@/lib/supabase/client";

interface Recipe {
  id: string;
  name: string;
  name_local?: string | null;
  description?: string | null;
  history?: string | null;
  image_url?: string | null;
  prep_time?: number | null;
  cook_time?: number | null;
  servings?: number | null;
  difficulty_level?: "easy" | "medium" | "hard" | null;
  country_id?: string | null;
  country_name?: string | null;
  flag_emoji?: string | null;

  // ✅ NEW
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

// ----------------------------
// ✅ Normalizers (fix TS null errors)
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
      prep_time: r.prep_time ?? null,
      cook_time: r.cook_time ?? null,
      servings: r.servings ?? null,
      difficulty_level: r.difficulty_level ?? null,
      country_id: r.country_id ?? null,
      country_name: r.country_name ?? null,
      flag_emoji: r.flag_emoji ?? null,

      // ✅ NEW
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

    // ✅ NEW
    quote_text: "",
    quote_highlight: "",
  });

  // Ingredients & Instructions
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [newIngredient, setNewIngredient] = useState({ name: "", quantity: "" });
  const [newInstruction, setNewInstruction] = useState("");

  // ✅ Benefits
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [newBenefit, setNewBenefit] = useState({ ingredient_name: "", benefit_text: "" });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

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

  // ✅ load Ingredients + Instructions + Benefits
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

  // ✅ NEW (YOU MISSED THIS)
  quote_text: formData.quote_text?.trim() || undefined,
  quote_highlight: formData.quote_highlight?.trim() || undefined,
};


    try {
      setUploading(true);

      if (editingRecipe) {
        // Existing update logic...
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

        setSuccess("Recipe updated successfully!");
        setSelectedRecipe(editingRecipe.id);
        await loadRecipeDetails(editingRecipe.id);
      } else {
        // ✅ NEW: Create recipe first
        const { data, error: addErr } = await addRecipe(baseRecipeData);
        if (addErr) throw addErr;

        const created = (data as any)?.[0];
        const recipeId = created?.id as string | undefined;
        if (!recipeId) throw new Error("Recipe not created (missing id)");

        // ✅ Handle image upload if provided
        if (imageFile) {
          const up = await uploadRecipeImage(imageFile, recipeId);
          if (up.error) throw up.error;

          const { error: imgErr } = await updateRecipe(recipeId, { image_url: up.url! });
          if (imgErr) throw imgErr;
        }

        // ✅ Set the selected recipe and switch to edit mode
        setSelectedRecipe(recipeId);
        setEditingRecipe({
          id: recipeId,
          name: formData.name,
          name_local: formData.name_local || null,
          description: formData.description || null,
          history: formData.history || null,
          image_url: imageFile ? undefined : (formData.image_url || null),
          prep_time: formData.prep_time ? parseInt(formData.prep_time, 10) : null,
          cook_time: formData.cook_time ? parseInt(formData.cook_time, 10) : null,
          servings: formData.servings ? parseInt(formData.servings, 10) : null,
          difficulty_level: formData.difficulty_level,
          country_id: formData.country_id || null,
          country_name: null,
          flag_emoji: null,
          quote_text: formData.quote_text || null,
          quote_highlight: formData.quote_highlight || null,
        });

        // ✅ Load empty details (no ingredients/instructions yet)
        await loadRecipeDetails(recipeId);
        
        // ✅ Keep the form open so user can add details
        setSuccess("Recipe created! Now add ingredients, instructions, and benefits.");
        
        // ✅ Don't close the form, don't clear formData
        // setShowForm(false); // ← Remove this
        
        await fetchData();
      }

      // ✅ Only clear image-related states
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // ✅ Don't reset form when creating new recipe (only when updating)
      if (editingRecipe) {
        setImagePreview("");
      }

    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (recipe: Recipe) => {
    setSuccess("");
    setError("");

    setEditingRecipe(recipe);
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

      // ✅ NEW
      quote_text: recipe.quote_text || "",
      quote_highlight: recipe.quote_highlight || "",
    });

    setImageFile(null);
    setImagePreview(recipe.image_url || "");
    if (fileInputRef.current) fileInputRef.current.value = "";

    setShowForm(true);
    setSelectedRecipe(recipe.id);
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

  const handleAddIngredient = async () => {
    if (!selectedRecipe || !newIngredient.name.trim()) return;

    try {
      const { error } = await addIngredient({
        recipe_id: selectedRecipe,
        name: newIngredient.name.trim(),
        quantity: newIngredient.quantity || undefined,
        order_index: ingredients.length,
      });
      if (error) throw error;

      setNewIngredient({ name: "", quantity: "" });
      await loadRecipeDetails(selectedRecipe);
      setSuccess("Ingredient added!");
    } catch (err: any) {
      setError(err?.message || "Failed to add ingredient");
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!selectedRecipe) return;

    try {
      const { error } = await deleteIngredient(id);
      if (error) throw error;

      await loadRecipeDetails(selectedRecipe);
      setSuccess("Ingredient deleted!");
    } catch (err: any) {
      setError(err?.message || "Failed to delete ingredient");
    }
  };

  const handleAddInstruction = async () => {
    if (!selectedRecipe || !newInstruction.trim()) return;

    try {
      const { error } = await addInstruction({
        recipe_id: selectedRecipe,
        step_number: instructions.length + 1,
        instruction_text: newInstruction.trim(),
      });
      if (error) throw error;

      setNewInstruction("");
      await loadRecipeDetails(selectedRecipe);
      setSuccess("Instruction added!");
    } catch (err: any) {
      setError(err?.message || "Failed to add instruction");
    }
  };

  const handleDeleteInstruction = async (id: string) => {
    if (!selectedRecipe) return;

    try {
      const { error } = await deleteInstruction(id);
      if (error) throw error;

      await loadRecipeDetails(selectedRecipe);
      setSuccess("Instruction deleted!");
    } catch (err: any) {
      setError(err?.message || "Failed to delete instruction");
    }
  };

  // ✅ Benefits handlers
  const handleAddBenefit = async () => {
    if (!selectedRecipe) return;
    if (!newBenefit.ingredient_name.trim() || !newBenefit.benefit_text.trim()) return;

    try {
      const { error } = await addNutritionBenefit({
        recipe_id: selectedRecipe,
        ingredient_name: newBenefit.ingredient_name.trim(),
        benefit_text: newBenefit.benefit_text.trim(),
        order_index: benefits.length,
      });

      if (error) throw error;

      setNewBenefit({ ingredient_name: "", benefit_text: "" });
      await loadRecipeDetails(selectedRecipe);
      setSuccess("Benefit added!");
    } catch (err: any) {
      setError(err?.message || "Failed to add benefit");
    }
  };

  const handleDeleteBenefit = async (id: string) => {
    if (!selectedRecipe) return;

    try {
      const { error } = await deleteNutritionBenefit(id);
      if (error) throw error;

      await loadRecipeDetails(selectedRecipe);
      setSuccess("Benefit deleted!");
    } catch (err: any) {
      setError(err?.message || "Failed to delete benefit");
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

      // ✅ NEW
      quote_text: "",
      quote_highlight: "",
    });

    setImageFile(null);
    setImagePreview("");
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
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className="bg-[#6B4423] text-white px-4 py-2 rounded hover:bg-[#8B5A2B] transition-colors"
        >
          {showForm ? "✕ Cancel" : "+ Add Recipe"}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-[#6B4423] mb-4">
            {editingRecipe ? "Edit Recipe" : "Add New Recipe"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name/local */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#6B4423] mb-1">Recipe Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#6B4423] mb-1">Local Name</label>
                <input
                  type="text"
                  value={formData.name_local}
                  onChange={(e) => setFormData({ ...formData, name_local: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
                />
              </div>
            </div>

            {/* country */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4423] mb-1">Country</label>
              <select
                value={formData.country_id}
                onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.flag_emoji} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* servings */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4423] mb-1">Servings</label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
                min="1"
              />
            </div>

            {/* description/history */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4423] mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6B4423] mb-1">History</label>
              <textarea
                value={formData.history}
                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
              />
            </div>

            {/* image url */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4423] mb-1">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
              />
            </div>

            {/* file upload */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4423] mb-1">
                Recipe Image Upload
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setImageFile(f);
                  if (!f) return;
                  setImagePreview("");
                }}
                className="w-full px-4 py-2 border-2 border-[#D4A439] rounded"
              />

              {(imagePreview || formData.image_url) && (
                <div className="mt-3">
                  <p className="text-sm text-[#6B4423] font-semibold mb-2">Preview</p>
                  <img
                    src={imagePreview || formData.image_url}
                    alt="preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Details sections */}
            {(selectedRecipe || showForm) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Ingredients */}
                  <div>
                    <h4 className="text-lg font-bold text-[#6B4423] mb-3">Ingredients</h4>
                    <div className="space-y-2 mb-3">
                      {ingredients.map((ing) => (
                        <div key={ing.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">
                            {ing.name} {ing.quantity ? `- ${ing.quantity}` : ""}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteIngredient(ing.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                        placeholder="Ingredient name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={newIngredient.quantity}
                        onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                        placeholder="Quantity"
                        className="w-24 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="bg-[#6B4423] text-white px-3 py-2 rounded text-sm hover:bg-[#8B5A2B]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="text-lg font-bold text-[#6B4423] mb-3">Instructions</h4>
                    <div className="space-y-2 mb-3">
                      {instructions.map((inst) => (
                        <div key={inst.id} className="flex items-start justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm flex-1">
                            <strong>Step {inst.step_number}:</strong> {inst.instruction_text}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteInstruction(inst.id)}
                            className="text-red-600 hover:text-red-800 text-sm ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <textarea
                        value={newInstruction}
                        onChange={(e) => setNewInstruction(e.target.value)}
                        placeholder="Instruction text"
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddInstruction}
                        className="bg-[#6B4423] text-white px-3 py-2 rounded text-sm hover:bg-[#8B5A2B] self-start"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Benefits ✅ */}
                  <div>
                    <h4 className="text-lg font-bold text-[#6B4423] mb-3">Benefits</h4>

                    <div className="space-y-2 mb-3">
                      {benefits.map((b) => (
                        <div key={b.id} className="flex items-start justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm flex-1">
                            <strong>{b.ingredient_name || "Ingredient"}:</strong> {b.benefit_text}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteBenefit(b.id)}
                            className="text-red-600 hover:text-red-800 text-sm ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={newBenefit.ingredient_name}
                        onChange={(e) => setNewBenefit({ ...newBenefit, ingredient_name: e.target.value })}
                        placeholder="Ingredient name (e.g., Cocoa)"
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <textarea
                        value={newBenefit.benefit_text}
                        onChange={(e) => setNewBenefit({ ...newBenefit, benefit_text: e.target.value })}
                        placeholder="Benefit text"
                        rows={2}
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddBenefit}
                        className="bg-[#6B4423] text-white px-3 py-2 rounded text-sm hover:bg-[#8B5A2B] self-end"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Tip: Ingredients, instructions, and benefits are saved per recipe.
                </p>
              </div>
            )}

            {/* ✅ Quote */}
<div>
  <label className="block text-sm font-semibold text-[#6B4423] mb-1">
    Quote Text
  </label>
  <textarea
    value={formData.quote_text}
    onChange={(e) => setFormData({ ...formData, quote_text: e.target.value })}
    rows={3}
    className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
    placeholder='Example: "Some problems need answers. Others need"'
  />
</div>

<div>
  <label className="block text-sm font-semibold text-[#6B4423] mb-1">
    Quote Highlight (optional)
  </label>
  <input
    type="text"
    value={formData.quote_highlight}
    onChange={(e) => setFormData({ ...formData, quote_highlight: e.target.value })}
    className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
    placeholder="Example: MULUKHIYAH"
  />
  <p className="text-xs text-gray-500 mt-1">
    If empty, you can display the recipe name as the highlight.
  </p>
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

      {/* Recipes List */}
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

              {!!recipe.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
              )}

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
          <p className="text-gray-400 text-sm mt-2">Click "Add Recipe" to get started!</p>
        </div>
      )}
    </div>
  );
}
