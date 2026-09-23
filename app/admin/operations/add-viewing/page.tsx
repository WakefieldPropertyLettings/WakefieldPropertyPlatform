"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Property = {
  id: number;
  title: string | null;
  address: string | null;
  postcode: string | null;
  status: string | null;
};

type SaveViewingResponse = {
  success?: boolean;
  applicantId?: number;
  viewingId?: string;
  error?: string;
};

export default function AddViewingPage() {
  const router = useRouter();

  /*
   * Browser Supabase is used only to READ the
   * property list for the dropdown.
   *
   * All CRM writes go through the protected
   * /api/admin/viewings server endpoint.
   */
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [properties, setProperties] = useState<
    Property[]
  >([]);

  const [propertyId, setPropertyId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [viewingDate, setViewingDate] =
    useState("");
  const [viewingTime, setViewingTime] =
    useState("");
  const [comments, setComments] = useState("");

  const [
    loadingProperties,
    setLoadingProperties,
  ] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * Load properties for the dropdown.
   */
  useEffect(() => {
    async function loadProperties() {
      setLoadingProperties(true);

      const { data, error } = await supabase
        .from("properties")
        .select(
          "id,title,address,postcode,status"
        )
        .order("id", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Property loading error:",
          error
        );

        setError(
          "Unable to load properties."
        );
      } else {
        setProperties(
          (data as Property[]) ?? []
        );
      }

      setLoadingProperties(false);
    }

    void loadProperties();
  }, [supabase]);

  /*
   * Save through the protected server API.
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (
      !propertyId ||
      !fullName.trim() ||
      !phone.trim() ||
      !viewingDate ||
      !viewingTime
    ) {
      setError(
        "Property, name, phone, date and time are required."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/viewings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            propertyId:
              Number(propertyId),

            fullName:
              fullName.trim(),

            phone:
              phone.trim(),

            viewingDate,

            viewingTime,

            comments:
              comments.trim(),
          }),
        }
      );

      const data =
        (await response.json()) as SaveViewingResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Unable to save viewing."
        );
      }

      /*
       * Return to Operations after
       * successful save.
       */
      router.push(
        "/admin/operations"
      );

      router.refresh();
    } catch (err) {
      console.error(
        "Add viewing error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save viewing."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#071b3a] px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <Link
            href="/admin/operations"
            className="text-sm font-semibold text-[#efad3f] hover:underline"
          >
            ← Back to Operations
          </Link>

          <h1 className="mt-5 text-4xl font-bold">
            Add Viewing
          </h1>

          <p className="mt-3 text-white/60">
            Add a viewing after you have
            screened the applicant.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
        >

          {/* PROPERTY */}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Property
            </label>

            <select
              required
              value={propertyId}
              onChange={(event) =>
                setPropertyId(
                  event.target.value
                )
              }
              disabled={
                loadingProperties ||
                saving
              }
              className="w-full rounded-xl border border-white/10 bg-[#0b2447] px-4 py-3 text-white outline-none"
            >
              <option value="">
                {loadingProperties
                  ? "Loading properties..."
                  : "Select property"}
              </option>

              {properties.map(
                (property) => (
                  <option
                    key={property.id}
                    value={property.id}
                  >
                    #{property.id} —{" "}
                    {property.title ||
                      "Property"}
                    {property.postcode
                      ? ` — ${property.postcode}`
                      : ""}
                  </option>
                )
              )}
            </select>
          </div>

          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Name
            </label>

            <input
              required
              value={fullName}
              onChange={(event) =>
                setFullName(
                  event.target.value
                )
              }
              disabled={saving}
              placeholder="Applicant name"
              autoComplete="name"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/40"
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Phone Number
            </label>

            <input
              required
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(
                  event.target.value
                )
              }
              disabled={saving}
              placeholder="Phone number"
              autoComplete="tel"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/40"
            />
          </div>

          {/* DATE AND TIME */}

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Viewing Date
              </label>

              <input
                required
                type="date"
                value={viewingDate}
                onChange={(event) =>
                  setViewingDate(
                    event.target.value
                  )
                }
                disabled={saving}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Viewing Time
              </label>

              <input
                required
                type="time"
                value={viewingTime}
                onChange={(event) =>
                  setViewingTime(
                    event.target.value
                  )
                }
                disabled={saving}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </div>

          </div>

          {/* COMMENTS */}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Comments
            </label>

            <textarea
              rows={5}
              value={comments}
              onChange={(event) =>
                setComments(
                  event.target.value
                )
              }
              disabled={saving}
              placeholder="Screening notes, viewing instructions or other comments..."
              className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/40"
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-red-100">
              {error}
            </div>
          )}

          {/* ACTIONS */}

          <div className="flex flex-wrap gap-3">

            <button
              type="submit"
              disabled={
                saving ||
                loadingProperties
              }
              className="rounded-xl bg-[#efad3f] px-6 py-3 font-bold text-[#071b3a] transition hover:bg-[#f6bb54] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Viewing"}
            </button>

            <Link
              href="/admin/operations"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </Link>

          </div>

        </form>
      </div>
    </main>
  );
}