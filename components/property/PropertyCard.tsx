"use client";

import Link from "next/link";

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

  status?: string | null;
};

export default function PropertyCard({
  property,
}: {
  property: Property;
}) {
  const imageUrl =
    property.image?.trim() ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=85";

  const propertyLocation = [
    property.address,
    property.location || property.city,
    property.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  const availableDate = property.available_from
    ? new Date(property.available_from).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Available now";

  const formattedDeposit =
    property.deposit !== null &&
    property.deposit !== undefined &&
    property.deposit !== ""
      ? String(property.deposit).startsWith("£")
        ? String(property.deposit)
        : `£${property.deposit}`
      : null;

  const status = property.status || "available";

  const statusDetails = getStatusDetails(status);

  return (
    <article className="group h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(7,27,58,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(7,27,58,0.14)]">
      <Link
        href={`/properties/${property.id}`}
        className="relative block h-[260px] overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#071b3a]/70 via-transparent to-transparent" />

        {/* PROPERTY STATUS */}

        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm ${statusDetails.className}`}
        >
          {statusDetails.label}
        </span>

        {/* PROPERTY TYPE */}

        {property.property_type && (
          <span className="absolute right-4 top-4 rounded-full bg-[#efad3f] px-3 py-1.5 text-xs font-bold text-[#071b3a] shadow-sm">
            {property.property_type}
          </span>
        )}

        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-3xl font-bold leading-none">
            £{Number(property.price).toLocaleString("en-GB")}
          </p>

          <p className="mt-1 text-sm font-medium text-white/85">
            per calendar month
          </p>
        </div>
      </Link>

      <div className="flex h-[calc(100%-260px)] flex-col p-6">
        <div>
          <h3 className="font-serif text-2xl font-bold leading-tight text-[#071b3a]">
            <Link
              href={`/properties/${property.id}`}
              className="transition hover:text-[#c98b25]"
            >
              {property.title}
            </Link>
          </h3>

          <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-600">
            <svg
              className="mt-1 shrink-0"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>

            <span>{propertyLocation || "Wakefield"}</span>
          </p>

          {property.description && (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
              {property.description}
            </p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-200 py-4 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-[#071b3a]">
              {property.bedrooms ?? "—"}
            </p>

            <p className="text-xs text-slate-500">
              Bedrooms
            </p>
          </div>

          <div>
            <p className="text-lg font-bold text-[#071b3a]">
              {property.bathrooms ?? "—"}
            </p>

            <p className="text-xs text-slate-500">
              Bathrooms
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-bold text-[#071b3a]">
              {availableDate}
            </p>

            <p className="text-xs text-slate-500">
              Available from
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {property.furnished && (
            <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-semibold text-[#071b3a]">
              Furnished
            </span>
          )}

          {property.bills_included && (
            <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-semibold text-[#071b3a]">
              Bills included
            </span>
          )}

          {property.parking && (
            <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-semibold text-[#071b3a]">
              Parking
            </span>
          )}

          {property.garden && (
            <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-semibold text-[#071b3a]">
              Garden
            </span>
          )}

          {property.pet_friendly && (
            <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-semibold text-[#071b3a]">
              Pet friendly
            </span>
          )}
        </div>

        <div className="mt-auto pt-6">
          {formattedDeposit && (
            <p className="mb-4 text-sm text-slate-600">
              Deposit:{" "}
              <span className="font-semibold text-[#071b3a]">
                {formattedDeposit}
              </span>
            </p>
          )}

          <Link
            href={`/properties/${property.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071b3a] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#102b55]"
          >
            {status === "available"
              ? "View property"
              : "View property details"}

            <span aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function getStatusDetails(status: string) {
  switch (status) {
    case "reserved":
      return {
        label: "Reserved",
        className:
          "bg-amber-500 text-white",
      };

    case "let_agreed":
      return {
        label: "Let Agreed",
        className:
          "bg-[#071b3a] text-white",
      };

    case "available":
    default:
      return {
        label: "Available",
        className:
          "bg-emerald-600 text-white",
      };
  }
}