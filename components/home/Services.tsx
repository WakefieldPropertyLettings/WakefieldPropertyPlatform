import {
  Building2,
  Home,
  Briefcase,
  Wrench,
  LifeBuoy,
} from "lucide-react";

const services = [
  {
    title: "Property Lettings",
    icon: Home,
  },
  {
    title: "Property Management",
    icon: Building2,
  },
  {
    title: "Landlord Services",
    icon: Briefcase,
  },
  {
    title: "Maintenance",
    icon: Wrench,
  },
  {
    title: "Tenant Support",
    icon: LifeBuoy,
  },
];

export default function Services() {
  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-12 text-center text-4xl font-bold">
          Our Services
        </h2>

        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">

          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-2xl border bg-white p-8 text-center shadow-md transition hover:shadow-xl"
            >
              <service.icon
                size={42}
                className="mx-auto mb-5 text-blue-900"
              />

              <h3 className="font-semibold">
                {service.title}
              </h3>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}