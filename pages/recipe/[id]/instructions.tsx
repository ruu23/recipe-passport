import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRecipeFull } from "@/lib/supabase/recipes";

export default function InstructionsPage() {
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
  const steps = Array.isArray(data.instructions) ? data.instructions : [];

  return (
    <div className="min-h-screen bg-[#FBF6EA] px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Main grid like Canva */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT */}
          <div>
            <h1
              className="text-[#5A2F1B] font-extrabold leading-[0.95] tracking-wide
                         text-5xl md:text-6xl"
            >
              STEP BY STEP
              <br />
              INSTRUCTIONS
            </h1>

            {/* image card */}
            <div className="mt-8 w-full max-w-[360px] rounded-3xl overflow-hidden bg-white shadow-sm border border-[#5A2F1B]/10">
              <div className="relative w-full h-[220px]">
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
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-[#F0C84B] rounded-3xl p-6 md:p-8 border-2 border-[#5A2F1B]/30">
            {steps.length === 0 ? (
              <p className="text-[#2B1A12] font-semibold">
                No instructions added yet.
              </p>
            ) : (
              <ol className="space-y-3 text-white font-semibold leading-relaxed">
                {steps.map((s: any, idx: number) => (
                  <li key={s.id ?? idx} className="flex gap-3">
                    <span className="w-6 shrink-0 text-white">
                      {s.step_number ?? idx + 1}.
                    </span>
                    <span className="text-white/95">
                      {s.instruction_text}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Bottom nav buttons (optional like your ingredients page) */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => router.push(`/recipes/${id}/ingredients`)}
            className="px-5 py-3 rounded-full bg-white border border-[#5A2F1B]/30 text-[#5A2F1B] font-bold"
          >
            ← Prev
          </button>

          <button
            onClick={() => router.push(`/recipe/${id}/benefits`)}
            className="px-5 py-3 rounded-full bg-[#7A3B20] text-white font-bold"
          >
            NUTRITION &amp; BENEFITS
          </button>
        </div>
      </div>
    </div>
  );
}
