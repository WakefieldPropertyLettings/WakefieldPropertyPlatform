"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
};

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProperties(data || []);
    }

    setLoading(false);
  }

  async function deleteProperty(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete property.");
      return;
    }

    alert("Property deleted successfully!");

    fetchProperties();
  }

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}

      <section className="bg-[#0B1F3A] py-14 text-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">

          <div>

            <h1 className="text-4xl font-bold">
              Property Management
            </h1>

            <p className="mt-2 text-gray-300">
              Manage all your available properties.
            </p>

          </div>

          <Link
            href="/admin/add-property"
            className="rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B1F3A] hover:opacity-90"
          >
            + Add Property
          </Link>

        </div>

      </section>

      {/* Property List */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          {loading ? (

            <p className="p-8 text-center">
              Loading properties...
            </p>

          ) : (

            <table className="w-full">

              <thead className="bg-[#0B1F3A] text-white">

                <tr>

                  <th className="p-4 text-left">
                    ID
                  </th>

                  <th className="p-4 text-left">
                    Property
                  </th>

                  <th className="p-4 text-left">
                    Location
                  </th>

                  <th className="p-4 text-left">
                    Price
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {properties.map((property) => (

                  <tr
                    key={property.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">
                      {property.id}
                    </td>

                    <td className="p-4 font-semibold">
                      {property.title}
                    </td>

                    <td className="p-4">
                      {property.location}
                    </td>

                    <td className="p-4">
                      {property.price}
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <Link
                          href={`/admin/edit-property/${property.id}`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </section>

    </main>
  );
}