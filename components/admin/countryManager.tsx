import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { getCountries, addCountry, updateCountry, deleteCountry } from "@/lib/supabase/admin";

interface Country {
  id: string;
  name: string;
  flag_url?: string | null;
  description?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}

// ✅ normalize nulls to match our type safely
function normalizeCountries(rows: any[]): Country[] {
  return (rows || [])
    .filter((c) => c && c.id && c.name)
    .map((c) => ({
      id: String(c.id),
      name: String(c.name ?? ""),
      flag_url: c.flag_url ?? null,
      description: c.description ?? null,
      image_url: c.image_url ?? null,
      created_at: c.created_at ?? null,
    }));
}

export default function CountryManager() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    flag_url: "",
    description: "",
    image_url: "",
  });

  const [flagFile, setFlagFile] = useState<File | null>(null);
  const [flagUploading, setFlagUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await getCountries();

    if (error) {
      setError("Failed to load countries");
      console.error(error);
    } else {
      setCountries(normalizeCountries(data || []));
    }

    setLoading(false);
  };

  const uploadFlag = async (countryName: string, file: File) => {
    setFlagUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const safeName = countryName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const path = `flags/${safeName}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("country-flags")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("country-flags").getPublicUrl(path);
      return data.publicUrl;
    } finally {
      setFlagUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const name = formData.name.trim();
      if (!name) {
        setError("Country name is required.");
        return;
      }

      // ✅ upload flag if file selected
      let flagUrl = formData.flag_url.trim() || undefined;
      if (flagFile) {
        flagUrl = await uploadFlag(name, flagFile);
      }

      // ✅ send undefined instead of empty strings
      const payload = {
        name,
        flag_url: flagUrl,
        description: formData.description.trim() || undefined,
        image_url: formData.image_url.trim() || undefined,
      };

      if (editingCountry) {
        const { error } = await updateCountry(editingCountry.id, payload);
        if (error) throw error;
        setSuccess("Country updated successfully!");
      } else {
        const { error } = await addCountry(payload);
        if (error) throw error;
        setSuccess("Country added successfully!");
      }

      setFormData({ name: "", flag_url: "", description: "", image_url: "" });
      setFlagFile(null);
      setEditingCountry(null);
      setShowForm(false);
      fetchCountries();
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    }
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormData({
      name: country.name || "",
      flag_url: country.flag_url || "",
      description: country.description || "",
      image_url: country.image_url || "",
    });
    setFlagFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This will also delete all recipes from this country.`
      )
    ) {
      return;
    }

    try {
      const { error } = await deleteCountry(id);
      if (error) throw error;
      setSuccess("Country deleted successfully!");
      fetchCountries();
    } catch (err: any) {
      setError(err?.message || "Failed to delete country");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCountry(null);
    setFormData({ name: "", flag_url: "", description: "", image_url: "" });
    setFlagFile(null);
    setError("");
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-[#E8B44F] border-t-[#6B4423] rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-[#6B4423]">Loading countries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#6B4423]">
          Countries ({countries.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#6B4423] text-white px-4 py-2 rounded hover:bg-[#8B5A2B] transition-colors"
        >
          {showForm ? "✕ Cancel" : "+ Add Country"}
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
            {editingCountry ? "Edit Country" : "Add New Country"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-[#6B4423] mb-1">
                  Country Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
                  placeholder="e.g., Egypt"
                />
              </div>

              {/* Flag Upload */}
              <div>
                <label className="block text-sm font-semibold text-[#6B4423] mb-1">
                  Flag Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFlagFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
                />

                {/* Preview (existing or uploaded) */}
                {(flagFile || formData.flag_url) && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={
                        flagFile
                          ? URL.createObjectURL(flagFile)
                          : (formData.flag_url as string)
                      }
                      alt="Flag preview"
                      className="h-10 w-16 object-cover rounded border"
                    />
                    <span className="text-xs text-gray-500">
                      {flagFile ? flagFile.name : "Current flag"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4423] mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
                placeholder="Brief description of the country's cuisine..."
              />
            </div>

            {/* Image URL (optional, keep as you had) */}
            <div>
              <label className="block text-sm font-semibold text-[#6B4423] mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423]"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={flagUploading}
                className="bg-[#6B4423] text-white px-6 py-2 rounded hover:bg-[#8B5A2B] transition-colors disabled:opacity-60"
              >
                {flagUploading
                  ? "Uploading..."
                  : editingCountry
                  ? "Update Country"
                  : "Add Country"}
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

      {/* Countries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => (
          <div
            key={country.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {!!country.flag_url && (
                  <img
                    src={country.flag_url}
                    alt={`${country.name} flag`}
                    className="h-10 w-16 object-cover rounded border"
                  />
                )}
                <h3 className="text-lg font-bold text-[#6B4423]">
                  {country.name}
                </h3>
              </div>
            </div>

            {!!country.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {country.description}
              </p>
            )}

            {!!country.image_url && (
              <img
                src={country.image_url}
                alt={country.name}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(country)}
                className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(country.id, country.name)}
                className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {countries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No countries added yet.</p>
          <p className="text-gray-400 text-sm mt-2">
            Click {`"Add Country"`} to get started!
          </p>
        </div>
      )}
    </div>
  );
}
