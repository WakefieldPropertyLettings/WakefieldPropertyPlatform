"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Properties",
    href: "/properties",
  },
  {
    label: "Add Property",
    href: "/admin/add-property",
  },
  {
    label: "Operations",
    href: "/admin/operations",
  },
  {
    label: "Jasmine AI",
    href: "/admin/jasmine",
  },
  {
    label: "Marketing",
    href: "/admin/marketing",
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  // Do not show the admin navigation on the login screen.
  if (pathname === "/admin/login") {
    return null;
  }

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    if (href === "/properties") {
      return pathname === "/properties";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071b3a]/95 text-white shadow-lg backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/admin"
              className="shrink-0"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#efad3f]">
                Wakefield Property Lettings
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                Admin Portal
              </p>
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:border-[#efad3f] hover:bg-white/10 xl:hidden"
            >
              View Website ↗
            </Link>
          </div>

          <nav
            aria-label="Admin navigation"
            className="flex items-center gap-2 overflow-x-auto pb-1 xl:overflow-visible xl:pb-0"
          >
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[#efad3f] text-[#071b3a]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden whitespace-nowrap rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#efad3f] hover:bg-white/10 xl:block"
            >
              View Website ↗
            </Link>

            <div className="shrink-0">
              <AdminLogoutButton />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}