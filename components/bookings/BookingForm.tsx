"use client";

import { FormEvent, useState } from "react";

type BookingResponse = {
  success?: boolean;
  applicantId?: number;
  viewingId?: string;
  error?: string;
};

type BookingFormProps = {
  propertyId: number | null;
};
export default function BookingForm({
  propertyId,
}: BookingFormProps) {  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [viewingDate, setViewingDate] = useState("");
  const [viewingTime, setViewingTime] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  fullName,
  email,
  phone,
  viewingDate,
  viewingTime,
  notes,
  propertyId,
}),
      });

      const data = (await response.json()) as BookingResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to submit your viewing request."
        );
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Booking submission error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your viewing request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
        <h2 className="text-4xl font-bold text-green-600">
          Viewing Request Received
        </h2>

        <p className="mt-5 text-gray-600">
          Thank you. Your viewing request has been received.
          Our team will contact you shortly to confirm the
          appointment.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl bg-white p-10 shadow-lg"
    >
      <h2 className="text-3xl font-bold text-[#0B1F3A]">
        Book Your Viewing
      </h2>

      <input
        required
        value={fullName}
        onChange={(event) =>
          setFullName(event.target.value)
        }
        placeholder="Full Name"
        autoComplete="name"
        className="w-full rounded-lg border p-4"
      />

      <input
        required
        type="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        placeholder="Email"
        autoComplete="email"
        className="w-full rounded-lg border p-4"
      />

      <input
        required
        type="tel"
        value={phone}
        onChange={(event) =>
          setPhone(event.target.value)
        }
        placeholder="Phone Number"
        autoComplete="tel"
        className="w-full rounded-lg border p-4"
      />

      <input
        required
        type="date"
        value={viewingDate}
        onChange={(event) =>
          setViewingDate(event.target.value)
        }
        className="w-full rounded-lg border p-4"
      />

      <select
        required
        value={viewingTime}
        onChange={(event) =>
          setViewingTime(event.target.value)
        }
        className="w-full rounded-lg border p-4"
      >
        <option value="">Select Time</option>
        <option value="09:00">09:00 AM</option>
        <option value="10:00">10:00 AM</option>
        <option value="11:00">11:00 AM</option>
        <option value="13:00">01:00 PM</option>
        <option value="14:00">02:00 PM</option>
        <option value="15:00">03:00 PM</option>
      </select>

      <textarea
        rows={4}
        value={notes}
        onChange={(event) =>
          setNotes(event.target.value)
        }
        placeholder="Comments"
        className="w-full rounded-lg border p-4"
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-[#D4AF37] py-4 font-bold text-[#0B1F3A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? "Sending request..."
          : "Request Viewing"}
      </button>
    </form>
  );
}