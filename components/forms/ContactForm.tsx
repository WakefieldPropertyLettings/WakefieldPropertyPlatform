"use client";

import { useState } from "react";

type Props = {
  title: string;
  description: string;
};

export default function ContactForm({
  title,
  description,
}: Props) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
        <h2 className="text-4xl font-bold text-green-600">
          Thank You!
        </h2>

        <p className="mt-5 text-gray-600">
          Your enquiry has been received successfully.

          A member of Wakefield Property Lettings will
          contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-10 shadow-xl space-y-6"
    >
      <h1 className="text-4xl font-bold text-[#0B1F3A]">
        {title}
      </h1>

      <p className="text-gray-600">
        {description}
      </p>

      <input
        required
        placeholder="Full Name"
        className="w-full rounded-xl border p-4"
      />

      <input
        required
        type="email"
        placeholder="Email Address"
        className="w-full rounded-xl border p-4"
      />

      <input
        required
        placeholder="Phone Number"
        className="w-full rounded-xl border p-4"
      />

      <textarea
        rows={6}
        required
        placeholder="Your Message"
        className="w-full rounded-xl border p-4"
      />

      <button
        className="w-full rounded-xl bg-[#D4AF37] py-4 font-bold text-[#0B1F3A] hover:opacity-90"
      >
        Send Enquiry
      </button>
    </form>
  );
}