import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRecipeFull } from "@/lib/supabase/recipes";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function RecipeHistoryPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    (async () => {
      setLoading(true);
      const res = await getRecipeFull(id);
      setData(res);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (data?.error) return <div className="p-10">Error: {String(data.error.message)}</div>;

  const recipe = data.recipe;

  return (
    <div className="min-h-screen bg-[#FBF6EA] p-8">
      <Header />

      <div className="max-w-5xl mx-auto">
        {/* Top image */}
        <div className="relative w-full h-[340px] md:h-[420px] rounded-3xl overflow-hidden">
          {recipe?.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe?.name || "Recipe"}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-black/10" />
          )}
        </div>

        {/* History card */}
        <div className="mt-6 bg-[#F0C84B] rounded-3xl p-8 border-2 border-[#5A2F1B]/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center">
              <span className="text-xl">📜</span>
            </div>

            <div className="flex-1">
              <h1 className="text-white font-extrabold text-3xl md:text-4xl tracking-wide">
                HISTORY OF {recipe?.name?.toUpperCase()}
              </h1>

              <p className="mt-4 text-white/95 leading-relaxed text-sm md:text-base">
                {recipe?.history || "No history added yet for this recipe."}
              </p>
            </div>

            {/* Next circle button */}
            <button
              onClick={() => router.push(`/recipe/${id}/ingredients`)}
              className="shrink-0 w-12 h-12 rounded-full bg-white/80 hover:bg-white transition flex items-center justify-center"
              aria-label="Next"
            >
              <span className="text-xl">›</span>
            </button>
          </div>
        </div>

        {/* Bottom navigation (optional) */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push("/home")}
            className="px-5 py-3 rounded-full bg-white border border-[#5A2F1B]/30 text-[#5A2F1B] font-bold"
          >
            ← Back to Home
          </button>

          <button
            onClick={() => router.push(`/recipe/${id}/ingredients`)}
            className="px-5 py-3 rounded-full bg-[#7A3B20] text-white font-bold"
          >
            Ingredients →
          </button>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
