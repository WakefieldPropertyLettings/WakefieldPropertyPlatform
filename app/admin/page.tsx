"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { createClient } from "@/lib/supabase/client";

type Property = {
  id: number;
  title: string;
  location: string | null;
  price: string | number | null;
};

export default function AdminPage() {
  const supabase = useMemo(() => createClient(), []);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, location, price")
        .order("id", { ascending: false });

      if (error) {
        throw error;
      }

      setProperties((data as Property[]) ?? []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);

      setProperties([]);
      setErrorMessage(
        "Unable to load properties. Please refresh the page and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteProperty(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This action cannot be undone."
    );

    if (!confirmed || deletingId !== null) {
      return;
    }

    setDeletingId(id);
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setProperties((currentProperties) =>
        currentProperties.filter((property) => property.id !== id)
      );

      window.alert("Property deleted successfully.");
    } catch (error) {
      console.error("Failed to delete property:", error);

      setErrorMessage(
        "The property could not be deleted. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function formatPrice(price: string | number | null) {
    if (price === null || price === "") {
      return "Not provided";
    }

    const numericPrice =
      typeof price === "number"
        ? price
        : Number(price);

    if (Number.isNaN(numericPrice)) {
      return `£${price}`;
    }

    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-[#0B1F3A] py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
              Admin dashboard
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Property Management
            </h1>

            <p className="mt-2 text-gray-300">
              Add, edit and manage all properties listed on the website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AdminLogoutButton />

            <Link
              href="/admin/add-property"
              className="rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B1F3A] transition hover:bg-[#e4c45c]"
            >
              + Add Property
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          {loading ? (
            <div className="p-10 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0B1F3A]" />

              <p className="mt-4 text-slate-600">
                Loading properties...
              </p>
            </div>
          ) : properties.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-xl font-bold text-[#0B1F3A]">
                No properties added
              </h2>

              <p className="mt-2 text-gray-600">
                Add your first property to display it on the website.
              </p>

              <Link
                href="/admin/add-property"
                className="mt-6 inline-flex rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-[#0B1F3A] transition hover:bg-[#e4c45c]"
              >
                Add Property
              </Link>
            </div>
          ) : (
            <table className="w-full min-w-[750px]">
              <thead className="bg-[#0B1F3A] text-white">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Property</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="p-4 text-slate-600">
                      {property.id}
                    </td>

                    <td className="p-4 font-semibold text-[#0B1F3A]">
                      {property.title}
                    </td>

                    <td className="p-4 text-slate-700">
                      {property.location || "Not provided"}
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {formatPrice(property.price)}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <Link
                          href={`/admin/edit-property/${property.id}`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => deleteProperty(property.id)}
                          disabled={deletingId !== null}
                          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === property.id
                            ? "Deleting..."
                            : "Delete"}
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