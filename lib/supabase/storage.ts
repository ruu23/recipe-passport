import { supabase } from "@/lib/supabase/client";

export async function uploadRecipeImage(file: File, recipeId: string) {
  const ext = file.name.split(".").pop() ?? "png";
  const fileName = `${Date.now()}.${ext}`;
  const path = `recipes/${recipeId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("recipe-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { url: null, error: uploadError };
  }

  const { data } = supabase.storage
    .from("recipe-images")
    .getPublicUrl(path);

  return { url: data.publicUrl, error: null };
}
