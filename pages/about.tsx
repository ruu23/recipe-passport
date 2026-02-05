import Image from "next/image";
import Header from "@/components/layout/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <main className="px-6 lg:px-16 pt-10 pb-16">
        <section className="relative max-w-6xl mx-auto">
          {/* Circle photo (top-left) */}
          <div className="absolute -top-4 left-6 z-20">
            <div className="relative w-[150px] h-[150px] md:w-[170px] md:h-[170px] rounded-full overflow-hidden border-[6px] border-cream shadow-md">
              {/* Put your photo in /public/images/me.jpg */}
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
          <div className="relative mt-16 md:mt-20 bg-[#F0C84B] rounded-[34px] border-2 border-cocoa/30 shadow-sm overflow-hidden">
            {/* Background scribble (optional) */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
              {/* put scribble in /public/images/scribble.png or remove this block */}
              <Image
                src="/images/scribble.png"
                alt=""
                fill
                className="object-cover"
              />
            </div>

            {/* Tilted ABOUT ME label */}
            <div className="absolute -top-8 right-10 z-20 rotate-[8deg]">
              <div className="relative bg-[#F0C84B] border-2 border-cocoa/40 rounded-2xl px-10 py-4 shadow-sm">
                <span className="font-[MilkTea] text-cocoa text-[44px] md:text-[52px] tracking-wide">
                  ABOUT ME
                </span>

                {/* small book icon (optional) */}
                <div className="absolute -right-8 -top-5 w-16 h-16">
                  {/* put icon in /public/images/book.png or remove */}
                  <Image
                    src="/images/book.png"
                    alt="Book"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
            </div>

            {/* Card content */}
            <div className="relative z-10 px-8 md:px-12 pt-16 md:pt-20 pb-16">
              <h2 className="text-center text-whiteSoft font-bold mb-6">
                <span className="inline-block bg-[#7A3B20] text-white px-5 py-2 rounded-full text-sm md:text-base">
                  Our Story
                </span>
              </h2>

              <div className="max-w-4xl mx-auto text-whiteSoft leading-relaxed text-[14px] md:text-[16px] font-semibold">
                <p className="mb-4">
                  Food has always been more than just a meal. It’s memory,
                  culture, and a language shared across generations. This
                  platform was created from a simple belief: every recipe
                  carries a story worth telling.
                </p>

                <p className="mb-4">
                  We wanted a place where you can explore global cuisines—not
                  only through ingredients and instructions, but through the
                  traditions, histories, and emotions that shape them. A digital
                  notebook where flavor travels, and cultures meet at the same
                  table.
                </p>

                <p className="mb-5">
                  To create a welcoming space that celebrates food as a cultural
                  journey— one that connects people, preserves culinary
                  heritage, and turns cooking into an act of exploration.
                </p>

                <h3 className="text-white font-extrabold mt-6 mb-2">
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

                <h3 className="text-white font-extrabold mt-6 mb-2">
                  Why The Recipe Passport exists
                </h3>

                <p className="mb-2">
                  In a world full of fast content and quick recipes, we wanted
                  to slow things down:
                </p>

                <p className="mb-2">To cook with intention.</p>
                <p className="mb-2">To understand where food comes from.</p>
                <p className="mb-2">
                  To feel at home while discovering the world.
                </p>

                <p className="mt-6">
                  Because some journeys begin in the kitchen. 💛
                </p>
              </div>

              {/* Contact strip + handle */}
              <div className="mt-10 flex flex-col items-center gap-3">
                <div className="bg-[#F0C84B] border-2 border-cocoa/40 rounded-full px-8 py-3 rotate-[-6deg] shadow-sm">
                  <span className="font-[MilkTea] text-cocoa text-[22px] md:text-[26px]">
                    CONTACT US!
                  </span>
                </div>

                <div className="bg-[#F0C84B] border-2 border-cocoa/40 rounded-full px-10 py-4 rotate-[4deg] shadow-sm">
                  <span className="font-[MilkTea] text-cocoa text-[22px] md:text-[26px]">
                    @recipePassport
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
