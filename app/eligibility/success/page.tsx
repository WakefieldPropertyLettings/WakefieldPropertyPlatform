import Link from "next/link";

export default function EligibilitySuccessPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="max-w-2xl rounded-3xl bg-white p-12 shadow-xl text-center">

        <div className="text-7xl">
          ✅
        </div>

        <h1 className="mt-6 text-4xl font-bold text-[#0B1F3A]">
          Thank You!
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          Your eligibility check has been submitted successfully.
        </p>

        <p className="mt-4 text-lg leading-8 text-gray-600">
          One of our property consultants will review your information and contact you shortly to arrange the next steps.
        </p>

        <Link
          href="/"
          className="mt-10 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B1F3A] hover:opacity-90"
        >
          Return to Homepage
        </Link>

      </div>

    </main>
  );
}