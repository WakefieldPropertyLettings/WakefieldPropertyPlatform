"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navigationLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Lettings",
    href: "/properties",
  },
  {
    label: "For Landlords",
    href: "/landlords",
  },
  {
    label: "Tenants",
    href: "/tenants",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-t border-[#071b3a] border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-[82px] max-w-[1240px] items-center justify-between px-5 lg:px-6">
        {/* Logo and company name */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="relative h-10 w-20 shrink-0 sm:h-12 sm:w-28">
  <Image
    src="/logo.png"
    alt="Wakefield Property Lettings Limited logo"
    fill
    priority
    sizes="(max-width: 640px) 80px, 112px"
    className="object-contain object-left"
  />
</div>

          <div className="min-w-0">
            <p className="truncate font-serif text-lg font-bold leading-tight text-[#071b3a] xl:text-xl">
              Wakefield Property
            </p>

            <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-500 xl:text-[10px]">
              Lettings Limited
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-slate-700 transition hover:text-[#d9992d]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/report-issue"
            className="whitespace-nowrap text-sm font-semibold text-[#071b3a] transition hover:text-[#d9992d]"
          >
            Report issue
          </Link>

          <Link
            href="/eligibility"
            className="whitespace-nowrap rounded-xl bg-[#efad3f] px-5 py-3 text-sm font-semibold text-[#071b3a] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f5bd5c] hover:shadow-md"
          >
            Book viewing
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#071b3a] transition hover:bg-slate-50 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 pb-6 pt-4 shadow-xl lg:hidden">
          <nav className="mx-auto flex max-w-[1240px] flex-col">
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-slate-100 py-3.5 text-sm font-semibold text-slate-700 transition hover:text-[#d9992d]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/report-issue"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3.5 text-sm font-semibold text-[#071b3a]"
            >
              Report issue
            </Link>

            <Link
              href="/book-viewing"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 rounded-xl bg-[#efad3f] px-5 py-3.5 text-center text-sm font-semibold text-[#071b3a]"
            >
              Book viewing
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}