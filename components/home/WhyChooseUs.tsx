import {
  ShieldCheck,
  Wrench,
  Users,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Professional Property Management",
    description:
      "We manage every property with professionalism, transparency and care.",
  },
  {
    icon: Wrench,
    title: "Fast Maintenance Support",
    description:
      "Quick response to maintenance requests to keep tenants and landlords happy.",
  },
  {
    icon: Users,
    title: "Trusted Local Team",
    description:
      "Our experienced team understands the Wakefield property market.",
  },
  {
    icon: Clock,
    title: "Simple Rental Process",
    description:
      "A smooth and stress-free letting process from enquiry to move-in.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Why Choose Wakefield Property Letting Ltd
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Trusted by landlords and tenants across Wakefield.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <feature.icon
                size={48}
                className="mb-6 text-blue-900"
              />

              <h3 className="mb-3 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}