"use client";

import {
  useState,
} from "react";
import {
  useRouter,
} from "next/navigation";

type Props = {
  applicantId: number;
  propertyId: number;
  viewingId: string;
};

export default function RejectApplicantButton({
  applicantId,
  propertyId,
  viewingId,
}: Props) {
  const router =
    useRouter();

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function rejectApplicant() {
    const confirmed =
      window.confirm(
        "Reject this applicant? They will be marked as rejected and no message will be sent."
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/admin/reject-viewing",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                applicantId,
                propertyId,
                viewingId,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Unable to reject applicant."
        );
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reject applicant."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-start md:items-end">

      <button
        type="button"
        onClick={
          rejectApplicant
        }
        disabled={saving}
        className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
          ? "Rejecting..."
          : "Reject Applicant"}
      </button>

      {error && (
        <p className="mt-2 max-w-48 text-xs text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}