"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { createClient } from "@/lib/supabase/client";
import PropertyCard from "../property/PropertyCard";

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
  available?: boolean | null;
  available_from?: string | null;
  deposit?: string | number | null;
  parking?: boolean | null;
  garden?: boolean | null;
  pet_friendly?: boolean | null;
  image?: string | null;
};

/*
  Create the browser Supabase client once.
  This file is a Client Component because it starts with "use client".
*/
const supabase = createClient();

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchFeaturedProperties() {
      setLoading(true);

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .limit(3);

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Featured properties error:", error);
        setProperties([]);
      } else {
        setProperties((data as Property[]) ?? []);
      }

      setLoading(false);
    }

    fetchFeaturedProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-[1220px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d99a2f]">
              Hand-picked for you
            </p>

            <h2 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight text-[#071b3a] sm:text-5xl">
              Featured properties
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore a selection of quality homes available across Wakefield
              and the surrounding areas.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-[#071b3a] transition hover:border-[#071b3a] hover:bg-[#071b3a] hover:text-white"
          >
            View all properties
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-64 animate-pulse bg-slate-200" />

                <div className="space-y-4 p-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-7 w-4/5 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-[24px] border border-slate-200 bg-[#faf8f3] px-6 py-14 text-center">
            <h3 className="font-serif text-2xl font-bold text-[#071b3a]">
              No properties available
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              New properties are added regularly. Please check again soon or
              contact our team for upcoming availability.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-xl bg-[#071b3a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102b55]"
            >
              Contact our team
            </Link>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}