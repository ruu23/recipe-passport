import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 1️⃣ Get all recipes (only what you need)
    const { data: recipes, error } = await supabase
      .from("recipes_with_countries")
      .select('*');

    if (error) throw error;
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found" });
    }

    // 2️⃣ Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // 3️⃣ Create a stable number from the date
    const seed = today
      .split("-")
      .join("")
      .split("")
      .reduce((sum, n) => sum + Number(n), 0);

    // 4️⃣ Pick recipe based on seed
    const index = seed % recipes.length;
    const todayRecipe = recipes[index];

    return res.status(200).json(todayRecipe);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}
