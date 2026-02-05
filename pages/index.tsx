import { useRouter } from "next/router";
import { MdOutlineNavigateNext } from "react-icons/md";

export default function Index() {
  const router = useRouter()
  
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-cream"
      style={{ backgroundImage: `url('/images/background.png')` }}
    >
      {/* Title */}
      <div className="text-center pt-28 sm:pt-40 md:pt-52 leading-none">
        <h1 className="title text-[72px] sm:text-[110px] md:text-[151px]">
          recipe
        </h1>
        <h1 className="title text-[44px] sm:text-[70px] md:text-[90px]">
          passport
        </h1>
      </div>

      {/* CTA Buttons */}
      <div
        className="
          absolute
          left-1/2 -translate-x-1/2 bottom-10
          sm:left-auto sm:translate-x-0 sm:bottom-16 sm:right-16
          md:bottom-20 md:right-20
          flex items-center gap-3
        "
        
      >
        <button className="btn-primary px-6 py-3 sm:px-10 sm:py-4"
        onClick={() => router.push('/home')}>
          get started
        </button>

        <button
          className="
            btn-icon-arrow
            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
            flex items-center justify-center
          "
          aria-label="Next"
          onClick={() => router.push('/home')}
        >
          <MdOutlineNavigateNext className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
        </button>
      </div>
    </div>
  );
}
