import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRecipeFull } from "@/lib/supabase/recipes";
import Loader from "../layout/Loader";
import { FiSearch } from "react-icons/fi";

export default function Ingredients() {
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

  if (loading) return <Loader /> ;
  if (data?.error) return <div className="p-10">Error: {String(data.error.message)}</div>;

  const recipe = data.recipe;

  return (
    <div className="page-bg p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with icon and title */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center shadow-md">
            <span className="text-2xl text-whiteSoft">☰</span>
          </div>
          
          <div className="flex-1 border-4 border-line rounded-full px-8 py-3 relative">
            <h1 
              className="title text-[28px] md:text-[36px] tracking-wide"
            >
              {`YOU'LL NEED:`}
            </h1>
            
            {/* Search icon on the right */}
            <button
              type="button"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-card"
              aria-label="Search"
            >
              <FiSearch className="w-10 h-10" />
            </button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left side – Ingredients image or fallback */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full h-full max-w-md aspect-square rounded-[32px] bg-whiteSoft shadow-lg overflow-hidden">

            {recipe?.ingredients_image_url ? (
              <Image
                src={recipe.ingredients_image_url}
                alt="Ingredients"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src="/images/recipe/ingredients-illustration.png"
                alt="Ingredients illustration"
                fill
                className="object-contain p-8 opacity-80"
              />
            )}

          </div>
        </div>

          {/* Right side - Ingredients list */}
          <div className="bg-card rounded-[24px] p-8 md:p-10 border-3 border-line shadow-lg min-h-[400px]">
            <ul className="space-y-3 text-white text-[16px] md:text-[18px]">
              {data.ingredients && data.ingredients.length > 0 ? (
                data.ingredients.map((ing: any) => (
                  <li key={ing.id} className="flex items-start gap-3">
                    <span className="text-white text-2xl leading-none mt-1">•</span>
                    <span>
                      {ing.name}
                      {ing.quantity && (
                        <span className="font-normal text-white/90">
                          {" "}({ing.quantity})
                        </span>
                      )}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-white/80">No ingredients added yet.</li>
              )}
            </ul>
          </div>

        </div>
        
      </div>
    </div>
  );
}
