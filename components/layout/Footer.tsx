export default function Footer() {
  return (
    <footer className="bg-cream px-6 lg:px-16 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="font-[MilkTea] text-[48px] md:text-[56px] text-cocoa">
          LET&apos;S CONNECT!
        </h2>

        <p className="mt-2 font-[MilkTea] text-[20px] md:text-[24px] text-cocoa/80">
          LOVE FRESH RECIPES LIKE THIS?
        </p>

        {/* Yellow Card */}
        <div className="mt-10 bg-[#F2C94C] rounded-[28px] px-8 md:px-12 py-10 shadow-md">
          {/* Visit Us badge */}
          <div className="inline-block bg-cream text-cocoa font-bold px-6 py-2 rounded-full mb-6">
            VISIT US!
          </div>

          {/* Content */}
          <div className="space-y-4 text-whiteSoft text-[18px] md:text-[20px]">
            <div className="flex flex-wrap gap-3">
              <span className="font-bold min-w-[90px]">WEBSITE</span>
              <span>:</span>
              <a
                href="https://www.recipe-passport.com"
                target="_blank"
                className="hover:underline"
              >
                www.recipe-passport.com
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="font-bold min-w-[90px]">SOCIAL</span>
              <span>:</span>
              <span>@recipePassport</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
