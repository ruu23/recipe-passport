import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

import UserIcon from "@/public/icons/user-icon.png";
import PlateIcon from "@/public/icons/plate-icon.png";

function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [role, setRole] = useState<"user" | "editor" | "admin" | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadRole = async () => {
      if (!user) {
        setRole(null);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!ignore) setRole(error ? null : (data?.role ?? null));
    };

    loadRole();
    return () => {
      ignore = true;
    };
  }, [user]);

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleUserIconClick = () => {
    if (user) go("/profile");
    else go("/auth/login");
  };

  // close menu on outside click + ESC
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
    <header className="w-full px-6 lg:px-12 pt-6 bg-cream">
      <div className="flex items-center justify-between lg:grid lg:grid-cols-3">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-12 h-12 rounded-full bg-card text-cocoa"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <FiMenu className="text-2xl" />
          </button>

          {open && (
            <div className="lg:hidden absolute left-0 mt-3 w-56 rounded-2xl bg-card shadow-lg p-3">
              <button className="w-full text-left nav-item block px-3 py-2 rounded-xl hover:bg-white/30" onClick={() => go("/home")}>
                Home
              </button>
              <button className="w-full text-left nav-item block px-3 py-2 rounded-xl hover:bg-white/30" onClick={() => go("/explore")}>
                Explore
              </button>
              <button className="w-full text-left nav-item block px-3 py-2 rounded-xl hover:bg-white/30" onClick={() => go("/about")}>
                About
              </button>
            </div>
          )}

          <div className="hidden lg:block" />
        </div>

        <nav className="hidden lg:flex justify-center gap-6 items-center">
          <button className="nav-item" onClick={() => go("/home")}>Home</button>
          <button className="nav-item" onClick={() => go("/explore")}>Explore</button>
          <button className="nav-item" onClick={() => go("/about")}>About</button>
        </nav>

        <div className="flex justify-end items-center gap-4">
          <button type="button" className="hover:cursor-pointer" onClick={handleUserIconClick}>
            <Image src={UserIcon} alt="Profile" className="w-12 h-12" />
          </button>

          <button type="button" className="hover:cursor-pointer" onClick={() => go("/favorites")}>
            <Image src={PlateIcon} alt="Plate" className="w-14 h-10" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
