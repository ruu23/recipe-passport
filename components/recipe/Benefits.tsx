import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getRecipeFull } from "@/lib/supabase/recipes";
import Loader from "@/components/layout/Loader";

type BenefitRow = {
  id: string;
  recipe_id?: string | null;
  ingredient_name: string | null;
  benefit_text: string | null;
  order_index: number | null;
};

export default function Benefits() {
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

  // Group benefits by ingredient
  const groups = useMemo(() => {
    const map = new Map<string, BenefitRow[]>();
    const list: BenefitRow[] = (data?.benefits ?? []) as BenefitRow[];

    for (const row of list) {
      const key = (row.ingredient_name ?? "Ingredient").toString().trim() || "Ingredient";
      const arr = map.get(key) ?? [];
      arr.push(row);
      map.set(key, arr);
    }

    return map;
  }, [data]);

  const ingredients = Array.from(groups.keys());

  if (loading) return <Loader />;
  if (data?.error) return <div className="p-10">Error: {String(data.error.message)}</div>;


  return (
    <div className="page-bg px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Title with vitamin bottle */}
        <div className="flex items-start justify-between gap-6 mb-12">
          <h1 
            className="title tracking-wider text-[56px] md:text-[72px] leading-[0.9]"
          >
            NUTRITION & BENEFITS
          </h1>

          {/* Vitamin bottle illustration */}
          <div className="relative w-[140px] h-[140px] shrink-0 hidden md:block">
            <Image
              src="/images/vitamin.png"
              alt="vitamin"
              fill
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Check if there are benefits */}
        {ingredients.length === 0 ? (
          <p className="text-[#8B5A2B] font-semibold text-lg">
            No nutrition benefits added yet for this recipe.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Loop through each ingredient */}
            {ingredients.map((ingredientName) => {
              const benefitsList = groups.get(ingredientName) ?? [];
              
              return (
                <div key={ingredientName} className="flex flex-col gap-3">
                  {/* Ingredient name button/pill */}
                  <div className="border-3 border-line rounded-full px-6 py-3 text-center shadow-sm">
                    <h3 
                      className="subtitle uppercase tracking-wider text-[16px] md:text-[18px]"
                    >
                      {ingredientName}
                    </h3>
                  </div>

                  {/* Benefits cards for this ingredient */}
                  <div className="flex flex-col gap-3">
                    {benefitsList.map((benefit) => (
                      <div
                        key={benefit.id}
                        className="bg-card rounded-[20px] p-5 border-3 border-line shadow-md min-h-[140px] flex items-center justify-center"
                      >
                        <p className="text-whiteSoft font-bold text-[15px] md:text-[17px] leading-relaxed text-center">
                          {benefit.benefit_text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}