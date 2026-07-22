"use client";

import Link from "next/link";

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  bills_included: boolean;
  available: boolean;
  city: string;
  postcode: string;
  image: string;
};

export default function PropertyCard({
  property,
}: {
  property: Property;
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">

      <img
  src={
    property.image && property.image.trim() !== ""
      ? property.image
      : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"
  }
  alt={property.title}
  className="h-64 w-full object-cover"
/>

      <div className="p-6">

        <h2 className="text-2xl font-bold text-[#0B1F3A]">
          {property.title}
        </h2>

        <p className="mt-2 text-gray-600">
          {property.city} {property.postcode}
        </p>

        <p className="mt-4 text-3xl font-bold text-[#D4AF37]">
          £{property.price} pcm
        </p>

        <div className="mt-5 flex flex-wrap gap-2">

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
            {property.property_type}
          </span>

          <span className="rounded-full bg-green-100 px-3 py-1 text-sm">
            {property.bedrooms} Bedrooms
          </span>

          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm">
            {property.bathrooms} Bathroom
          </span>

          {property.furnished && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm">
              Furnished
            </span>
          )}

          {property.bills_included && (
            <span className="rounded-full bg-pink-100 px-3 py-1 text-sm">
              Bills Included
            </span>
          )}

          {property.available && (
            <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-semibold">
              Available Now
            </span>
          )}

        </div>

        <Link
          href={`/properties/${property.id}`}
          className="mt-8 block rounded-xl bg-[#0B1F3A] py-4 text-center font-bold text-white transition hover:bg-[#132d52]"
        >
          View Property
        </Link>

      </div>

    </div>
  );
}