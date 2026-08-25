import type { Metadata } from "next";

import PropertyCard from "@/components/property/PropertyCard";
import { createClient } from "@/lib/supabase/server";

type Property = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  location?: string | null;
  address?: string | null;
  city?: string | null;
  postcode?: string | null;
  property_type?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  furnished?: boolean | null;
  bills_included?: boolean | null;
  available_from?: string | null;
  deposit?: string | number | null;
  parking?: boolean | null;
  garden?: boolean | null;
  pet_friendly?: boolean | null;
  image?: string | null;
};

export const metadata: Metadata = {
  title:
    "Properties to Rent in Wakefield | Rooms, Studios, Flats & Houses",

  description:
    "Browse properties to rent in Wakefield including rooms, en-suite rooms, studios, flats and houses. View current availability and enquire online with Wakefield Property Lettings Ltd.",

  alternates: {
    canonical:
      "https://www.wakefieldpropertylettings.co.uk/properties",
  },

  openGraph: {
    title:
      "Properties to Rent in Wakefield | Wakefield Property Lettings",

    description:
      "Browse rooms, en-suite rooms, studios, flats and houses to rent across Wakefield and surrounding areas.",

    url:
      "https://www.wakefieldpropertylettings.co.uk/properties",

    siteName:
      "Wakefield Property Lettings",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Properties to Rent in Wakefield",

    description:
      "Browse rooms, en-suite rooms, studios, flats and houses available to rent across Wakefield.",
  },
};

export default async function PropertiesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("id", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Properties page error:",
      error
    );
  }

  const properties =
    (data as Property[] | null) ?? [];

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 pb-20 pt-32 sm:px-8">

      <section className="mx-auto max-w-[1220px]">

        {/* =====================================================
            PAGE INTRO
        ===================================================== */}

        <div className="mb-12">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d99a2f]">
            Wakefield Property Lettings
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold text-[#071b3a] sm:text-5xl">
            Properties to Rent in Wakefield
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Browse our current rental properties across Wakefield and
            surrounding areas. We offer a range of accommodation including
            rooms in shared houses, private en-suite rooms, self-contained
            studios, flats and houses.
          </p>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Whether you are looking for affordable shared accommodation,
            a private en-suite room, a studio or a whole property, our team
            can help you find a suitable option based on your budget,
            preferred location and move-in date.
          </p>

        </div>

        {/* =====================================================
            PROPERTY TYPE LINKS
        ===================================================== */}

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <CategoryCard
            title="Rooms"
            description="Shared accommodation across Wakefield."
            href="/rooms-to-rent-wakefield"
          />

          <CategoryCard
            title="En-suite Rooms"
            description="Private bathroom with shared living facilities."
            href="/ensuite-rooms-wakefield"
          />

          <CategoryCard
            title="Studios"
            description="Self-contained accommodation for greater privacy."
            href="/studios-to-rent-wakefield"
          />

          <CategoryCard
            title="Flats"
            description="Flats and apartments available to rent."
            href="/flats-to-rent-wakefield"
          />

          <CategoryCard
            title="Houses"
            description="Whole houses available across Wakefield."
            href="/houses-to-rent-wakefield"
          />

        </div>

        {/* =====================================================
            PROPERTIES
        ===================================================== */}

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">

            <h2 className="text-xl font-bold text-red-800">
              Properties could not be loaded
            </h2>

            <p className="mt-3 text-red-700">
              Please refresh the page or try again later.
            </p>

          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

            <h2 className="font-serif text-2xl font-bold text-[#071b3a]">
              No properties currently available
            </h2>

            <p className="mt-3 text-slate-600">
              New rooms, studios, flats and houses are added regularly.
              Please check back soon or contact our team.
            </p>

          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

            {properties.map(
              (property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                />
              )
            )}

          </div>
        )}

        {/* =====================================================
            LOCAL SEO CONTENT
        ===================================================== */}

        <section className="mt-16 rounded-3xl bg-white p-7 shadow-sm sm:p-10">

          <h2 className="font-serif text-3xl font-bold text-[#071b3a]">
            Find Rental Accommodation in Wakefield
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">

            <p>
              Wakefield Property Lettings Ltd provides rental accommodation
              across Wakefield and surrounding areas. Our available properties
              may include furnished rooms, en-suite rooms, self-contained
              studios, flats and houses.
            </p>

            <p>
              Our listings are suitable for a range of tenants including
              working professionals, couples, families, new starters and
              people relocating to the Wakefield area. Availability,
              deposits, bills and property features vary between individual
              listings, so please check each property page for full details.
            </p>

            <p>
              If you are ready to move, you can browse our available
              properties and complete our quick eligibility check online.
              Our team will review your requirements and help identify
              suitable accommodation where available.
            </p>

          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <a
              href="/eligibility"
              className="rounded-xl bg-[#D4AF37] px-7 py-4 text-center font-bold text-[#071b3a] transition hover:opacity-90"
            >
              Check Eligibility
            </a>

            <a
              href="/contact"
              className="rounded-xl border-2 border-[#071b3a] px-7 py-4 text-center font-bold text-[#071b3a] transition hover:bg-[#071b3a] hover:text-white"
            >
              Contact Our Team
            </a>

          </div>

        </section>

      </section>

    </main>
  );
}

/* =========================================================
   CATEGORY CARD
========================================================= */

function CategoryCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-md"
    >

      <h2 className="font-bold text-[#071b3a]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>

    </a>
  );
}