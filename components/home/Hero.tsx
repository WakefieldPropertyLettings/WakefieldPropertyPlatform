"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minPrice, setMinPrice] = useState("500");
  const [maxPrice, setMaxPrice] = useState("2000");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (propertyType) {
      params.set("type", propertyType);
    }

    if (bedrooms) {
      params.set("bedrooms", bedrooms);
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }

    const query = params.toString();

    router.push(query ? `/properties?${query}` : "/properties");
  }

  return (
    <>
      <section className="relative min-h-[650px] overflow-visible bg-[#071b3a] lg:min-h-[655px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=2200&auto=format&fit=crop&q=90"
            alt="Luxury homes in Wakefield"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#071b3a]/95 via-[#071b3a]/75 to-[#071b3a]/20" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#071b3a]/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1220px] px-5 pb-44 pt-24 sm:px-8 lg:pb-48 lg:pt-24">
          <div className="max-w-[650px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#efad3f] backdrop-blur-sm">
              <span aria-hidden="true">✨</span>
              Wakefield&apos;s modern letting agency
            </div>

            <h1 className="font-serif text-[48px] font-bold leading-[1.02] tracking-[-0.025em] text-white sm:text-[60px] lg:text-[72px]">
              Find a home you&apos;ll
              <br />
              <span className="text-[#efad3f]">love</span> in Wakefield.
            </h1>

            <p className="mt-7 max-w-[580px] text-lg leading-8 text-white/90 sm:text-xl">
              Beautifully curated homes to let and for sale, matched with the
              local knowledge and smart technology of a modern agency.
            </p>
          </div>
        </div>

        <div className="absolute bottom-[-62px] left-0 right-0 z-20 px-5 sm:px-8">
          <form
            onSubmit={handleSearch}
            className="mx-auto max-w-[1220px] rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(7,27,58,0.22)] sm:p-7"
          >
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_0.95fr_0.95fr]">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Location
                </span>

                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Wakefield, Ossett, Horbury..."
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-[#071b3a] focus:ring-2 focus:ring-[#071b3a]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Type
                </span>

                <select
                  value={propertyType}
                  onChange={(event) => setPropertyType(event.target.value)}
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#071b3a] focus:ring-2 focus:ring-[#071b3a]/10"
                >
                  <option value="">Any</option>
                  <option value="House">House</option>
                  <option value="Flat">Flat</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Studio">Studio</option>
                  <option value="Room">Room</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Bedrooms
                </span>

                <select
                  value={bedrooms}
                  onChange={(event) => setBedrooms(event.target.value)}
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#071b3a] focus:ring-2 focus:ring-[#071b3a]/10"
                >
                  <option value="">Any</option>
                  <option value="1">1 bedroom</option>
                  <option value="2">2 bedrooms</option>
                  <option value="3">3 bedrooms</option>
                  <option value="4">4+ bedrooms</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Min £
                </span>

                <input
                  type="number"
                  min="0"
                  step="50"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="500"
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#071b3a] focus:ring-2 focus:ring-[#071b3a]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Max £
                </span>

                <input
                  type="number"
                  min="0"
                  step="50"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="2000"
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#071b3a] focus:ring-2 focus:ring-[#071b3a]/10"
                />
              </label>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex h-[48px] w-full items-center justify-center gap-3 rounded-xl bg-[#efad3f] px-8 text-sm font-semibold text-[#071b3a] shadow-sm transition hover:bg-[#f6bb54] sm:w-auto sm:min-w-[215px]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>

                Search properties
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#faf8f3] px-5 pb-8 pt-24 sm:px-8">
        <div className="mx-auto grid max-w-[1220px] grid-cols-2 gap-y-8 md:grid-cols-4">
          <article className="border-r border-slate-200 pr-4 md:px-8 md:first:pl-0">
            <p className="font-serif text-4xl font-bold text-[#071b3a]">
              500+
            </p>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-600">
              Properties let
            </p>
          </article>

          <article className="px-4 md:border-r md:border-slate-200 md:px-8">
            <p className="font-serif text-4xl font-bold text-[#071b3a]">
              4.9★
            </p>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-600">
              Reviews
            </p>
          </article>

          <article className="border-r border-slate-200 pr-4 md:px-8">
            <p className="font-serif text-4xl font-bold text-[#071b3a]">
              24/7
            </p>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-600">
              Tenant support
            </p>
          </article>

          <article className="px-4 md:px-8 md:last:pr-0">
            <p className="font-serif text-4xl font-bold text-[#071b3a]">
              20+ yrs
            </p>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-600">
              Local experience
            </p>
          </article>
        </div>
      </section>
    </>
  );
}