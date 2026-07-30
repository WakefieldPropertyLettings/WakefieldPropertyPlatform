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
      "Every property is managed with complete transparency, regular inspections and dedicated landlord support.",
  },
  {
    icon: Wrench,
    title: "Fast Maintenance",
    description:
      "Maintenance issues are handled quickly using trusted local contractors and digital reporting.",
  },
  {
    icon: Users,
    title: "Experienced Local Team",
    description:
      "Our Wakefield team understands the local rental market and helps tenants and landlords every day.",
  },
  {
    icon: Clock,
    title: "Simple Lettings Process",
    description:
      "From viewing to moving in, we make renting straightforward with clear communication at every stage.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#faf8f3] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-[1220px]">

        <div className="mb-16 max-w-3xl">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d69d35]">
            Why choose us
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#071b3a] sm:text-5xl">
            Property experts
            <br />
            you can trust.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            We combine local expertise with modern technology to deliver an
            outstanding experience for landlords and tenants throughout
            Wakefield.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2">

          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[28px] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#efad3f] text-[#071b3a]">
                <feature.icon size={30} strokeWidth={2} />
              </div>

              <h3 className="text-2xl font-bold text-[#071b3a]">
                {feature.title}
              </h3>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {feature.description}
              </p>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}