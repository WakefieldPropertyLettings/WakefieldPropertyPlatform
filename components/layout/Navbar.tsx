"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../common/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menu = [
    "Home",
    "Properties",
    "Landlords",
    "Tenants",
    "About",
    "Contact",
  ];

  return (
    <header className="fixed top-5 left-0 z-50 w-full px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-5">

        {/* Logo Card */}
        <div className="flex h-20 w-64 items-center justify-center rounded-2xl bg-white shadow-2xl">
          <Logo />
        </div>

        {/* Navigation */}
        <div
          className={`flex flex-1 items-center justify-between rounded-2xl px-8 py-4 transition-all duration-500 ${
            scrolled
              ? "bg-white shadow-2xl"
              : "bg-white/10 backdrop-blur-xl border border-white/20"
          }`}
        >
          <ul className="flex items-center gap-8">

            {menu.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className={`relative font-semibold transition ${
                    scrolled ? "text-[#0B1F3A]" : "text-white"
                  }`}
                >
                  {item}

                  <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-[#D4AF37] transition-all duration-300 hover:w-full"></span>
                </Link>
              </li>
            ))}

          </ul>

          <button className="rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B1F3A] transition hover:scale-105">
            Book Viewing
          </button>
        </div>

      </div>
    </header>
  );
}