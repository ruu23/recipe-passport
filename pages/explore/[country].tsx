import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Loader from "@/components/layout/Loader";

type Country = {
  id: string;
  name: string;
  flag_emoji?: string | null;
  image_url?: string | null;
};

type Recipe = {
  id: string;
  name: string;
  name_local?: string | null;
  image_url?: string | null;
  country_id?: string | null;
};

export default function CountryPage() {
  const router = useRouter();
  const countryId = router.query.country;

  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<Country | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>("");

  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favLoadingId, setFavLoadingId] = useState<string | null>(null);

  // 0) load auth user
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    })();
  }, []);

  // 1) load country + recipes
  useEffect(() => {
    if (!countryId || typeof countryId !== "string") return;

    (async () => {
      setLoading(true);
      setError("");

      const countryRes = await supabase
        .from("countries")
        .select("id,name,flag_emoji,image_url")
        .eq("id", countryId)
        .single();

      const recipesRes = await supabase
        .from("recipes")
        .select("id,name,name_local,image_url,country_id")
        .eq("country_id", countryId)
        .order("created_at", { ascending: false });

      if (countryRes.error) setError(countryRes.error.message);
      if (recipesRes.error) setError(recipesRes.error.message);

      setCountry((countryRes.data as Country) ?? null);
      setRecipes((recipesRes.data as Recipe[]) ?? []);

      setLoading(false);
    })();
  }, [countryId]);

  // 2) load favorites for recipes shown here (once we have userId + recipes)
  useEffect(() => {
    if (!userId) return;
    if (recipes.length === 0) {
      setFavorites(new Set());
      return;
    }

    (async () => {
      const recipeIds = recipes.map((r) => r.id);

      const { data, error } = await supabase
        .from("user_favorites")
        .select("recipe_id")
        .eq("user_id", userId)
        .in("recipe_id", recipeIds);

      if (error) {
        console.error(error);
        return;
      }

      const setIds = new Set<string>((data ?? []).map((x: any) => String(x.recipe_id)));
          setFavorites(setIds);
        })();
      }, [userId, recipes]);

      const toggleFavorite = async (e: React.MouseEvent, recipeId: string) => {
        e.preventDefault(); // stop Link navigation
        e.stopPropagation();

        if (!userId) {
          alert("Please login to save favorites.");
          return;
        }

        const isFav = favorites.has(recipeId);

        try {
          setFavLoadingId(recipeId);

          if (isFav) {
            const { error } = await supabase
              .from("user_favorites")
              .delete()
              .eq("user_id", userId)
              .eq("recipe_id", recipeId);

            if (error) throw error;

            setFavorites((prev) => {
              const next = new Set(prev);
              next.delete(recipeId);
              return next;
            });
          } else {
            const { error } = await supabase.from("user_favorites").insert({
              user_id: userId,
              recipe_id: recipeId,
            });

            if (error) throw error;

            setFavorites((prev) => {
              const next = new Set(prev);
              next.add(recipeId);
              return next;
            });
          }
        } catch (err: any) {
          console.error(err);
          alert(err?.message || "Failed to update favorite");
        } finally {
          setFavLoadingId(null);
        }
      };

      const title = useMemo(() => {
        if (!country) return "Country";
        return country.name.toUpperCase();
      }, [country]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-6xl mx-auto px-6 lg:px-16 pt-10 pb-16 text-red-600 font-semibold">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <main className="max-w-6xl mx-auto px-6 lg:px-16 pt-10 pb-16">
        <div className="flex items-center justify-between">
          <Link
            href="/explore"
            className="rounded-full bg-white/70 border border-cocoa/10 px-5 py-3 text-cocoa font-bold hover:bg-white transition"
          >
            ← Back
          </Link>

          <div className="text-right">
            <div className="text-cocoa/70 font-semibold">
              {country?.flag_emoji ?? "🌍"}
            </div>
          </div>
        </div>

        <h1 className="mt-8 font-[MilkTea] text-cocoa text-[64px] md:text-[80px] leading-none">
          {title}
        </h1>

        <section className="mt-10">
          {recipes.length === 0 ? (
            <div className="bg-white/60 rounded-3xl p-8 border border-cocoa/10 text-cocoa font-semibold">
              No recipes for this country yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((r) => {
                const isFav = favorites.has(r.id);
                const favLoading = favLoadingId === r.id;

                return (
                  <Link key={r.id} href={`/recipe/${r.id}`} className="group block">
                    <div className="rounded-[26px] overflow-hidden bg-white/70 border border-cocoa/10 shadow-sm hover:shadow-md transition relative">
                      {/* ❤️ Favorite */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(e, r.id)}
                        disabled={favLoading}
                        className="
                          absolute top-4 right-4 z-10
                          w-10 h-10
                          rounded-full
                          bg-[#FBF6EA]/90
                          flex items-center justify-center
                          shadow-md
                          hover:scale-110
                          transition
                          disabled:opacity-60 disabled:hover:scale-100
                        "
                        aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
                        title={isFav ? "Saved" : "Save"}
                      >
                        {isFav ? (
                          <AiFillHeart className="text-red-500 text-2xl" />
                        ) : (
                          <AiOutlineHeart className="text-[#6B4423] text-2xl" />
                        )}
                      </button>

                      {/* Image */}
                      <div className="relative w-full h-[180px]">
                        <Image
                          src={r.image_url || "/images/placeholder-recipe.jpg"}
                          alt={r.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Yellow pill */}
                      <div className="p-4 flex justify-center">
                        <div className="bg-[#F0C84B] px-6 py-3 rounded-full border-2 border-[#5A2F1B]/20">
                          <span className="font-[MilkTea] text-whiteSoft text-[20px] tracking-wide">
                            {(r.name_local || r.name).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
