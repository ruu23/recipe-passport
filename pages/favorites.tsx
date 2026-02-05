import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";
import { getUserFavorites } from "@/lib/supabase/favorites";
import { useRouter } from "next/router";

interface Recipe {
  id: string;
  name: string;
  image_url: string | null;
  country_name?: string | null;
  flag_emoji?: string | null;
}

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadFavorites = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const res = await getUserFavorites(user.id);
      if (!res.error && res.data) setRecipes(res.data);

      setLoading(false);
    };

    loadFavorites();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FBF6EA]">
      <main className="px-6 lg:px-16 py-12">
        <h1 className="text-[42px] font-bold text-[#6B4423] mb-10">
          YOUR FAVORITE PLATES ❤️
        </h1>

        {loading && <p className="text-[#6B4423]">Loading...</p>}

        {!loading && recipes.length === 0 && (
          <p className="text-[#6B4423] text-lg">
            You haven’t added any favorites yet 🍽️
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => router.push(`/recipes/${recipe.id}`)}
              className="group text-left"
            >
              <div className="relative w-full h-[220px] rounded-3xl overflow-hidden shadow-md">
                {recipe.image_url && (
                  <Image
                    src={recipe.image_url}
                    alt={recipe.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>

              <div className="mt-3 bg-[#F0C84B] rounded-full px-6 py-2 inline-block">
                <span className="font-bold text-[#6B4423]">{recipe.name}</span>
              </div>

              {recipe.country_name && (
                <p className="mt-1 text-sm text-[#6B4423]">
                  {recipe.flag_emoji} {recipe.country_name}
                </p>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
