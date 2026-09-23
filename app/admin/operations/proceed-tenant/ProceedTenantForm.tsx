"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Applicant = {
  id: number;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  property_id: number | null;
};

type Property = {
  id: number;
  title: string | null;
  address: string | null;
  location: string | null;
  postcode: string | null;
  price: string | null;
  deposit: string | null;
};

type SaveResponse = {
  success?: boolean;
  tenancyId?: number;
  prorataRent?: number;
  prorataDays?: number;
  nextPaymentDate?: string;
  error?: string;
};

function numericValue(
  value: string | null | undefined
) {
  if (!value) {
    return "";
  }

  /*
   * Handles values such as:
   * 430
   * £430
   * £430.00
   * 430 pcm
   */
  const cleaned = value
    .replace(/,/g, "")
    .match(/\d+(?:\.\d+)?/);

  return cleaned?.[0] ?? "";
}

function calculatePreview(
  rentValue: string,
  moveDateValue: string,
  paymentDayValue: string
) {
  const rent = Number(rentValue);
  const paymentDay = Number(paymentDayValue);

  if (
    !Number.isFinite(rent) ||
    rent <= 0 ||
    !moveDateValue ||
    ![1, 15].includes(paymentDay)
  ) {
    return null;
  }

  const [
    year,
    month,
    calendarDay,
  ] = moveDateValue
    .split("-")
    .map(Number);

  if (
    !year ||
    !month ||
    !calendarDay
  ) {
    return null;
  }

  // Every rental month is treated as 30 days.
  const rentalDay =
    Math.min(calendarDay, 30);

  const dailyRate =
    rent / 30;

  // No pro-rata if moving in on the normal payment date.
  if (calendarDay === paymentDay) {
    return {
      days: 0,
      amount: 0,
      nextPaymentDate: moveDateValue,
    };
  }

  let days = 0;
  let nextYear = year;
  let nextMonth = month;

  if (paymentDay === 1) {
    days =
      31 - rentalDay;

    nextMonth += 1;
  } else {
    if (rentalDay < 15) {
      days =
        15 - rentalDay;
    } else {
      days =
        (31 - rentalDay) + 14;

      nextMonth += 1;
    }
  }

  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }

  days =
    Math.max(
      0,
      Math.min(days, 29)
    );

  const amount =
    Math.round(
      dailyRate *
        days *
        100
    ) / 100;

  const nextPaymentDate =
    `${nextYear}-${String(
      nextMonth
    ).padStart(2, "0")}-${String(
      paymentDay
    ).padStart(2, "0")}`;

  return {
    days,
    amount,
    nextPaymentDate,
  };
}

export default function ProceedTenantForm() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const applicantId =
    searchParams.get(
      "applicantId"
    );

  const propertyId =
    searchParams.get(
      "propertyId"
    );

  const viewingId =
    searchParams.get(
      "viewingId"
    );

  const [
    applicant,
    setApplicant,
  ] =
    useState<Applicant | null>(
      null
    );

  const [
    property,
    setProperty,
  ] =
    useState<Property | null>(
      null
    );

  const [
    tenancyStart,
    setTenancyStart,
  ] =
    useState("");

  const [
    monthlyRent,
    setMonthlyRent,
  ] =
    useState("");

  const [
    deposit,
    setDeposit,
  ] =
    useState("");

  const [
    minimumTermMonths,
    setMinimumTermMonths,
  ] =
    useState("3");

  const [
    noticePeriodMonths,
    setNoticePeriodMonths,
  ] =
    useState("1");

  const [
    rentPaymentDay,
    setRentPaymentDay,
  ] =
    useState("1");

  const [
    applicationLink,
    setApplicationLink,
  ] =
    useState("");

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function loadData() {
      if (
        !applicantId ||
        !propertyId
      ) {
        setError(
          "Applicant or property information is missing."
        );

        setLoading(false);

        return;
      }

      const [
        applicantResult,
        propertyResult,
      ] =
        await Promise.all([
          supabase
            .from(
              "applicants"
            )
            .select(
              "id,full_name,email,phone,property_id"
            )
            .eq(
              "id",
              Number(
                applicantId
              )
            )
            .single(),

          supabase
            .from(
              "properties"
            )
            .select(
              "id,title,address,location,postcode,price,deposit"
            )
            .eq(
              "id",
              Number(
                propertyId
              )
            )
            .single(),
        ]);

      if (
        applicantResult.error ||
        !applicantResult.data
      ) {
        console.error(
          "Applicant loading error:",
          applicantResult.error
        );

        setError(
          "Unable to load applicant."
        );

        setLoading(false);

        return;
      }

      if (
        propertyResult.error ||
        !propertyResult.data
      ) {
        console.error(
          "Property loading error:",
          propertyResult.error
        );

        setError(
          "Unable to load property."
        );

        setLoading(false);

        return;
      }

      const loadedApplicant =
        applicantResult.data as Applicant;

      const loadedProperty =
        propertyResult.data as Property;

      setApplicant(
        loadedApplicant
      );

      setProperty(
        loadedProperty
      );

      setMonthlyRent(
        numericValue(
          loadedProperty.price
        )
      );

      setDeposit(
        numericValue(
          loadedProperty.deposit
        )
      );

      setLoading(false);
    }

    void loadData();
  }, [
    applicantId,
    propertyId,
    supabase,
  ]);

  const preview =
    calculatePreview(
      monthlyRent,
      tenancyStart,
      rentPaymentDay
    );

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (
      !applicantId ||
      !propertyId
    ) {
      setError(
        "Applicant or property information is missing."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/admin/tenancies",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                applicantId:
                  Number(
                    applicantId
                  ),

                propertyId:
                  Number(
                    propertyId
                  ),

                viewingId:
                  viewingId || "",

                tenancyStart,

                monthlyRent:
                  Number(
                    monthlyRent
                  ),

                deposit:
                  Number(
                    deposit
                  ),

                minimumTermMonths:
                  Number(
                    minimumTermMonths
                  ),

                noticePeriodMonths:
                  Number(
                    noticePeriodMonths
                  ),

                rentPaymentDay:
                  Number(
                    rentPaymentDay
                  ),

                applicationLink:
                  applicationLink.trim(),

                notes:
                  notes.trim(),
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
            "Unable to save tenancy."
        );
      }

      router.push(
  `/admin/operations/tenant-message?tenancyId=${data.tenancyId}`
);
    } catch (err) {
      console.error(
        "Proceed tenant error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save tenancy."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f6fa] px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-slate-600">
            Loading tenant details...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6fa]">

      <section className="bg-[#071b3a] px-6 pb-12 pt-28 text-white">
        <div className="mx-auto max-w-4xl">

          <Link
            href="/admin/operations"
            className="text-sm font-bold text-[#efad3f] hover:underline"
          >
            â† Back to Operations
          </Link>

          <h1 className="mt-5 font-serif text-4xl font-bold sm:text-5xl">
            Proceed with Tenant
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Confirm the agreed tenancy
            details after the applicant has
            successfully completed the
            viewing and screening process.
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Applicant
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#071b3a]">
              {applicant?.full_name ||
                "Applicant"}
            </h2>

            {applicant?.phone && (
              <p className="mt-2 text-slate-600">
                {applicant.phone}
              </p>
            )}

            {applicant?.email && (
              <p className="mt-1 text-slate-600">
                {applicant.email}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Property
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#071b3a]">
              {property?.title ||
                "Property"}
            </h2>

            <p className="mt-2 text-slate-600">
              {[
                property?.address,
                property?.location,
                property?.postcode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-7 rounded-3xl bg-white p-6 shadow-sm sm:p-8"
        >

          <div className="grid gap-6 md:grid-cols-2">

            <Field
              label="Moving Date"
            >
              <input
                required
                type="date"
                value={
                  tenancyStart
                }
                onChange={(
                  event
                ) =>
                  setTenancyStart(
                    event.target
                      .value
                  )
                }
                className="input"
              />
            </Field>

            <Field
              label="Monthly Rent (£)"
            >
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={
                  monthlyRent
                }
                onChange={(
                  event
                ) =>
                  setMonthlyRent(
                    event.target
                      .value
                  )
                }
                className="input"
              />
            </Field>

            <Field
              label="Deposit (£)"
            >
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={deposit}
                onChange={(
                  event
                ) =>
                  setDeposit(
                    event.target
                      .value
                  )
                }
                className="input"
              />
            </Field>

            <Field
              label="Minimum Term (months)"
            >
              <input
                required
                type="number"
                min="1"
                step="1"
                value={
                  minimumTermMonths
                }
                onChange={(
                  event
                ) =>
                  setMinimumTermMonths(
                    event.target
                      .value
                  )
                }
                className="input"
              />
            </Field>

            <Field
              label="Notice Period (months)"
            >
              <input
                required
                type="number"
                min="1"
                step="1"
                value={
                  noticePeriodMonths
                }
                onChange={(
                  event
                ) =>
                  setNoticePeriodMonths(
                    event.target
                      .value
                  )
                }
                className="input"
              />
            </Field>

            <Field
              label="Regular Rent Payment Date"
            >
              <select
                required
                value={
                  rentPaymentDay
                }
                onChange={(
                  event
                ) =>
                  setRentPaymentDay(
                    event.target
                      .value
                  )
                }
                className="input"
              >
                <option value="1">
                  1st of every month
                </option>

                <option value="15">
                  15th of every month
                </option>
              </select>
            </Field>

          </div>

          <Field
            label="Tenant Application Link"
          >
            <input
              type="url"
              value={
                applicationLink
              }
              onChange={(
                event
              ) =>
                setApplicationLink(
                  event.target
                    .value
                )
              }
              placeholder="https://..."
              className="input"
            />
          </Field>

          <Field
            label="Internal Notes"
          >
            <textarea
              rows={4}
              value={notes}
              onChange={(
                event
              ) =>
                setNotes(
                  event.target
                    .value
                )
              }
              placeholder="Any additional internal notes..."
              className="input resize-none"
            />
          </Field>

          {preview && (
            <div className="rounded-2xl border border-[#efad3f]/30 bg-[#fff9ed] p-6">

              <p className="text-xs font-bold uppercase tracking-wider text-[#a46d12]">
                Pro-rata Preview
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">

                <PreviewItem
                  label="Daily Rate"
                  value={`£${(
                    Number(
                      monthlyRent
                    ) / 30
                  ).toFixed(2)}`}
                />

                <PreviewItem
                  label="Pro-rata Days"
                  value={String(
                    preview.days
                  )}
                />

                <PreviewItem
                  label="Pro-rata Rent"
                  value={`£${preview.amount.toFixed(
                    2
                  )}`}
                />

              </div>

              <p className="mt-4 text-sm text-slate-600">
                Calculated using monthly
                rent ÷ 30 until the next
                regular payment date of{" "}
                <strong>
                  {
                    preview.nextPaymentDate
                  }
                </strong>
                .
              </p>

            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#efad3f] px-6 py-3 font-bold text-[#071b3a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Tenant Details"}
            </button>

            <Link
              href="/admin/operations"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-[#071b3a]"
            >
              Cancel
            </Link>

          </div>

        </form>

      </section>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #cbd5e1;
          padding: 0.75rem 1rem;
          color: #071b3a;
          outline: none;
          background: white;
        }

        .input:focus {
          border-color: #efad3f;
          box-shadow: 0 0 0 3px
            rgba(239, 173, 63, 0.15);
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
      <label className="mb-2 block text-sm font-bold text-[#071b3a]">
        {label}
      </label>

      {children}
    </div>
  );
}

function PreviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-[#071b3a]">
        {value}
      </p>
    </div>
  );
}

