import Link from "next/link";
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

type Props = {
  heading: string;
  eyebrow: string;
  introduction: string;
  propertyTypes: string[];
  emptyMessage: string;
  contentHeading: string;
  content: string[];
};

export default async function PropertySEOPage({
  heading,
  eyebrow,
  introduction,
  propertyTypes,
  emptyMessage,
  contentHeading,
  content,
}: Props) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .in("property_type", propertyTypes)
    .order("id", { ascending: false });

  if (error) {
    console.error("SEO property page error:", error);
  }

  const properties = (data as Property[] | null) ?? [];

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 pb-20 pt-32 sm:px-8">
      <section className="mx-auto max-w-[1220px]">

        <header className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d99a2f]">
            {eyebrow}
          </p>

          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold text-[#071b3a] sm:text-5xl">
            {heading}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            {introduction}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className="rounded-xl bg-[#071b3a] px-6 py-3 font-bold text-white transition hover:opacity-90"
            >
              View All Properties
            </Link>

            <Link
              href="/eligibility"
              className="rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#071b3a] transition hover:opacity-90"
            >
              Check Eligibility
            </Link>
          </div>
        </header>

        <section>
          <h2 className="mb-7 font-serif text-3xl font-bold text-[#071b3a]">
            Currently Available
          </h2>

          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
              <p className="font-semibold text-red-700">
                Properties could not be loaded. Please try again later.
              </p>
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#071b3a]">
                No current availability
              </h3>

              <p className="mt-3 text-slate-600">
                {emptyMessage}
              </p>

              <Link
                href="/properties"
                className="mt-5 inline-block font-bold text-[#071b3a] underline"
              >
                Browse all available properties
              </Link>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-16 rounded-3xl bg-white p-7 shadow-sm sm:p-10">
          <h2 className="font-serif text-3xl font-bold text-[#071b3a]">
            {contentHeading}
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
            {content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-[#071b3a] p-7 text-white">
            <h3 className="font-serif text-2xl font-bold">
              Looking for accommodation in Wakefield?
            </h3>

            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Browse our current properties or complete our quick eligibility
              check and tell us what type of accommodation you are looking for.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/properties"
                className="rounded-xl bg-white px-6 py-3 font-bold text-[#071b3a]"
              >
                Browse Properties
              </Link>

              <Link
                href="/eligibility"
                className="rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#071b3a]"
              >
                Check Eligibility
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}