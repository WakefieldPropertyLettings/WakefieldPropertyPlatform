"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import {
  useSearchParams,
} from "next/navigation";
import { Suspense } from "react";

type MessageData = {
  success?: boolean;
  tenancyId?: number;
  tenantName?: string;
  phone?: string;
  message?: string;
  error?: string;
};

function whatsappNumber(
  value: string
) {
  let number =
    value.replace(/\D/g, "");

  if (number.startsWith("0")) {
    number =
      `44${number.slice(1)}`;
  }

  return number;
}

function TenantMessageContent() {
  const searchParams =
    useSearchParams();

  const tenancyId =
    searchParams.get("tenancyId");

  const [phone, setPhone] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [tenantName, setTenantName] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadMessage() {
      if (!tenancyId) {
        setError(
          "Tenancy ID is missing."
        );
        setLoading(false);
        return;
      }

      try {
        const response =
          await fetch(
            `/api/admin/tenant-message?tenancyId=${encodeURIComponent(
              tenancyId
            )}`
          );

        const data =
          (await response.json()) as MessageData;

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
              "Unable to generate message."
          );
        }

        setPhone(
          data.phone || ""
        );

        setTenantName(
          data.tenantName || ""
        );

        setMessage(
          data.message || ""
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to generate message."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadMessage();
  }, [tenancyId]);

  function openWhatsApp() {
    const number =
      whatsappNumber(phone);

    if (!number) {
      setError(
        "The tenant does not have a phone number."
      );
      return;
    }

    if (!message.trim()) {
      setError(
        "The message is empty."
      );
      return;
    }

    const url =
      `https://wa.me/${number}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (loading) {
    return (
      <p className="text-slate-600">
        Generating tenant message...
      </p>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

        <p className="text-sm font-bold text-slate-500">
          Tenant
        </p>

        <p className="mt-1 text-xl font-bold text-[#071b3a]">
          {tenantName || "Tenant"}
        </p>

        <label className="mt-6 block text-sm font-bold text-[#071b3a]">
          WhatsApp Number
        </label>

        <input
          value={phone}
          onChange={(event) =>
            setPhone(
              event.target.value
            )
          }
          className="mt-2 w-full rounded-xl border border-slate-300 p-3"
          placeholder="07..."
        />

        <label className="mt-6 block text-sm font-bold text-[#071b3a]">
          Review Message
        </label>

        <textarea
          rows={24}
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          className="mt-2 w-full rounded-xl border border-slate-300 p-4 leading-7"
        />

        <div className="mt-6 flex flex-wrap gap-3">

          <button
            type="button"
            onClick={openWhatsApp}
            className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
          >
            Open & Send in WhatsApp
          </button>

          <Link
            href="/admin/operations"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-[#071b3a]"
          >
            Back to Operations
          </Link>

        </div>

        <p className="mt-4 text-sm text-slate-500">
          Review the message above. WhatsApp will
          open with the tenant number and this
          message prepared. You will press Send
          inside WhatsApp.
        </p>

      </div>
    </>
  );
}

export default function TenantMessagePage() {
  return (
    <main className="min-h-screen bg-[#f4f6fa]">

      <section className="bg-[#071b3a] px-6 pb-12 pt-28 text-white">
        <div className="mx-auto max-w-4xl">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#efad3f]">
            Wakefield Property Lettings
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold">
            Tenant Message
          </h1>

          <p className="mt-3 text-slate-300">
            Review the approved tenancy message
            before opening it in WhatsApp.
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Suspense
          fallback={
            <p className="text-slate-600">
              Loading message...
            </p>
          }
        >
          <TenantMessageContent />
        </Suspense>
      </section>

    </main>
  );
}