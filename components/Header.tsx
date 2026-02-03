import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";

import UserIcon from "@/public/icons/user-icon.png";
import PlateIcon from "@/public/icons/plate-icon.png";

function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  // close menu on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <header className="w-full px-4 sm:px-6 lg:px-10 pt-6">
      <div className="flex items-center justify-between">
        {/* Left (Mobile): Menu */}
        <div className="relative lg:hidden" ref={menuRef}>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-card)] text-[var(--color-cocoa)] hover:opacity-90 transition"
          >
            <FiMenu className="text-2xl" />
          </button>

          {open && (
            <div className="absolute left-0 mt-3 w-56 rounded-2xl bg-[var(--color-card)] shadow-lg p-3 z-50">
              <button
                className="w-full text-left py-2 px-3 rounded-xl nav-item hover:bg-white/20"
                onClick={() => go("/home")}
              >
                Home
              </button>
              <button
                className="w-full text-left py-2 px-3 rounded-xl nav-item hover:bg-white/20"
                onClick={() => go("/explore")}
              >
                Explore
              </button>
              <button
                className="w-full text-left py-2 px-3 rounded-xl nav-item hover:bg-white/20"
                onClick={() => go("/about")}
              >
                About
              </button>
            </div>
          )}
        </div>

        {/* Center (Desktop): Nav buttons */}
        <nav className="hidden lg:flex items-center gap-6">
          <button className="nav-item" onClick={() => go("/home")}>
            Home
          </button>
          <button className="nav-item" onClick={() => go("/explore")}>
            Explore
          </button>
          <button className="nav-item" onClick={() => go("/about")}>
            About
          </button>
        </nav>

        {/* Right: Icons (always visible) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Profile"
            className="hover:opacity-90 transition"
          >
            <Image
              src={UserIcon}
              alt="Profile"
              className="w-10 h-10 sm:w-12 sm:h-12"
              priority
            />
          </button>

          <button
            type="button"
            aria-label="Plate"
            className="hover:opacity-90 transition"
          >
            <Image
              src={PlateIcon}
              alt="Plate"
              className="w-11 h-9 sm:w-14 sm:h-10"
              priority
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
