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

export default async function PropertiesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Properties page error:", error);
  }

  const properties = (data as Property[] | null) ?? [];

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 pb-20 pt-32 sm:px-8">
      <section className="mx-auto max-w-[1220px]">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d99a2f]">
            Available homes
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold text-[#071b3a] sm:text-5xl">
            Properties
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Browse available rental properties across Wakefield and the
            surrounding areas.
          </p>
        </div>

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
              No properties available
            </h2>

            <p className="mt-3 text-slate-600">
              New properties will be added soon.
            </p>
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
    </main>
  );
}