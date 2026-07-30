import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Users,
  ShieldCheck,
  Clock3,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Professional Service",
    description:
      "We believe in honest advice, clear communication and a professional service from your first enquiry through to moving in.",
  },
  {
    icon: Clock3,
    title: "Fast Response",
    description:
      "Applications and enquiries are handled quickly to help you move forward without unnecessary delays.",
  },
  {
    icon: Building2,
    title: "Quality Properties",
    description:
      "We carefully select and manage rental properties across Wakefield and the surrounding areas.",
  },
  {
    icon: Users,
    title: "People First",
    description:
      "Whether you are a tenant or landlord, our goal is to make renting simple, transparent and stress-free.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#faf8f3]">

      {/* Hero */}
      <section className="bg-[#071b3a] px-6 py-24 text-white">
        <div className="mx-auto grid max-w-[1220px] items-center gap-16 lg:grid-cols-2">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#efad3f]">
              About Wakefield Property Lettings
            </p>

            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight lg:text-6xl">
              Local expertise.
              <br />
              Modern lettings.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
              Wakefield Property Lettings helps tenants find quality
              accommodation and supports landlords with professional property
              management. Our focus is simple: make renting straightforward,
              efficient and stress-free.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/properties"
                className="rounded-xl bg-[#efad3f] px-8 py-4 font-semibold text-[#071b3a]"
              >
                View Properties
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white/20 px-8 py-4 font-semibold"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
              alt="Office"
              width={700}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-[1220px] gap-14 lg:grid-cols-2">

          <Image
            src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80"
            alt="Property"
            width={700}
            height={700}
            className="rounded-[30px] object-cover shadow-xl"
          />

          <div className="flex flex-col justify-center">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9992d]">
              Our Story
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold text-[#071b3a]">
              Helping people feel at home.
            </h2>

            <p className="mt-7 text-lg leading-8 text-slate-600">
              We understand that renting a property is more than signing a
              tenancy agreement. It is about finding somewhere safe,
              comfortable and convenient.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Whether you are moving within the UK, relocating for work or
              study, or searching for your next home, our experienced team
              provides practical support every step of the way.
            </p>

          </div>

        </div>
      </section>

      {/* Statistics */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-[1220px] gap-8 md:grid-cols-4">

          {[
            ["500+", "Homes Let"],
            ["4.9", "Client Rating"],
            ["24/7", "AI Support"],
            ["100%", "Professional Service"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-3xl border bg-white p-8 text-center shadow-sm"
            >
              <h3 className="text-5xl font-bold text-[#071b3a]">
                {number}
              </h3>

              <p className="mt-3 text-slate-600">
                {label}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-[1220px]">

          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9992d]">
              Why Choose Us
            </p>

            <h2 className="mt-4 font-serif text-5xl font-bold text-[#071b3a]">
              Built around our clients.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">

            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-[28px] bg-white p-8 shadow-lg transition hover:-translate-y-2"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f1e5] text-[#071b3a]">
                  <value.icon size={28} />
                </div>

                <h3 className="text-2xl font-bold text-[#071b3a]">
                  {value.title}
                </h3>

                <p className="mt-5 leading-8 text-slate-600">
                  {value.description}
                </p>
              </article>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#071b3a] px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-4xl">

          <h2 className="font-serif text-5xl font-bold">
            Ready to find your next home?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Browse our latest properties or speak with our friendly team today.
          </p>

          <Link
            href="/properties"
            className="mt-10 inline-flex items-center gap-3 rounded-xl bg-[#efad3f] px-8 py-4 font-semibold text-[#071b3a]"
          >
            Browse Properties
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

    </main>
  );
}