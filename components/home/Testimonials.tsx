const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Tenant",
    review:
      "The whole rental process was smooth and professional. The team kept me informed throughout.",
  },
  {
    name: "David Wilson",
    role: "Landlord",
    review:
      "Excellent property management service. They found reliable tenants quickly and handle everything.",
  },
  {
    name: "Emma Roberts",
    role: "Tenant",
    review:
      "Fast maintenance response and excellent communication.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#0B1F3A]">
            What Our Clients Say
          </h2>

          <p className="mt-4 text-gray-600">
            Trusted by landlords and tenants across Wakefield.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-8 shadow-lg"
            >
              <div className="text-yellow-500 text-2xl">
                ★★★★★
              </div>

              <p className="mt-6 italic text-gray-600">
                "{item.review}"
              </p>

              <div className="mt-8">
                <h3 className="font-bold">
                  {item.name}
                </h3>

                <p className="text-gray-500">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}