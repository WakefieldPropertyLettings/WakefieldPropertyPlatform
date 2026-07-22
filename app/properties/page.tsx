import PropertyCard from "@/components/property/PropertyCard";
import { properties } from "@/data/properties";

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Hero */}
      <section className="bg-[#0B1F3A] py-16 text-white">

        <div className="mx-auto max-w-7xl px-6">

          <h1 className="text-5xl font-bold">
            Available Properties
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Browse our latest rooms, flats and houses available to rent in
            Wakefield and surrounding areas.
          </p>

        </div>

      </section>

      {/* Search Box (Coming Next) */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="rounded-3xl bg-white p-6 shadow-lg">

          <h2 className="text-2xl font-bold text-[#0B1F3A]">
            Find Your Next Home
          </h2>

          <p className="mt-2 text-gray-500">
            Search by property type, bedrooms and budget.
          </p>

        </div>

      </section>

      {/* Property Grid */}

      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {properties.map((property) => (

            <PropertyCard
              key={property.id}
              property={property}
            />

          ))}

        </div>

      </section>

    </main>
  );
}