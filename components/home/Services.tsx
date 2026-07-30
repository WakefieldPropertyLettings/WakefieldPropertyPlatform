import Link from "next/link";
import {
  Building2,
  Home,
  Briefcase,
  Wrench,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    title: "Property Lettings",
    description:
      "Find quality houses, apartments and rooms throughout Wakefield with professional support from viewing to move-in.",
    icon: Home,
  },
  {
    title: "Property Management",
    description:
      "Complete management service including inspections, compliance, maintenance and rent collection.",
    icon: Building2,
  },
  {
    title: "Landlord Services",
    description:
      "Helping landlords maximise rental income while protecting their investment and reducing stress.",
    icon: Briefcase,
  },
  {
    title: "Maintenance",
    description:
      "Fast maintenance reporting with trusted local contractors and regular property care.",
    icon: Wrench,
  },
  {
    title: "Tenant Support",
    description:
      "Friendly support before, during and after your tenancy whenever you need assistance.",
    icon: LifeBuoy,
  },
];

export default function Services() {
  return (
    <section className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-[1220px]">

        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d69d35]">
              What we do
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#071b3a] sm:text-5xl">
              Property services
              <br />
              tailored for everyone.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Whether you're looking to rent a home, let your property or need
              professional management, our experienced team is here to help.
            </p>

          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#071b3a] px-6 py-3 font-semibold text-[#071b3a] transition hover:bg-[#071b3a] hover:text-white"
          >
            Speak with us
            <ArrowRight size={18} />
          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {services.map((service) => (
            <article
              key={service.title}
              className="group rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#efad3f] hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f1e5] text-[#071b3a] transition group-hover:bg-[#efad3f]">
                <service.icon size={30} />
              </div>

              <h3 className="text-2xl font-bold text-[#071b3a]">
                {service.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {service.description}
              </p>

              <div className="mt-8 flex items-center gap-2 font-semibold text-[#071b3a] transition group-hover:text-[#c98b25]">
                Learn more
                <ArrowRight size={18} />
              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}