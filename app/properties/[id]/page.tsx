import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PropertyGallery from "@/components/property/PropertyGallery";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !property) {
    notFound();
  }
  const { data: gallery } = await supabase
  .from("property_images")
  .select("image_url")
  .eq("property_id", Number(id));

const images = [
  property.image,
  ...(gallery?.map((img) => img.image_url) || []),
];

  return (
    <main className="bg-gray-100 min-h-screen">

      {/* Hero Image */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">

          <PropertyGallery images={images} />
        </div>
      </section>

      {/* Property Details */}
      <section className="mx-auto max-w-7xl px-6 pb-16">

        <div className="grid gap-12 lg:grid-cols-3">

          {/* Left */}
          <div className="lg:col-span-2">

            <h1 className="text-4xl font-bold text-[#0B1F3A]">
              {property.title}
            </h1>

            <p className="mt-2 text-lg text-gray-500">
              📍 {property.location}
            </p>

            <p className="mt-4 text-4xl font-bold text-[#D4AF37]">
              {property.price}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">

              <div className="rounded-xl bg-white p-5 text-center shadow">
                🛏
                <p className="mt-2 font-semibold">
                  {property.bedrooms} Bedrooms
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 text-center shadow">
                🛁
                <p className="mt-2 font-semibold">
                  {property.bathrooms} Bathroom
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 text-center shadow">
                📐
                <p className="mt-2 font-semibold">
                  {property.area}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 text-center shadow">
                ⭐
                <p className="mt-2 font-semibold">
                  {property.featured ? "Featured Property" : "Property"}
                </p>
              </div>

            </div>

            <div className="mt-10 rounded-2xl bg-white p-8 shadow">

              <h2 className="text-2xl font-bold">
                Property Description
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                This beautifully presented property offers spacious accommodation,
                excellent transport links, modern interiors and a fantastic
                location within Wakefield.
              </p>

            </div>

          </div>

          {/* Right */}
          <div>

            <div className="sticky top-24 rounded-2xl bg-white p-8 shadow">

              <h2 className="text-2xl font-bold">
                Interested?
              </h2>

              <p className="mt-4 text-gray-600">
                Arrange a viewing or contact our team today.
              </p>

              <Link
                href="/eligibility"
                className="mt-8 block w-full rounded-xl bg-[#D4AF37] py-4 text-center font-bold text-[#0B1F3A] hover:opacity-90"
              >
                Book Viewing
              </Link>

              <button className="mt-4 w-full rounded-xl border-2 border-[#0B1F3A] py-4 font-bold text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white">
                Ask a Question
              </button>

              <div className="mt-8 rounded-xl bg-gray-100 p-5">
                <h3 className="font-bold">
                  Property Reference
                </h3>

                <p className="mt-2 text-gray-600">
                  WPL-{property.id}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}