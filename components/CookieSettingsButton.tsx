"use client";

export default function CookieSettingsButton() {
  function openCookieSettings() {
    localStorage.removeItem("wpl-cookie-consent");
    localStorage.removeItem("wpl-cookie-consent-date");
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="text-left text-sm text-slate-300 transition hover:text-white"
    >
      Cookie Settings
    </button>
  );
}