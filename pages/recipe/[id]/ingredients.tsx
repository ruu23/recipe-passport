import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRecipeFull } from "@/lib/supabase/recipes";

export default function IngredientsPage() {
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#5A2F1B] mb-6">
          YOU’LL NEED: {recipe?.name}
        </h1>

        <div className="bg-[#F0C84B] rounded-2xl p-6 border-2 border-[#5A2F1B]/40">
          <ul className="list-disc pl-6 space-y-2 text-[#2B1A12] font-semibold">
            {data.ingredients.map((ing: any) => (
              <li key={ing.id}>
                {ing.name} {ing.quantity ? `— ${ing.quantity}` : ""}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push(`/recipe/${id}`)}
            className="px-5 py-3 rounded-full bg-white border border-[#5A2F1B]/30 text-[#5A2F1B] font-bold"
          >
            ← Prev
          </button>

          <button
            onClick={() => router.push(`/recipe/${id}/instructions`)}
            className="px-5 py-3 rounded-full bg-[#7A3B20] text-white font-bold"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
