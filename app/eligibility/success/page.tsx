import Link from "next/link";

export default function EligibilitySuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-16">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl sm:p-12">
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
          One of our property consultants will review your information and
          contact you shortly regarding the next steps.
        </p>

        <div className="mt-8 rounded-2xl bg-[#f8fafc] p-5 text-sm leading-6 text-gray-600">
          Please keep an eye on your email and phone for any updates from
          Wakefield Property Lettings.
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/properties"
            className="rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B1F3A] transition hover:opacity-90"
          >
            View Properties
          </Link>

          <Link
            href="/"
            className="rounded-xl border-2 border-[#0B1F3A] px-8 py-4 font-bold text-[#0B1F3A] transition hover:bg-[#0B1F3A] hover:text-white"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}