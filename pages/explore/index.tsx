import Image from "next/image";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCountries } from "@/lib/supabase/admin";
import Footer from "@/components/layout/Footer";
import { FiSearch } from "react-icons/fi";
import Loader from "@/components/layout/Loader";

type Country = {
  id: string;
  name: string;
  flag_emoji?: string | null;
  flag_url?: string | null; // ✅ Add this
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
      <Header />
      <main className="px-6 lg:px-16 pt-10 pb-16">
        <div className="relative w-full max-w-6xl mx-auto rounded-[32px] overflow-hidden">
        {/* Hero Image */}
        <div className="relative w-full min-h-screen">
          <Image
            src="/images/exploreBG.png"
            alt="The countries of the world"
            fill
            priority
            className="object-cover object-center"
          />

          {/* ✅ Title overlay like Canva */}
          <div className="absolute inset-x-0 top-10 flex flex-col items-center text-center px-6">
            <h1 className="title text-[40px] md:text-[64px] leading-[0.95] text-cocoa drop-shadow-sm">
              A PASSPORT TO FLAVOR
            </h1>

            <p className="mt-4 max-w-[520px] text-cocoa font-[MilkTea] text-[14px] md:text-[18px] leading-tight tracking-wide">
              A journey through global kitchens
            </p>
          </div>
        </div>
      </div>


        {/* ===== CONTENT ===== */}
        <section className="mt-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: countries list */}
            <div className="bg- rounded-[28px] p-8 border-2 border-card relative overflow-hidden">
              <h1 className="title text-[34px] md:text-[40px] leading-none">
                Countries
              </h1>

              {loading ? (
                <Loader />
              ) : (
                <ul className="mt-6 space-y-3">
                  {filtered.map((c) => (
                    <li key={c.id} className="flex items-center gap-3">
                      <span className="text-cocoa text-lg">•</span>

                      {/* ✅ Flag image instead of emoji */}
                      {c.flag_url ? (
                        <img
                          src={c.flag_url}
                          alt={`${c.name} flag`}
                          className="w-8 h-6 object-cover rounded"
                        />
                      ) : (
                        <span className="text-2xl">{c.flag_emoji ?? "🌍"}</span>
                      )}

                      <Link
                        href={`/explore/${c.id}`}
                        className="text-cocoa font-semibold hover:underline text-[18px]"
                      >
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
            <div className="bg-whiteSoft rounded-[28px] p-8 border-2 border-card">
              <h3 className="title text-[28px] md:text-[32px]">
                Search
              </h3>

              <div className="mt-6">
                <div className="relative">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search country..."
                    className="
                      w-full rounded-2xl border-2 border-card
                      bg-transparent px-5 py-4 pr-12
                      text-cocoa font-semibold
                      focus:outline-none focus:border-2
                    "
                  />
                  <button
                    type="button"
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-card"
                    aria-label="Search"
                  >
                    <FiSearch className="w-10 h-10" />
                  </button>
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
                      <div className="flex items-center gap-2 text-cocoa font-bold">
                        {/* ✅ Flag image in preview cards */}
                        {c.flag_url ? (
                          <img
                            src={c.flag_url}
                            alt={`${c.name} flag`}
                            className="w-8 h-6 object-cover rounded"
                          />
                        ) : (
                          <span className="text-xl">{c.flag_emoji ?? "🌍"}</span>
                        )}
                        {c.name}
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

      <Footer />
    </div>
  );
}