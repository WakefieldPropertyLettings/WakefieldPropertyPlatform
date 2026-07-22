import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="mb-4 text-center text-5xl font-bold text-[#0B1F3A]">
          Contact Wakefield Property Lettings
        </h1>

        <p className="mb-12 text-center text-lg text-gray-600">
          We're here to help landlords, tenants and applicants.
        </p>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Contact Information */}

          <div className="rounded-2xl bg-white p-10 shadow">

            <h2 className="mb-8 text-3xl font-bold text-[#0B1F3A]">
              Contact Information
            </h2>

            <div className="space-y-5 text-lg">

              <p>
                📍 Wakefield, West Yorkshire
              </p>

              <p>
                📞 01924 000000
              </p>

              <p>
                ✉️ admin@wakefieldpropertylettings.co.uk
              </p>

              <p>
                🕒 Monday – Saturday
              </p>

            </div>

            <div className="mt-10 h-80 rounded-xl bg-gray-300 flex items-center justify-center">
              Google Maps (Coming Soon)
            </div>

          </div>

          {/* Contact Options */}

          <div className="rounded-2xl bg-white p-10 shadow">

            <h2 className="mb-8 text-3xl font-bold text-[#0B1F3A]">
              How can we help?
            </h2>

            <div className="grid gap-5">

              <Link
                href="/contact/tenant"
                className="rounded-xl bg-[#0B1F3A] p-6 text-center text-white hover:opacity-90"
              >
                Tenant Enquiry
              </Link>

              <Link
                href="/contact/landlord"
                className="rounded-xl bg-[#D4AF37] p-6 text-center font-bold text-[#0B1F3A]"
              >
                Landlord Enquiry
              </Link>

              <Link
                href="/contact/maintenance"
                className="rounded-xl border-2 border-[#0B1F3A] p-6 text-center"
              >
                Report Maintenance
              </Link>

              <Link
                href="/contact/general"
                className="rounded-xl bg-green-600 p-6 text-center text-white"
              >
                General Enquiry
              </Link>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}