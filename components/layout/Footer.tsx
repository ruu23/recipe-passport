export default function Footer() {
  return (
    <footer className="bg-cream px-6 md:px-16 pt-5 pb-5">
      <div className="mx-auto">
        {/* Title */}
        <h1 className="title text-[48px] md:text-[56px]">
          LET&apos;S CONNECT!
        </h1>

        <h1 className="mt-2 subtitle text-[20px] md:text-[24px]">
          LOVE FRESH RECIPES LIKE THIS?
        </h1>

        {/* Yellow Card */}
        <div className="mt-10 bg-[#F2C94C] rounded-[28px] px-8 md:px-12 py-10 shadow-md">
          {/* Visit Us badge */}
          <h1 className="inline-block bg-cream subtitle font-bold px-6 py-2 rounded-full mb-6">
            VISIT US!
          </h1>

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
