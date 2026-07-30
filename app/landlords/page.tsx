import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Home,
  KeyRound,
  MessageSquareText,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Property Marketing",
    description:
      "We present your property professionally, manage enquiries and help it reach suitable prospective tenants.",
  },
  {
    icon: Users,
    title: "Tenant Enquiries",
    description:
      "Our team responds to enquiries, discusses applicant requirements and helps identify suitable tenants.",
  },
  {
    icon: KeyRound,
    title: "Viewings",
    description:
      "We arrange property viewings, including remote viewings where appropriate, and keep you informed throughout.",
  },
  {
    icon: ClipboardCheck,
    title: "Application Support",
    description:
      "We collect the required information and help coordinate identity, affordability and reference checks.",
  },
  {
    icon: ShieldCheck,
    title: "Clear Communication",
    description:
      "Landlords receive straightforward updates, practical support and clear information during the letting process.",
  },
  {
    icon: Wrench,
    title: "Property Support",
    description:
      "We help manage communication around maintenance issues and tenant requests throughout the tenancy.",
  },
];

const process = [
  {
    number: "01",
    title: "Tell us about your property",
    description:
      "Contact our team with the property address, type, condition and expected availability.",
  },
  {
    number: "02",
    title: "Prepare the property",
    description:
      "We discuss presentation, photographs, rental expectations and the information needed before marketing.",
  },
  {
    number: "03",
    title: "Market and arrange viewings",
    description:
      "We manage enquiries and arrange suitable in-person or remote viewing appointments.",
  },
  {
    number: "04",
    title: "Progress the application",
    description:
      "We support the application process and keep you updated as the tenancy moves forward.",
  },
];

export default function LandlordsPage() {
  return (
    <main className="bg-[#faf8f3]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#071b3a] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#efad3f]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1220px] items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#efad3f]">
              For landlords
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Let your property with confidence
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Wakefield Property Lettings supports landlords with property
              marketing, tenant enquiries, viewings and the application
              process. Our aim is to make letting your property straightforward
              and professionally managed.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#efad3f] px-7 py-4 font-semibold text-[#071b3a] transition hover:bg-[#f5bd5c]"
              >
                Speak to our team
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/properties"
                className="rounded-xl border border-white/20 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                View our properties
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                "Local Wakefield knowledge",
                "Professional enquiries",
                "Clear landlord support",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <BadgeCheck
                    size={20}
                    className="shrink-0 text-[#efad3f]"
                  />
                  <span className="text-sm font-medium text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[32px] border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                alt="Property professional discussing a rental property"
                width={900}
                height={760}
                className="h-[500px] w-full object-cover"
                priority
              />
            </div>

            <div className="absolute -bottom-6 -left-4 max-w-xs rounded-2xl bg-white p-5 text-[#071b3a] shadow-2xl sm:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f1e5]">
                  <Home size={24} />
                </div>

                <div>
                  <p className="font-bold">Professional property support</p>
                  <p className="mt-1 text-sm text-slate-600">
                    From first enquiry to tenancy progression
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1220px] items-center gap-14 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[30px] shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Modern rental property exterior"
              width={900}
              height={720}
              className="h-[500px] w-full object-cover"
            />

            <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-[#071b3a]/90 p-5 text-white backdrop-blur">
              <p className="text-sm font-semibold text-[#efad3f]">
                Local property expertise
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-200">
                Supporting landlords across Wakefield and surrounding areas.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c98b25]">
              A straightforward letting service
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#071b3a] sm:text-5xl">
              Helping landlords move forward with confidence
            </h2>

            <p className="mt-7 text-lg leading-8 text-slate-600">
              Letting a property involves more than advertising a room or home.
              It requires clear communication, organised viewings, suitable
              applicants and a smooth application process.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Our team helps coordinate these stages while keeping landlords
              informed. Whether you own one rental property or a growing
              portfolio, we offer practical support tailored to the property
              and your requirements.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Rooms and shared homes",
                "Self-contained properties",
                "Furnished accommodation",
                "Flexible viewing support",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-white px-4 py-4 shadow-sm"
                >
                  <BadgeCheck size={20} className="text-[#d9992d]" />
                  <span className="font-semibold text-[#071b3a]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1220px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c98b25]">
              How we help
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold text-[#071b3a] sm:text-5xl">
              Support throughout the letting journey
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              A professional service designed to reduce the time and pressure
              involved in letting a property.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="group rounded-[26px] border border-slate-200 bg-[#faf8f3] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#efad3f]/60 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f] transition group-hover:bg-[#efad3f] group-hover:text-[#071b3a]">
                  <service.icon size={27} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-[#071b3a]">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1220px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c98b25]">
                Our process
              </p>

              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#071b3a] sm:text-5xl">
                A clear path from property enquiry to tenancy
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                We keep the process simple, organised and easy to understand
                from the moment you contact us.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#071b3a] px-7 py-4 font-semibold text-white transition hover:bg-[#102b55]"
              >
                Discuss your property
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="space-y-5">
              {process.map((step) => (
                <article
                  key={step.number}
                  className="flex gap-5 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#efad3f] text-lg font-bold text-[#071b3a]">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#071b3a]">
                      {step.title}
                    </h3>

                    <p className="mt-2 leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Communication section */}
      <section className="bg-[#071b3a] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1220px] items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#efad3f]">
              Clear communication
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
              Stay informed throughout the process
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              We understand that landlords want clear updates and practical
              answers. Our team helps coordinate enquiries, viewings and
              applications while keeping communication straightforward.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Updates on enquiries and viewing interest",
                "Clear information about applicant progression",
                "Support with tenant and property communication",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <BadgeCheck size={21} className="text-[#efad3f]" />
                  <span className="text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[30px] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
              alt="Property team discussing landlord services"
              width={900}
              height={700}
              className="h-[460px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto flex max-w-[1220px] flex-col items-start justify-between gap-8 rounded-[32px] bg-[#f1e6d0] p-8 sm:p-10 lg:flex-row lg:items-center lg:p-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[#c98b25]">
              <MessageSquareText size={22} />
              <p className="text-xs font-bold uppercase tracking-[0.18em]">
                Let&apos;s talk
              </p>
            </div>

            <h2 className="mt-4 font-serif text-3xl font-bold text-[#071b3a] sm:text-4xl">
              Have a property you would like to let?
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Speak with Wakefield Property Lettings about your property,
              expected availability and the support you need.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#071b3a] px-7 py-4 font-semibold text-white transition hover:bg-[#102b55]"
          >
            Contact us
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}