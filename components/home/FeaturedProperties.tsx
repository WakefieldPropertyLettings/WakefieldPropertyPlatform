"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PropertyCard from "../property/PropertyCard";

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

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  async function fetchFeaturedProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .limit(3);

    if (error) {
      console.error(error);
    } else {
      setProperties(data || []);
    }

    setLoading(false);
  }

  return (
    <section className="bg-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-10 text-center text-4xl font-bold text-[#0B1F3A]">
          Featured Properties
        </h2>

        {loading ? (
          <p className="text-center text-lg">
            Loading featured properties...
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}