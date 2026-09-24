"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Property = {
  id: number;
  title: string | null;
  address?: string | null;
  location?: string | null;
  postcode?: string | null;
};

type Applicant = {
  id: number;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

type Viewing = {
  id: string;
  applicant_id?: number | null;
  property_id?: number | null;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  viewing_date?: string | null;
  viewing_time?: string | null;
  status?: string | null;
  notes?: string | null;
};

type ApiResponse = {
  success?: boolean;
  error?: string;
  viewing?: Viewing;
  applicant?: Applicant | null;
  properties?: Property[];
};

export default function ViewingEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const viewingId =
    searchParams.get("id") ?? "";

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [applicantId, setApplicantId] =
    useState<number | null>(null);

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [propertyId, setPropertyId] =
    useState("");

  const [viewingDate, setViewingDate] =
    useState("");

  const [viewingTime, setViewingTime] =
    useState("");

  const [status, setStatus] =
    useState("booked");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    async function loadViewing() {
      if (!viewingId) {
        setError("Viewing ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/admin/viewings/${encodeURIComponent(
            viewingId
          )}`,
          {
            cache: "no-store",
          }
        );

        const data =
          (await response.json()) as ApiResponse;

        if (
          !response.ok ||
          !data.success ||
          !data.viewing
        ) {
          throw new Error(
            data.error ||
              "Unable to load viewing."
          );
        }

        const viewing = data.viewing;
        const applicant = data.applicant;

        setApplicantId(
          viewing.applicant_id ?? null
        );

        setFullName(
          viewing.full_name ||
            applicant?.full_name ||
            ""
        );

        setPhone(
          viewing.phone ||
            applicant?.phone ||
            ""
        );

        setEmail(
          viewing.email ||
            applicant?.email ||
            ""
        );

        setPropertyId(
          viewing.property_id
            ? String(viewing.property_id)
            : ""
        );

        setViewingDate(
          viewing.viewing_date ?? ""
        );

        setViewingTime(
          viewing.viewing_time
            ? viewing.viewing_time.slice(0, 5)
            : ""
        );

        setStatus(
          viewing.status || "booked"
        );

        setNotes(
          viewing.notes ?? ""
        );

        setProperties(
          data.properties ?? []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load viewing."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadViewing();
  }, [viewingId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/viewings/${encodeURIComponent(
          viewingId
        )}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            fullName,
            phone,
            email,
            propertyId:
              Number(propertyId),
            viewingDate,
            viewingTime,
            status,
            notes,
          }),
        }
      );

      const data =
        (await response.json()) as ApiResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Unable to save changes."
        );
      }

      setSuccess(
        "Viewing details saved successfully."
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6fa] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          Loading viewing...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6fa] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <Link
            href="/admin/operations"
            className="text-sm font-semibold text-slate-600 hover:text-[#071b3a]"
          >
            ? Back to Operations
          </Link>

          <h1 className="mt-4 text-3xl font-black text-[#071b3a]">
            Viewing Details
          </h1>

          <p className="mt-2 text-slate-600">
            Review and edit the applicant,
            property and viewing information.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

            <h2 className="text-xl font-black text-[#071b3a]">
              Applicant
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <Field label="Full Name">
                <input
                  required
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Mobile Number">
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Email Address">
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Applicant ID">
                <input
                  disabled
                  value={
                    applicantId ?? "Not linked"
                  }
                  className={`${inputClass} bg-slate-100`}
                />
              </Field>

            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

            <h2 className="text-xl font-black text-[#071b3a]">
              Property & Viewing
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <Field label="Property">
                <select
                  required
                  value={propertyId}
                  onChange={(e) =>
                    setPropertyId(
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select property
                  </option>

                  {properties.map(
                    (property) => (
                      <option
                        key={property.id}
                        value={property.id}
                      >
                        {property.title ||
                          `Property ${property.id}`}
                        {property.postcode
                          ? ` — ${property.postcode}`
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="booked">
                    Booked
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                  <option value="no_show">
                    No Show
                  </option>
                </select>
              </Field>

              <Field label="Viewing Date">
                <input
                  required
                  type="date"
                  value={viewingDate}
                  onChange={(e) =>
                    setViewingDate(
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Viewing Time">
                <input
                  required
                  type="time"
                  value={viewingTime}
                  onChange={(e) =>
                    setViewingTime(
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </Field>

            </div>

            <div className="mt-6">
              <Field label="Comments / Notes">
                <textarea
                  rows={5}
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  className={inputClass}
                  placeholder="Viewing notes, applicant comments, requirements..."
                />
              </Field>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#071b3a] px-6 py-3 font-bold text-white transition hover:bg-[#0d2b57] disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

            {applicantId &&
              propertyId && (
                <Link
                  href={`/admin/operations/proceed-tenant?applicantId=${applicantId}&propertyId=${propertyId}&viewingId=${encodeURIComponent(
                    viewingId
                  )}`}
                  className="rounded-xl bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800"
                >
                  Proceed with Tenant
                </Link>
              )}

            <Link
              href="/admin/operations"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700"
            >
              Cancel
            </Link>

          </div>
        </form>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#071b3a] outline-none transition focus:border-[#071b3a] focus:ring-2 focus:ring-[#071b3a]/10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#071b3a]">
        {label}
      </span>

      {children}
    </label>
  );
}
