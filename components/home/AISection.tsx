import Link from "next/link";

function ChatIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

const aiFeatures = [
  {
    title: "AI Chat Assistant",
    description: "Instant answers, 24 hours a day",
    icon: <ChatIcon />,
  },
  {
    title: "AI Receptionist",
    description: "Never miss a property enquiry",
    icon: <PhoneIcon />,
  },
  {
    title: "Tenant Portal",
    description: "Viewings, applications and support",
    icon: <UserIcon />,
  },
  {
    title: "Landlord Portal",
    description: "Live property and rental insights",
    icon: <GridIcon />,
  },
];

export default function AISection() {
  return (
    <section className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-[1220px] gap-12 overflow-hidden rounded-[36px] bg-[#071b3a] px-8 py-14 text-white shadow-2xl lg:grid-cols-[1.05fr_1fr] lg:px-14 lg:py-16">
        <div className="flex flex-col justify-center">
          <span className="mb-6 w-fit rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#efad3f]">
            AI-powered support
          </span>

          <h2 className="max-w-xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
            The future of
            <br />
            property lettings
            <br />
            starts here.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Meet Jasmine, our AI property assistant designed to support tenants,
            landlords and applicants 24 hours a day. Search properties, request
            viewings, ask questions and receive instant assistance.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className="rounded-xl bg-[#efad3f] px-8 py-3.5 font-semibold text-[#071b3a] transition hover:bg-[#f5bd5c]"
            >
              Find a property
            </Link>

            <Link
              href="/about"
              className="rounded-xl border border-white/25 px-8 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:gap-6">
            <div>
              <p className="text-2xl font-bold text-[#efad3f] sm:text-3xl">
                24/7
              </p>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                AI support
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-[#efad3f] sm:text-3xl">
                &lt;30s
              </p>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Response time
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-[#efad3f] sm:text-3xl">
                100%
              </p>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Digital service
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-[#efad3f]/20 blur-3xl" />

          <div className="relative grid gap-4 sm:grid-cols-2">
            {aiFeatures.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.05] p-7 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-[#efad3f]/40 hover:bg-white/[0.08]"
              >
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#efad3f] text-[#071b3a]">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}