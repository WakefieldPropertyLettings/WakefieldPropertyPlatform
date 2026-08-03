import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/property/PropertyGallery";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type GalleryImage = {
  image_url: string | null;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;
  const propertyId = Number(id);

  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    notFound();
  }

  const supabase = await createClient();

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (propertyError || !property) {
    console.error("Property details error:", propertyError);
    notFound();
  }

  const { data: gallery, error: galleryError } = await supabase
    .from("property_images")
    .select("image_url")
    .eq("property_id", propertyId);

  if (galleryError) {
    console.error("Property gallery error:", galleryError);
  }

  const galleryImages =
    (gallery as GalleryImage[] | null)
      ?.map((item) => item.image_url)
      .filter((image): image is string => Boolean(image?.trim())) ?? [];

  const images = [
    ...(property.image && property.image.trim()
      ? [property.image]
      : []),
    ...galleryImages,
  ];

  const uniqueImages = Array.from(new Set(images));

  const availableFrom = property.available_from
    ? new Date(property.available_from).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Immediately";

  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Number(property.price) || 0);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Property gallery */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <PropertyGallery images={uniqueImages} />
        </div>
      </section>

      {/* Property details */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-[#0B1F3A]">
              {property.title}
            </h1>

            <p className="mt-2 text-lg text-gray-500">
              📍{" "}
              {[property.location, property.postcode]
                .filter(Boolean)
                .join(" ") || "Location not provided"}
            </p>

            <p className="mt-4 text-4xl font-bold text-[#D4AF37]">
              {formattedPrice} PCM
            </p>

            {/* Tags */}
            <div className="mt-5 flex flex-wrap gap-3">
              {property.property_type && (
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm">
                  {property.property_type}
                </span>
              )}

              {property.furnished && (
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm">
                  Furnished
                </span>
              )}

              {property.bills_included && (
                <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm">
                  Bills Included
                </span>
              )}

              {property.parking && (
                <span className="rounded-full bg-purple-100 px-4 py-2 text-sm">
                  Parking
                </span>
              )}

              {property.garden && (
                <span className="rounded-full bg-pink-100 px-4 py-2 text-sm">
                  Garden
                </span>
              )}

              {property.pet_friendly && (
                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm">
                  Pet Friendly
                </span>
              )}
            </div>

            {/* Main statistics */}
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-white p-5 text-center shadow">
                <span className="text-2xl" aria-hidden="true">
                  🛏
                </span>

                <p className="mt-2 font-semibold">
                  {property.bedrooms ?? 0}{" "}
                  {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 text-center shadow">
                <span className="text-2xl" aria-hidden="true">
                  🛁
                </span>

                <p className="mt-2 font-semibold">
                  {property.bathrooms ?? 0}{" "}
                  {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 text-center shadow">
                <span className="text-2xl" aria-hidden="true">
                  📐
                </span>

                <p className="mt-2 font-semibold">
                  {property.area || "Area not provided"}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 text-center shadow">
                <span className="text-2xl" aria-hidden="true">
                  ⭐
                </span>

                <p className="mt-2 font-semibold">
                  {property.featured
                    ? "Featured Property"
                    : "Available Property"}
                </p>
              </div>
            </div>

            {/* Description */}
            <section className="mt-10 rounded-2xl bg-white p-8 shadow">
              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Property Description
              </h2>

              <p className="mt-5 whitespace-pre-line leading-8 text-gray-600">
                {property.description ||
                  "No property description is currently available."}
              </p>
            </section>

            {/* Additional information */}
            <section className="mt-10 rounded-2xl bg-white p-8 shadow">
              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Additional Information
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-5">
                  <h3 className="font-bold text-[#0B1F3A]">
                    Deposit
                  </h3>

                  <p className="mt-2 text-gray-700">
                    {property.deposit !== null &&
                    property.deposit !== undefined &&
                    property.deposit !== ""
                      ? `£${property.deposit}`
                      : "Please contact us"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-5">
                  <h3 className="font-bold text-[#0B1F3A]">
                    Available From
                  </h3>

                  <p className="mt-2 text-gray-700">
                    {availableFrom}
                  </p>
                </div>
              </div>
            </section>

            {/* Map */}
            <section className="mt-10 rounded-2xl bg-white p-8 shadow">
              <h2 className="mb-6 text-2xl font-bold text-[#0B1F3A]">
                Property Location
              </h2>

              {property.google_map ? (
                <iframe
                  src={property.google_map}
                  title={`Map showing ${property.title}`}
                  width="100%"
                  height="400"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl border-0"
                />
              ) : (
                <p className="text-gray-500">
                  Map not available for this property.
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 rounded-2xl bg-white p-8 shadow">
              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Interested?
              </h2>

              <p className="mt-4 text-gray-600">
                Arrange a viewing or contact our team today.
              </p>

              <Link
                href={`/eligibility?propertyId=${property.id}`}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#efad3f] px-5 py-3.5 text-center text-sm font-semibold text-[#071b3a] transition hover:bg-[#f6bb54]"
              >
                Book viewing
              </Link>

              

              <div className="mt-8 rounded-xl bg-gray-100 p-5">
                <h3 className="font-bold text-[#0B1F3A]">
                  Property Reference
                </h3>

                <p className="mt-2 text-gray-600">
                  WPL-{property.id}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}