import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase/client";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Loader from "@/components/layout/Loader";

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
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

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

  const toggleFavorite = async () => {
    if (!recipe?.id) return;

    setFavLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // if not logged in -> send to login (or show message)
      if (!user) {
        router.push("/login"); // change if your login route is different
        return;
      }

      // optimistic UI
      const next = !isFav;
      setIsFav(next);

      if (next) {
        const { error } = await supabase
          .from("user_favorites")
          .insert([{ user_id: user.id, recipe_id: recipe.id }]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("recipe_id", recipe.id);

        if (error) throw error;
      }
    } catch (e) {
      // rollback if failed
      setIsFav((v) => !v);
      console.error(e);
    } finally {
      setFavLoading(false);
    }
  };

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
        <section className="relative mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left recipe card */}
          <div className="relative bg-card rounded-[38px] p-8 md:p-10 min-h-[520px] md:min-h-[560px] overflow-hidden">
            {/* Flag (fallback to emoji) */}
            <div className="absolute left-6 top-6">
              {recipe.flag_url ? (
                <img
                  src={recipe.flag_url}
                  alt={`${recipe.country_name ?? "Country"} flag`}
                  className="w-[70px] h-[45px] rounded-md object-cover"
                />
              ) : (
                <Image
                  src="/images/egypt-flag.png"
                  alt="Country flag"
                  width={70}
                  height={45}
                  className="rounded-md"
                />
              )}
            </div>

            <button
              type="button"
              onClick={toggleFavorite}
              disabled={favLoading}
              className="
                absolute top-4 right-4
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
            >
              {isFav ? (
                <AiFillHeart className="text-red-500 text-2xl" />
              ) : (
                <AiOutlineHeart className="text-[#6B4423] text-2xl" />
              )}
            </button>

            {/* Title */}
            <div className="pt-20 md:pt-24 text-center">
              <h2 className="text-whiteSoft tracking-wide text-[64px] md:text-[78px] leading-none font-bold">
                {recipe.name_local || recipe.name}
              </h2>
              {recipe.country_name && (
                <p className="mt-2 text-whiteSoft/80">{recipe.country_name}</p>
              )}
            </div>

            {/* Description */}
            <p className="mt-10 font-[MilkTea] text-whiteSoft text-[22px] md:text-[28px] leading-relaxed max-w-[520px]">
              {recipe.description || "No description yet."}
            </p>

            {/* Bottom-left arrow */}
            <button
              type="button"
              onClick={() => router.push(`/recipe/${recipe.id}`)}
              className="left-8 bottom-8 w-[74px] h-[74px] rounded-full bg-cream flex items-center justify-center"
              aria-label="Go to recipe ingredients"
            >
              <MdOutlineNavigateNext className="w-10 h-10 text-card" />
            </button>
          </div>

          {/* Right image card */}
          <div className="relative rounded-[38px] overflow-hidden bg-[#00000010] ">
            {recipe.image_url ? (
              <Image
                src={recipe.image_url}
                alt="Recipe image"
                width={900}
                height={700}
                className="w-full h-full md:h-[560px] object-cover"
                priority
              />
            ) : (
              <Image
                src="/images/molokhia.jpg"
                alt="Recipe image"
                width={900}
                height={700}
                className="w-full h-[520px] md:h-[560px] object-cover"
                priority
              />
            )}
          </div>
        </section>

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
