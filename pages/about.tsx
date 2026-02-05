import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="px-6 lg:px-16 pt-10 pb-16">
        <section className="relative max-w-6xl mx-auto">
          {/* Circle photo (top-left) */}
          <div className="absolute -top-4 left-6 z-20">
            <div className="relative w-[150px] h-[150px] md:w-[180px] md:h-[180px] rounded-full overflow-hidden border-[8px] border-cream shadow-lg">
              <Image
                src="/images/me.jpg"
                alt="About me"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Big yellow card */}
          <div className="relative mt-16 md:mt-20 bg-[#F0C84B] rounded-[34px] border-4 border-[#8B5A2B] shadow-lg overflow-hidden">
            {/* Decorative brown shapes (top-right) */}
            <div className="absolute top-0 right-0 w-48 h-48 opacity-20">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="150" cy="50" r="80" fill="#8B5A2B" />
                <circle cx="180" cy="20" r="40" fill="#6B4423" />
              </svg>
            </div>

            {/* Tilted ABOUT ME sticker */}
            <div className="absolute top-8 right-12 md:right-16 z-20 transform rotate-[8deg]">
              <div className="bg-[#F0C84B] border-4 border-[#8B5A2B] rounded-2xl px-8 py-3 shadow-md">
                <h2 className="font-black text-[32px] md:text-[40px] tracking-wide text-[#8B5A2B]" style={{ fontFamily: 'Impact, sans-serif' }}>
                  ABOUT ME
                </h2>
              </div>
            </div>

            {/* Card content */}
            <div className="relative z-10 px-8 md:px-16 pt-24 md:pt-28 pb-16">
              <h1 className="text-[28px] md:text-[36px] text-center text-white font-bold mb-8 tracking-wider">
                Our Story
              </h1>

              <div className="max-w-4xl mx-auto text-white leading-relaxed text-[15px] md:text-[17px] font-medium space-y-4">
                <p>
                  Food has always been more than just a meal. {`It's`} memory,
                  culture, and a language shared across generations. This
                  platform was created from a simple belief: every recipe
                  carries a story worth telling.
                </p>

                <p>
                  We wanted a place where you can explore global cuisines—not
                  only through ingredients and instructions, but through the
                  traditions, histories, and emotions that shape them. A digital
                  notebook where flavor travels, and cultures meet at the same
                  table.
                </p>

                <p>
                  To create a welcoming space that celebrates food as a cultural
                  journey— one that connects people, preserves culinary
                  heritage, and turns cooking into an act of exploration.
                </p>

                <h3 className="text-white font-extrabold text-[20px] mt-8 mb-3">
                  What I believe in
                </h3>

                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Culture before trends — honoring authentic stories behind
                    recipes
                  </li>
                  <li>
                    Cozy simplicity — food should feel comforting, not
                    complicated
                  </li>
                  <li>Storytelling through cooking — every dish has a past</li>
                  <li>
                    Food brings people together — across borders and generations
                  </li>
                </ul>

                <h3 className="text-white font-extrabold text-[20px] mt-8 mb-3">
                  Why The Recipe Passport exists
                </h3>

                <p>
                  In a world full of fast content and quick recipes, we wanted
                  to slow things down:
                </p>

                <p>To cook with intention.</p>
                <p>To understand where food comes from.</p>
                <p>
                  To feel at home while discovering the world.
                </p>

                <p className="mt-6 italic">
                  Because some journeys begin in the kitchen. ❤️
                </p>
              </div>

              {/* Contact stickers */}
              <div className="mt-16 flex flex-col items-center gap-6">
                <div className="transform rotate-[-6deg]">
                  <div className="bg-[#F0C84B] border-4 border-[#8B5A2B] rounded-2xl px-10 py-3 shadow-md">
                    <h2 className="font-black text-[28px] md:text-[36px] tracking-wide text-[#8B5A2B]" style={{ fontFamily: 'Impact, sans-serif' }}>
                      CONTACT US!
                    </h2>
                  </div>
                </div>

                <div className="transform rotate-[4deg]">
                  <div className="bg-[#F0C84B] border-4 border-[#8B5A2B] rounded-2xl px-10 py-3 shadow-md">
                    <h2 className="font-black text-[24px] md:text-[32px] tracking-wide text-[#8B5A2B]" style={{ fontFamily: 'Impact, sans-serif' }}>
                      @recipePassport
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative brown wavy shape (bottom-right) */}
            <div className="absolute bottom-0 right-0 w-64 h-32 opacity-20">
              <svg viewBox="0 0 300 150" className="w-full h-full" preserveAspectRatio="none">
                <path
                  d="M 0 80 Q 50 40, 100 60 T 200 80 T 300 100 L 300 150 L 0 150 Z"
                  fill="#8B5A2B"
                />
              </svg>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  ) }