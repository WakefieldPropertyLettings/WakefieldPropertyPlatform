"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CookiePreference = "all" | "essential" | "rejected";

const STORAGE_KEY = "wpl-cookie-consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem(STORAGE_KEY);

    if (!savedPreference) {
      setIsVisible(true);
    }
  }, []);

  function savePreference(preference: CookiePreference) {
    localStorage.setItem(STORAGE_KEY, preference);
    localStorage.setItem(
      `${STORAGE_KEY}-date`,
      new Date().toISOString()
    );

    window.dispatchEvent(
      new CustomEvent("cookie-consent-updated", {
        detail: preference,
      })
    );

    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <h2
              id="cookie-consent-title"
              className="text-xl font-bold text-[#071b3a]"
            >
              We value your privacy
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              We use essential cookies to make this website work. With your
              permission, we may also use optional cookies to understand how
              visitors use our website and improve our services. You can accept
              all cookies or continue with essential cookies only.
            </p>

            <Link
              href="/cookie-policy"
              className="mt-3 inline-block text-sm font-semibold text-[#071b3a] underline underline-offset-4 hover:text-[#efad3f]"
            >
              Read our Cookie Policy
            </Link>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col xl:flex-row">
            <button
              type="button"
              onClick={() => savePreference("essential")}
              className="min-h-[46px] rounded-xl border border-[#071b3a] bg-white px-5 py-3 text-sm font-semibold text-[#071b3a] transition hover:bg-slate-50"
            >
              Essential cookies only
            </button>

            <button
              type="button"
              onClick={() => savePreference("rejected")}
              className="min-h-[46px] rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Reject non-essential
            </button>

            <button
              type="button"
              onClick={() => savePreference("all")}
              className="min-h-[46px] rounded-xl bg-[#071b3a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#efad3f] hover:text-[#071b3a]"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}