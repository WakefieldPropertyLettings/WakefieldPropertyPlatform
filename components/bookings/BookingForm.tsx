"use client";

import { useState } from "react";

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-10 shadow-lg text-center">
        <h2 className="text-4xl font-bold text-green-600">
          Booking Confirmed 🎉
        </h2>

        <p className="mt-5 text-gray-600">
          Thank you.
          Your viewing request has been received.

          Our team will contact you shortly.
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
        placeholder="Full Name"
        className="w-full rounded-lg border p-4"
      />

      <input
        required
        type="email"
        placeholder="Email"
        className="w-full rounded-lg border p-4"
      />

      <input
        required
        placeholder="Phone Number"
        className="w-full rounded-lg border p-4"
      />

      <input
        required
        type="date"
        className="w-full rounded-lg border p-4"
      />

      <select
        required
        className="w-full rounded-lg border p-4"
      >
        <option>Select Time</option>
        <option>09:00 AM</option>
        <option>10:00 AM</option>
        <option>11:00 AM</option>
        <option>01:00 PM</option>
        <option>02:00 PM</option>
        <option>03:00 PM</option>
      </select>

      <textarea
        rows={4}
        placeholder="Comments"
        className="w-full rounded-lg border p-4"
      />

      <button
        className="w-full rounded-xl bg-[#D4AF37] py-4 font-bold text-[#0B1F3A]"
      >
        Confirm Booking
      </button>
    </form>
  );
}