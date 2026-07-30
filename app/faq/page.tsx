"use client";

import Link from "next/link";
import { ChevronDown, Globe2, MessageCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How soon can I move in?",
    answer:
      "Once we have received the required documents and completed the necessary checks, an application can sometimes be processed in as little as two hours. The exact move-in time will depend on the property being available, successful checks, signed paperwork and any required payment.",
  },
  {
    question: "What documents do I need to rent a property?",
    answer:
      "We normally need proof of identity, proof of your current address, evidence of income and the information required to complete reference checks. We may also request a previous landlord reference where applicable. Our team will tell you exactly what is needed for your application.",
  },
  {
    question: "I do not have a UK rental history. Can I still apply?",
    answer:
      "Yes. We understand that some applicants may be renting in the UK for the first time. Please submit an enquiry and one of our team will discuss the available options and the alternative information that may support your application.",
  },
  {
    question: "I am not currently in the UK. Can I arrange a viewing?",
    answer:
      "Yes. Remote viewings may be available, allowing you to view a property from anywhere in the world. Contact our team and we will confirm whether a live video viewing or recorded property tour is available.",
  },
  {
    question: "Do you offer viewings outside normal office hours?",
    answer:
      "Yes, evening or out-of-hours viewings may be available by arrangement. Availability will depend on the property and the appointment schedule, so please contact us with your preferred date and time.",
  },
  {
    question: "Are your rooms and properties furnished?",
    answer:
      "Many of our rooms and rental properties are fully furnished with modern furniture. The facilities provided can vary between properties, so please check the individual property listing or ask our team before applying.",
  },
  {
    question: "Are bills included in the rent?",
    answer:
      "Many of our room rentals include household bills within one regular rental payment. This may include services such as gas, electricity, water and internet. Please check the property listing, as the bills included may vary and some properties may be offered without bills included.",
  },
  {
    question: "Where are your properties located?",
    answer:
      "Our properties are located across Wakefield and surrounding areas. Many are within convenient reach of train stations, bus routes, supermarkets, shops, workplaces and other local amenities.",
  },
  {
    question: "How much deposit do I need to pay?",
    answer:
      "We aim to offer low and manageable deposits wherever possible. The deposit amount depends on the individual property and tenancy. The exact amount will always be explained before you agree to proceed.",
  },
  {
    question: "What is the minimum rental period?",
    answer:
      "Some properties may be available for flexible stays from as little as one month. Minimum tenancy periods vary, so please speak to our team about your required move-in date and how long you would like to stay.",
  },
  {
    question: "Can two people rent the same room or property?",
    answer:
      "Some rooms and properties may be suitable for two occupants or designed for one person only. Please speak to our team so we can help you find accommodation suitable for both applicants.",
  },
  {
    question: "Do you offer rooms in shared houses?",
    answer:
      "Yes. We offer rooms in shared homes as well as self-contained properties. Many shared homes include furnished communal areas and household bills, unless the property listing states otherwise.",
  },
  {
    question:
      "Can international students and work visa holders apply?",
    answer:
      "Yes. Applications are welcome from eligible applicants, including international students and people living or working in the UK on a valid visa. Every application is considered individually and remains subject to identity, right-to-rent, affordability and reference checks.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <main className="bg-[#faf8f3]">
      <section className="bg-[#071b3a] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1220px] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#efad3f]">
            Help and information
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Frequently asked questions
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Straightforward answers about applications, viewings, deposits,
            documents and moving into one of our properties.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1220px] gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <aside>
            <div className="sticky top-28 rounded-[30px] bg-[#071b3a] p-8 text-white shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#efad3f] text-[#071b3a]">
                <MessageCircle size={27} />
              </div>

              <h2 className="mt-7 font-serif text-3xl font-bold">
                Still have a question?
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Every application is different. Speak to our team for advice
                based on your circumstances and the property you are interested
                in.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex rounded-xl bg-[#efad3f] px-6 py-3.5 font-semibold text-[#071b3a] transition hover:bg-[#f5bd5c]"
              >
                Contact our team
              </Link>

              <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-7">
                <Globe2
                  size={22}
                  className="mt-0.5 shrink-0 text-[#efad3f]"
                />

                <p className="text-sm leading-6 text-slate-300">
                  Remote viewings may be available for applicants currently
                  living outside Wakefield or outside the UK.
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <article
                  key={faq.question}
                  className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:border-[#efad3f]/60"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left sm:px-8"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-bold text-[#071b3a] sm:text-lg">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen
                          ? "bg-[#efad3f] text-[#071b3a]"
                          : "bg-[#f7f1e5] text-[#071b3a]"
                      }`}
                    >
                      <ChevronDown
                        size={20}
                        className={`transition duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-6 pb-7 pt-5 sm:px-8">
                      <p className="leading-8 text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto flex max-w-[1220px] flex-col items-start justify-between gap-8 rounded-[30px] border border-slate-200 bg-[#f7f1e5] p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c98b25]">
              Flexible application support
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold text-[#071b3a]">
              Renting in Wakefield made straightforward
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              We welcome enquiries from local applicants, professionals,
              students and people relocating to Wakefield. Remote viewings and
              flexible rental options may be available.
            </p>
          </div>

          <Link
            href="/eligibility"
            className="shrink-0 rounded-xl bg-[#071b3a] px-7 py-4 font-semibold text-white transition hover:bg-[#102b55]"
          >
            Start your application
          </Link>
        </div>
      </section>
    </main>
  );
}