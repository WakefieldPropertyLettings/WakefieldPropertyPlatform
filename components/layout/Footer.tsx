export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold text-[#D4AF37]">
              Wakefield Property Lettings
            </h2>

            <p className="mt-4 text-gray-300">
              Professional property lettings and management
              across Wakefield and West Yorkshire.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Company</h3>

            <ul className="mt-4 space-y-2 text-gray-300">
              <li>About</li>
              <li>Properties</li>
              <li>Landlords</li>
              <li>Tenants</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold">Services</h3>

            <ul className="mt-4 space-y-2 text-gray-300">
              <li>Property Management</li>
              <li>Guaranteed Rent</li>
              <li>Maintenance</li>
              <li>Book Viewing</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold">Contact</h3>

            <ul className="mt-4 space-y-2 text-gray-300">
              <li>Wakefield</li>
              <li>West Yorkshire</li>
              <li>info@wakefieldpropertylettings.co.uk</li>
              <li>01924 XXX XXX</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-6 text-center text-gray-400">
          © 2026 Wakefield Property Lettings. All rights reserved.
        </div>
      </div>
    </footer>
  );
}