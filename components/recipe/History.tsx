import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRecipeFull } from "@/lib/supabase/recipes";
import Loader from "../layout/Loader";

export default function History() {
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

  if (loading) return <Loader />;
  if (data?.error) return <div className="p-10">Error: {String(data.error.message)}</div>;

  const recipe = data.recipe;

  return (
    <div className="page-bg p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Main card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Image section with gradient overlay */}
          <div className="relative w-full h-[320px] md:h-[420px]">
            {recipe?.image_url ? (
              <>
                <Image
                  src={recipe.image_url}
                  alt={recipe?.name || "Recipe"}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                
                {/* Recipe name overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h1 className="title text-white text-3xl md:text-5xl leading-tight tracking-wide drop-shadow-lg">
                    {recipe?.name?.toUpperCase() || "RECIPE"}
                  </h1>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#D4A574] to-[#8B5A2B] flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
              </div>
            )}
          </div>

          {/* History content section */}
          <div className="p-6 md:p-10 bg-card/10">
            
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#D4A574]">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl md:text-3xl">📜</span>
              </div>
              <h2 className="title text-xl md:text-2xl font-bold uppercase tracking-wider">
                The Story Behind
              </h2>
            </div>

            {/* History text */}
            <div className="bg-card backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-inner">
              <p className="text-whiteSoft leading-relaxed md:text-lg font-medium whitespace-pre-wrap">
                {recipe?.history || "No history has been added yet for this recipe. Every dish has a story to tell..."}
              </p>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-[#6B4423] rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-[#6B4423] rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-[#6B4423] rounded-full opacity-60"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}