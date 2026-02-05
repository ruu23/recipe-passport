import Image from "next/image";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCountries } from "@/lib/supabase/admin"; // you already have this

type Country = {
  id: string;
  name: string;
  flag_emoji?: string | null;
  image_url?: string | null;
  description?: string | null;
};

export default function ExplorePage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await getCountries();
      if (error) {
        console.error(error);
        setCountries([]);
      } else {
        setCountries((data ?? []) as Country[]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(query));
  }, [countries, q]);

  return (
    <div className="min-h-screen bg-cream">
      <main className="px-6 lg:px-16 pt-10 pb-16">
        {/* ===== HERO (like Canva Page 8) ===== */}
        <div className="relative w-full max-w-6xl mx-auto rounded-[32px] overflow-hidden bg-[#FBF6EA]">
          <div className="relative w-full h-[260px] md:h-[320px]">
            {/* Put your hero image here */}
            <Image
              src="/images/explore-hero.png"
              alt="The countries of the world"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* ===== CONTENT (like Canva Page 9) ===== */}
        <section className="mt-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: countries list */}
            <div className="bg-[#FBF6EA] rounded-[28px] p-8 border-2 border-[#5A2F1B]/10 relative overflow-hidden">
              <h2 className="font-[MilkTea] text-cocoa text-[34px] md:text-[40px] leading-none">
                Countries
              </h2>

              {loading ? (
                <p className="mt-6 text-cocoa/70 font-semibold">
                  Loading countries...
                </p>
              ) : (
                <ul className="mt-6 space-y-3">
                  {filtered.map((c) => (
                    <li key={c.id} className="flex items-center gap-3">
                      <span className="text-cocoa text-lg">•</span>

                      {/* If you already have a country page route, change the href */}
                      <Link
                        href={`/explore/${c.id}`}
                        className="text-cocoa font-semibold hover:underline text-[18px]"
                      >
                        <span className="mr-2">{c.flag_emoji ?? "🌍"}</span>
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {!loading && filtered.length === 0 && (
                <p className="mt-6 text-cocoa/70 font-semibold">No results.</p>
              )}

              {/* small globe bottom-right (optional) */}
              <div className="absolute bottom-4 right-4 w-[70px] h-[70px] opacity-90">
                <Image
                  src="/images/globe.png"
                  alt="globe"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right: search box card */}
            <div className="bg-[#FBF6EA] rounded-[28px] p-8 border-2 border-[#5A2F1B]/10">
              <h3 className="font-[MilkTea] text-cocoa text-[28px] md:text-[32px]">
                Search
              </h3>

              <div className="mt-6">
                <div className="relative">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search country..."
                    className="
                      w-full rounded-2xl border-2 border-[#D4A439]
                      bg-transparent px-5 py-4 pr-12
                      text-cocoa font-semibold
                      focus:outline-none focus:border-[#6B4423]
                    "
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cocoa/70">
                    🔍
                  </span>
                </div>

                <p className="mt-4 text-sm text-cocoa/70">
                  Showing <b>{filtered.length}</b> of <b>{countries.length}</b>
                </p>

                {/* Optional: quick results preview */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.slice(0, 4).map((c) => (
                    <Link
                      key={c.id}
                      href={`/explore/${c.id}`}
                      className="rounded-2xl border border-[#5A2F1B]/10 bg-white/60 p-4 hover:bg-white transition"
                    >
                      <div className="text-cocoa font-bold">
                        {c.flag_emoji ?? "🌍"} {c.name}
                      </div>
                      {c.description && (
                        <div className="text-cocoa/70 text-sm mt-1 line-clamp-2">
                          {c.description}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
