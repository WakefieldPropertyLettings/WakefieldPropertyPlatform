"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

type Property = {
  id: number;
  title: string | null;
  address: string | null;
  postcode: string | null;
  status: string | null;
};

type Viewing = {
  id: string;
  property_id: number | null;
  applicant_id: number | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  viewing_date: string | null;
  viewing_time: string | null;
  status: string | null;
  google_calendar_event_id:
    | string
    | null;
  notes: string | null;
  created_at: string | null;
};

type Applicant = {
  id: number;
  reference: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  property_id: number | null;
  status: string | null;
  notes: string | null;
};

type Activity = {
  id: number;
  activity_type: string;
  title: string;
  description: string | null;
  source: string;
  created_at: string;
};

type LoadResponse = {
  success?: boolean;
  viewing?: Viewing;
  applicant?: Applicant | null;
  properties?: Property[];
  activity?: Activity[];
  error?: string;
};

type SaveResponse = {
  success?: boolean;
  viewingId?: string;
  applicantId?: number;
  calendarEventId?: string | null;
  calendarUpdateRequired?: boolean;
  error?: string;
};

function formatDateTime(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

export default function ViewingPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const router =
    useRouter();

  const viewingId =
    params.id;

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [applicant, setApplicant] =
    useState<Applicant | null>(
      null
    );

  const [activity, setActivity] =
    useState<Activity[]>([]);

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

  const [
    calendarEventId,
    setCalendarEventId,
  ] = useState<string | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function loadViewing() {
    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          `/api/admin/viewings/${viewingId}`,
          {
            cache: "no-store",
          }
        );

      const data =
        (await response.json()) as LoadResponse;

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

      const viewing =
        data.viewing;

      setFullName(
        viewing.full_name ??
          data.applicant?.full_name ??
          ""
      );

      setPhone(
        viewing.phone ??
          data.applicant?.phone ??
          ""
      );

      setEmail(
        viewing.email ??
          data.applicant?.email ??
          ""
      );

      setPropertyId(
        viewing.property_id
          ? String(
              viewing.property_id
            )
          : ""
      );

      setViewingDate(
        viewing.viewing_date ??
          ""
      );

      setViewingTime(
        viewing.viewing_time
          ?.slice(0, 5) ??
          ""
      );

      setStatus(
        viewing.status ??
          "booked"
      );

      setNotes(
        viewing.notes ?? ""
      );

      setCalendarEventId(
        viewing.google_calendar_event_id
      );

      setApplicant(
        data.applicant ?? null
      );

      setProperties(
        data.properties ?? []
      );

      setActivity(
        data.activity ?? []
      );
    } catch (err) {
      console.error(
        "Viewing loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load viewing."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (viewingId) {
      void loadViewing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const response =
        await fetch(
          `/api/admin/viewings/${viewingId}`,
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
              propertyId,
              viewingDate,
              viewingTime,
              status,
              notes,
            }),
          }
        );

      const data =
        (await response.json()) as SaveResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Unable to save viewing."
        );
      }

      if (
        data.calendarUpdateRequired
      ) {
        setSuccess(
          "Viewing saved. This record has a Google Calendar event linked to it; Calendar synchronization still needs to be connected."
        );
      } else {
        setSuccess(
          "Viewing saved successfully."
        );
      }

      await loadViewing();

      router.refresh();
    } catch (err) {
      console.error(
        "Viewing save error:",
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6fa] px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-600">
            Loading viewing...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6fa]">
      <section className="bg-[#071b3a] px-6 pb-10 pt-28 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/admin/operations"
            className="text-sm font-semibold text-[#efad3f] hover:underline"
          >
            ← Back to Operations
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#efad3f]">
                Viewing Record
              </p>

              <h1 className="mt-2 font-serif text-4xl font-bold">
                {fullName ||
                  "Viewing"}
              </h1>

              <p className="mt-3 text-slate-300">
                View and edit the complete
                viewing record.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {applicant &&
                propertyId && (
                  <Link
                    href={`/admin/operations/proceed-tenant?applicantId=${applicant.id}&propertyId=${propertyId}&viewingId=${viewingId}`}
                    className="rounded-xl bg-[#efad3f] px-5 py-3 font-bold text-[#071b3a]"
                  >
                    Proceed with Tenant
                  </Link>
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-3xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#071b3a]">
              Viewing Details
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Changes are saved to the
              viewing and linked applicant.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Applicant Name">
              <input
                required
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value
                  )
                }
                className="input"
              />
            </Field>

            <Field label="Phone Number">
              <input
                required
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                className="input"
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                className="input"
              />
            </Field>

            <Field label="Status">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="input"
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
          </div>

          <Field label="Property">
            <select
              required
              value={propertyId}
              onChange={(event) =>
                setPropertyId(
                  event.target.value
                )
              }
              className="input"
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
                      property.address ||
                      `Property ${property.id}`}
                    {property.postcode
                      ? ` - ${property.postcode}`
                      : ""}
                  </option>
                )
              )}
            </select>
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Viewing Date">
              <input
                required
                type="date"
                value={viewingDate}
                onChange={(event) =>
                  setViewingDate(
                    event.target.value
                  )
                }
                className="input"
              />
            </Field>

            <Field label="Viewing Time">
              <input
                required
                type="time"
                value={viewingTime}
                onChange={(event) =>
                  setViewingTime(
                    event.target.value
                  )
                }
                className="input"
              />
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              rows={6}
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              className="input"
              placeholder="Viewing notes, requirements, follow-up information..."
            />
          </Field>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800">
              {success}
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#071b3a] px-6 py-3 font-bold text-white disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <Link
              href="/admin/operations"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
            >
              Cancel
            </Link>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#071b3a]">
              Record
            </h2>

            <dl className="mt-5 space-y-4 text-sm">
              <Info
                label="Viewing ID"
                value={viewingId}
              />

              <Info
                label="Applicant Reference"
                value={
                  applicant?.reference ||
                  "Not assigned"
                }
              />

              <Info
                label="Applicant Status"
                value={
                  applicant?.status ||
                  "Not set"
                }
              />

              <Info
                label="Google Calendar"
                value={
                  calendarEventId
                    ? "Calendar event linked"
                    : "No Calendar event linked"
                }
              />
            </dl>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#071b3a]">
              Activity History
            </h2>

            {activity.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No activity recorded yet.
              </p>
            ) : (
              <div className="mt-5 space-y-5">
                {activity.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="border-l-2 border-[#efad3f] pl-4"
                    >
                      <p className="font-semibold text-[#071b3a]">
                        {item.title}
                      </p>

                      {item.description && (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDateTime(
                          item.created_at
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </aside>
      </section>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 0.75rem;
          padding: 0.75rem;
          outline: none;
          background: white;
          color: #0f172a;
        }

        .input:focus {
          border-color: #efad3f;
          box-shadow: 0 0 0 1px #efad3f;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-semibold text-[#071b3a]">
        {label}
      </label>

      {children}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </dt>

      <dd className="mt-1 break-words font-medium text-slate-700">
        {value}
      </dd>
    </div>
  );
}