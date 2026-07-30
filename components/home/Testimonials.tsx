import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Tenant",
    initials: "SJ",
    review:
      "The whole rental process was smooth and professional. The team kept me informed throughout and made moving into my new home completely stress-free.",
  },
  {
    name: "David Wilson",
    role: "Landlord",
    initials: "DW",
    review:
      "Excellent property management service. They found reliable tenants quickly, communicate clearly and take care of everything professionally.",
  },
  {
    name: "Emma Roberts",
    role: "Tenant",
    initials: "ER",
    review:
      "Fast maintenance response and excellent communication. I always feel supported and know exactly who to contact when I need help.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#071b3a] px-5 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-[1220px]">
        <div className="mb-16 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#efad3f]">
            Client experiences
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Trusted by tenants
            <br />
            and landlords.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Our clients value clear communication, reliable support and a
            professional service from the first enquiry onwards.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="relative flex h-full flex-col rounded-[28px] border border-white/10 bg-white/[0.07] p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#efad3f]/50 hover:bg-white/[0.1]"
            >
              <div className="absolute right-7 top-7 text-[#efad3f]/30">
                <Quote size={44} strokeWidth={1.5} />
              </div>

              <div
                className="flex gap-1 text-[#efad3f]"
                aria-label="5 out of 5 stars"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              <blockquote className="mt-7 flex-1 text-base leading-8 text-white/85">
                “{item.review}”
              </blockquote>

              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#efad3f] text-sm font-bold text-[#071b3a]">
                  {item.initials}
                </div>

                <div>
                  <p className="font-semibold text-white">{item.name}</p>

                  <p className="mt-1 text-sm text-white/60">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-5 rounded-[24px] border border-white/10 bg-white/[0.05] px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-bold">
              Rated highly by our clients
            </p>

            <p className="mt-2 text-sm text-white/65">
              Professional property services across Wakefield and surrounding
              areas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 text-[#efad3f]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={19}
                  fill="currentColor"
                  strokeWidth={1.5}
                />
              ))}
            </div>

            <span className="font-semibold text-white">4.9 / 5</span>
          </div>
        </div>
      </div>
    </section>
  );
}