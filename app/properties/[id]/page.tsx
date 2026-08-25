import type { Metadata } from "next";
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

type Property = {
  id: number;
  title: string;
  description?: string | null;

  price: number | string;

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

/* =========================================================
   SEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const propertyId = Number(id);

  if (
    !Number.isInteger(propertyId) ||
    propertyId <= 0
  ) {
    return {
      title:
        "Property to Rent in Wakefield | Wakefield Property Lettings",

      description:
        "View rental properties available across Wakefield and surrounding areas with Wakefield Property Lettings Ltd.",
    };
  }

  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("properties")
    .select(
      `
      id,
      title,
      description,
      price,
      location,
      address,
      city,
      postcode,
      property_type,
      bedrooms,
      image
      `
    )
    .eq("id", propertyId)
    .single();

  if (error || !data) {
    return {
      title:
        "Property Not Found | Wakefield Property Lettings",

      description:
        "This property could not be found. Browse other rental properties available through Wakefield Property Lettings Ltd.",
    };
  }

  const property = data as Property;

  const formattedPrice =
    new Intl.NumberFormat(
      "en-GB",
      {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
      }
    ).format(
      Number(property.price) || 0
    );

  const propertyType =
    property.property_type?.trim() ||
    "Property";

  const location =
    property.city?.trim() ||
    property.location?.trim() ||
    "Wakefield";

  const bedroomText =
    property.bedrooms &&
    Number(property.bedrooms) > 0
      ? `${property.bedrooms} Bedroom `
      : "";

  const seoTitle =
    `${bedroomText}${propertyType} to Rent in ${location} | ${formattedPrice} PCM`;

  const fallbackDescription =
    `${bedroomText}${propertyType.toLowerCase()} to rent in ${location}` +
    `${
      property.postcode
        ? `, ${property.postcode}`
        : ""
    } for ${formattedPrice} PCM. ` +
    `View photos, property details and enquire online with Wakefield Property Lettings Ltd.`;

  const description =
    property.description
      ?.replace(/\s+/g, " ")
      .trim()
      .slice(0, 155) ||
    fallbackDescription;

  const canonicalUrl =
    `https://www.wakefieldpropertylettings.co.uk/properties/${property.id}`;

  return {
    title: seoTitle,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: seoTitle,

      description,

      url: canonicalUrl,

      siteName:
        "Wakefield Property Lettings",

      type: "website",

      images:
        property.image &&
        property.image.trim()
          ? [
              {
                url:
                  property.image,

                alt:
                  property.title,
              },
            ]
          : [],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        seoTitle,

      description,

      images:
        property.image &&
        property.image.trim()
          ? [
              property.image,
            ]
          : [],
    },
  };
}

/* =========================================================
   PROPERTY PAGE
========================================================= */

export default async function PropertyDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const propertyId = Number(id);

  if (
    !Number.isInteger(propertyId) ||
    propertyId <= 0
  ) {
    notFound();
  }

  const supabase =
    await createClient();

  /* ---------------------------------------------------------
     LOAD PROPERTY
  --------------------------------------------------------- */

  const {
    data,
    error: propertyError,
  } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (
    propertyError ||
    !data
  ) {
    console.error(
      "Property details error:",
      propertyError
    );

    notFound();
  }

  const property =
    data as Property;

  /* ---------------------------------------------------------
     LOAD PROPERTY IMAGES
  --------------------------------------------------------- */

  const {
    data: gallery,
    error: galleryError,
  } = await supabase
    .from("property_images")
    .select("image_url")
    .eq(
      "property_id",
      propertyId
    );

  if (galleryError) {
    console.error(
      "Property gallery error:",
      galleryError
    );
  }

  const galleryImages =
    (
      gallery as
        | GalleryImage[]
        | null
    )
      ?.map(
        (item) =>
          item.image_url
      )
      .filter(
        (
          image
        ): image is string =>
          Boolean(
            image?.trim()
          )
      ) ?? [];

  const images = [
    ...(
      property.image &&
      property.image.trim()
        ? [
            property.image,
          ]
        : []
    ),

    ...galleryImages,
  ];

  const uniqueImages =
    Array.from(
      new Set(images)
    );

  /* ---------------------------------------------------------
     FORMATTING
  --------------------------------------------------------- */

  const availableFrom =
    property.available_from
      ? new Date(
          property.available_from
        ).toLocaleDateString(
          "en-GB",
          {
            day: "numeric",

            month: "long",

            year: "numeric",
          }
        )
      : "Immediately";

  const formattedPrice =
    new Intl.NumberFormat(
      "en-GB",
      {
        style: "currency",

        currency: "GBP",

        maximumFractionDigits: 0,
      }
    ).format(
      Number(
        property.price
      ) || 0
    );

  const formattedDeposit =
    property.deposit
      ? new Intl.NumberFormat(
          "en-GB",
          {
            style: "currency",

            currency: "GBP",

            maximumFractionDigits: 0,
          }
        ).format(
          Number(
            property.deposit
          ) || 0
        )
      : "Contact us";

  const propertyLocation =
    [
      property.location,
      property.postcode,
    ]
      .filter(Boolean)
      .join(", ") ||
    "Wakefield";

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#f7f8fb]">

      {/* =====================================================
          PROPERTY GALLERY
      ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <PropertyGallery
            images={
              uniqueImages
            }
          />
        </div>
      </section>

      {/* =====================================================
          PROPERTY INFORMATION
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">

        <div className="grid gap-10 lg:grid-cols-3">

          {/* =================================================
              MAIN PROPERTY CONTENT
          ================================================= */}

          <div className="lg:col-span-2">

            {/* Property reference */}

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              Wakefield Property
              Lettings · Property
              WPL-{property.id}
            </p>

            {/* H1 */}

            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#071b3a] sm:text-5xl">
              {property.title}
            </h1>

            {/* Location */}

            <p className="mt-4 flex items-center gap-2 text-lg text-slate-600">
              <span
                aria-hidden="true"
              >
                📍
              </span>

              {
                propertyLocation
              }
            </p>

            {/* Price */}

            <p className="mt-5 text-4xl font-bold text-[#D4AF37]">
              {formattedPrice}
              <span className="ml-2 text-lg font-semibold text-slate-500">
                PCM
              </span>
            </p>

            {/* =================================================
                TAGS
            ================================================= */}

            <div className="mt-6 flex flex-wrap gap-3">

              {property.property_type && (
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                  {
                    property.property_type
                  }
                </span>
              )}

              {property.furnished && (
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                  Furnished
                </span>
              )}

              {property.bills_included && (
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                  Bills Included
                </span>
              )}

              {property.parking && (
                <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800">
                  Parking
                </span>
              )}

              {property.garden && (
                <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-800">
                  Garden
                </span>
              )}

              {property.pet_friendly && (
                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-800">
                  Pet Friendly
                </span>
              )}

            </div>

            {/* =================================================
                KEY PROPERTY STATS
            ================================================= */}

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">

              <PropertyStat
                icon="🛏️"
                label={
                  property.bedrooms ===
                  1
                    ? "Bedroom"
                    : "Bedrooms"
                }
                value={String(
                  property.bedrooms ??
                    0
                )}
              />

              <PropertyStat
                icon="🚿"
                label={
                  property.bathrooms ===
                  1
                    ? "Bathroom"
                    : "Bathrooms"
                }
                value={String(
                  property.bathrooms ??
                    0
                )}
              />

              <PropertyStat
                icon="💷"
                label="Deposit"
                value={
                  formattedDeposit
                }
              />

              <PropertyStat
                icon="📅"
                label="Available"
                value={
                  availableFrom
                }
              />

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div className="mt-12 rounded-3xl bg-white p-7 shadow-sm sm:p-9">

              <h2 className="font-serif text-3xl font-bold text-[#071b3a]">
                About this property
              </h2>

              {property.description ? (
                <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                  {
                    property.description
                  }
                </div>
              ) : (
                <p className="mt-5 leading-8 text-slate-600">
                  This property is
                  available to rent
                  through Wakefield
                  Property Lettings
                  Ltd. Please contact
                  our team for further
                  details or to arrange
                  a viewing.
                </p>
              )}

            </div>

            {/* =================================================
                PROPERTY FEATURES
            ================================================= */}

            <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm sm:p-9">

              <h2 className="font-serif text-3xl font-bold text-[#071b3a]">
                Property details
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                <DetailRow
                  label="Property type"
                  value={
                    property.property_type ||
                    "Not specified"
                  }
                />

                <DetailRow
                  label="Monthly rent"
                  value={`${formattedPrice} PCM`}
                />

                <DetailRow
                  label="Deposit"
                  value={
                    formattedDeposit
                  }
                />

                <DetailRow
                  label="Available from"
                  value={
                    availableFrom
                  }
                />

                <DetailRow
                  label="Furnished"
                  value={
                    property.furnished
                      ? "Yes"
                      : "No"
                  }
                />

                <DetailRow
                  label="Bills included"
                  value={
                    property.bills_included
                      ? "Yes"
                      : "No"
                  }
                />

                <DetailRow
                  label="Parking"
                  value={
                    property.parking
                      ? "Available"
                      : "Not specified"
                  }
                />

                <DetailRow
                  label="Garden"
                  value={
                    property.garden
                      ? "Yes"
                      : "Not specified"
                  }
                />

                <DetailRow
                  label="Pet friendly"
                  value={
                    property.pet_friendly
                      ? "Yes"
                      : "Not specified"
                  }
                />

                <DetailRow
                  label="Postcode"
                  value={
                    property.postcode ||
                    "Not provided"
                  }
                />

              </div>
            </div>

          </div>

          {/* =================================================
              ENQUIRY SIDEBAR
          ================================================= */}

          <aside className="lg:col-span-1">

            <div className="sticky top-28 rounded-3xl bg-[#071b3a] p-7 text-white shadow-xl">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                Interested in this
                property?
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold">
                Arrange a viewing
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Complete our quick
                eligibility check and
                our property team will
                review your
                requirements.
              </p>

              <Link
                href="/eligibility"
                className="mt-7 block rounded-xl bg-[#D4AF37] px-6 py-4 text-center font-bold text-[#071b3a] transition hover:opacity-90"
              >
                Check Eligibility
              </Link>

              <Link
                href="/contact"
                className="mt-3 block rounded-xl border border-white/30 px-6 py-4 text-center font-bold text-white transition hover:bg-white/10"
              >
                Contact Us
              </Link>

              <div className="mt-8 border-t border-white/20 pt-7">

                <p className="text-sm text-slate-400">
                  Monthly Rent
                </p>

                <p className="mt-1 text-3xl font-bold text-[#D4AF37]">
                  {
                    formattedPrice
                  }
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  per calendar month
                </p>

              </div>

              <div className="mt-5">

                <p className="text-sm text-slate-400">
                  Deposit
                </p>

                <p className="mt-1 text-xl font-bold">
                  {
                    formattedDeposit
                  }
                </p>

              </div>

              <div className="mt-5">

                <p className="text-sm text-slate-400">
                  Available
                </p>

                <p className="mt-1 font-semibold">
                  {
                    availableFrom
                  }
                </p>

              </div>

            </div>

          </aside>

        </div>

        {/* =====================================================
            BACK TO PROPERTIES
        ===================================================== */}

        <div className="mt-12">

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 font-bold text-[#071b3a] hover:text-[#D4AF37]"
          >
            ← View all properties
          </Link>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   PROPERTY STAT
========================================================= */

function PropertyStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">

      <span
        className="text-2xl"
        aria-hidden="true"
      >
        {icon}
      </span>

      <p className="mt-2 font-bold text-[#071b3a]">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-100 pb-4">

      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-[#071b3a]">
        {value}
      </p>

    </div>
  );
}