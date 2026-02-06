import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Loader from "@/components/layout/Loader";
import Intro from "@/components/recipe/Intro";

type HomeRecipe = {
  id: string;
  name: string;
  name_local: string | null;
  description: string | null;
  image_url: string | null;
  flag_url: string | null;
  country_name: string | null;
  quote_text: string | null;
  quote_highlight: string | null;
};

export default function Home() {
  const [recipe, setRecipe] = useState<HomeRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isFav, setIsFav] = useState(false);

  // check if recipe is already saved
  useEffect(() => {
    if (!recipe?.id) return;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsFav(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("recipe_id", recipe.id)
        .maybeSingle();

      if (!error && data) setIsFav(true);
      else setIsFav(false);
    })();
  }, [recipe?.id]);

  

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch("/api/home-recipe");
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to load recipe");
        }

        const data = (await res.json()) as HomeRecipe;
        setRecipe(data);
      } catch (e: any) {
        setErr(e?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (!recipe) return <p className="p-6">No recipe found.</p>;

  return (
    <div className="page-bg">
      <Header />

      <main className="px-6 lg:px-16 pt-10 pb-16">
        {/* Search row */}
        <div className="w-full max-w-[720px]">
          <div className="relative">
            <div className="w-full rounded-full border-[3px] border-line bg-transparent px-8 py-4 pr-16">
              <h1 className="title text-[32px] md:text-[36px]">
                TODAY&apos;S RECIPE:
              </h1>
            </div>

            <button
              type="button"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-card"
              aria-label="Search"
            >
              <FiSearch className="w-10 h-10" />
            </button>
          </div>
        </div>

        {/* Content row */}
        <Intro />

        {/* Quote card under TODAY'S RECIPE */}
        <div className="mt-15 max-w-[910px] min-h-screen">
          <div
            className="relative rounded-[28px] bg-cover bg-center px-10 py-14 min-h-screen"
            style={{ backgroundImage: "url('/images/quote-bg.png')" }}
          >
            {/* Quote text */}
            <h1 className="title text-[44px] sm:text-[70px] md:text-[90px] leading-tight text-start max-w-[520px] mx-auto whitespace-pre-line">
              {recipe.quote_text || "A recipe worth slowing down for."}
            </h1>

            {/* Highlight pill */}
            <div className="mt-6 flex justify-center">
              <div className="bg-black px-8 py-3 rounded-md">
                <span className="title text-[#F0C84B] text-[30px] sm:text-[50px] md:text-[70px] tracking-wide">
                  {(
                    recipe.quote_highlight ||
                    recipe.name 
                  ).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
