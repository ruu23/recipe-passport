import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getRecipeFull } from "@/lib/supabase/recipes";

type BenefitRow = {
  id: string;
  recipe_id?: string | null;
  ingredient_name: string | null;
  benefit_text: string | null;
  order_index: number | null;
};

export default function BenefitsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    (async () => {
      setLoading(true);
      const res = await getRecipeFull(id);
      setData(res);

      const first =
        (res?.benefits?.[0]?.ingredient_name ?? "").toString().trim() || "";
      setActive(first);

      setLoading(false);
    })();
  }, [id]);

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

  const tabs = Array.from(groups.keys());

  useEffect(() => {
    if (!active && tabs.length > 0) setActive(tabs[0]);
  }, [active, tabs]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (data?.error) return <div className="p-10">Error: {String(data.error.message)}</div>;

  const recipe = data.recipe;
  const activeList = groups.get(active) ?? [];

  return (
    <div className="min-h-screen bg-[#FBF6EA] px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[#5A2F1B] font-extrabold tracking-wide text-5xl md:text-6xl">
              NUTRITION &amp; BENEFITS
            </h1>
            <p className="mt-2 text-[#5A2F1B]/70 font-semibold">
              {recipe?.name} {recipe?.name_local ? `— ${recipe.name_local}` : ""}
            </p>
          </div>

          {/* optional icon */}
          <div className="relative w-[120px] h-[120px] opacity-90 hidden sm:block">
            <Image
              src="/images/vitamin.png"
              alt="vitamin"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap gap-4">
          {tabs.length === 0 ? (
            <p className="text-[#5A2F1B] font-semibold">
              No nutrition benefits added yet for this recipe.
            </p>
          ) : (
            tabs.map((name) => {
              const isActive = name === active;
              return (
                <button
                  key={name}
                  onClick={() => setActive(name)}
                  className={[
                    "px-6 py-3 rounded-full font-extrabold uppercase tracking-wide",
                    "border-2 border-[#6E7A3D] text-[#5A2F1B]",
                    isActive ? "bg-[#FFF6D9]" : "bg-[#FBF6EA] hover:bg-[#FFF6D9]",
                  ].join(" ")}
                >
                  {name}
                </button>
              );
            })
          )}
        </div>

        {/* Cards */}
        {tabs.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeList.slice(0, 4).map((row) => (
              <div
                key={row.id}
                className="bg-[#F0C84B] rounded-2xl p-6 border-2 border-[#5A2F1B]/30 min-h-[140px]"
              >
                <p className="text-white font-semibold leading-relaxed">
                  {row.benefit_text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Nav */}
        <div className="flex justify-between mt-12">
          <button
            onClick={() => router.push(`/recipes/${id}/instructions`)}
            className="px-5 py-3 rounded-full bg-white border border-[#5A2F1B]/30 text-[#5A2F1B] font-bold"
          >
            ← Prev
          </button>

          <button
            onClick={() => router.push(`/recipe/${id}`)}
            className="px-5 py-3 rounded-full bg-[#7A3B20] text-white font-bold"
          >
            Back to Recipe →
          </button>
        </div>
      </div>
    </div>
  );
}
