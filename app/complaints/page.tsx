 import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock3,
  FileSearch,
  Mail,
  MessageSquareWarning,
  Phone,
  Scale,
  Send,
} from "lucide-react";

export const metadata = {
  title: "Complaints Procedure | Wakefield Property Lettings",
  description:
    "Information about how to make a complaint to Wakefield Property Lettings Ltd and how we will investigate and respond.",
};

const complaintSteps = [
  {
    number: "01",
    icon: Send,
    title: "Submit your complaint",
    description:
      "Please contact us by email, telephone or post. Explain what happened, when it happened, the property concerned and how you would like the matter to be resolved.",
  },
  {
    number: "02",
    icon: Clock3,
    title: "Acknowledgement",
    description:
      "We aim to acknowledge your complaint within three working days and confirm who will be responsible for reviewing it.",
  },
  {
    number: "03",
    icon: FileSearch,
    title: "Investigation",
    description:
      "We will review the information supplied, examine relevant records and may contact you if further information is required.",
  },
  {
    number: "04",
    icon: MessageSquareWarning,
    title: "Written response",
    description:
      "We aim to provide a written response within 15 working days. If additional time is required, we will explain the reason and provide an updated timescale.",
  },
  
];

export default function ComplaintsPage() {
  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="bg-[#071b3a] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#efad3f]">
            Customer Care
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Complaints Procedure
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            We are committed to providing a professional and reliable service.
            When something goes wrong, we want to know so that we can investigate
            it fairly and work towards an appropriate resolution.
          </p>

          <p className="mt-6 text-sm text-white/65">
            Last updated: 27 July 2026
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Introduction */}
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                <MessageSquareWarning size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#071b3a]">
                  Our commitment
                </h2>

                <div className="mt-5 space-y-4 leading-7 text-slate-600">
                  <p>
                    WAKEFIELD PROPERTY LETTINGS LTD takes complaints seriously
                    and aims to deal with them consistently, fairly and without
                    unnecessary delay.
                  </p>

                  <p>
                    Making a complaint will not affect the standard of service
                    you receive from us.
                  </p>

                  <p>
                    We recommend submitting your complaint as soon as reasonably
                    possible so that the matter can be investigated effectively.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* What to include */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Information to include
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              To help us investigate your complaint, please provide as much of
              the following information as possible:
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Your full name and contact details",
                "The address of the property concerned",
                "A clear description of your complaint",
                "Relevant dates and names",
                "Copies of supporting documents or messages",
                "The outcome you would like us to consider",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <p className="font-medium leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Procedure */}
          <div className="mt-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#efad3f]">
              Our process
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#071b3a]">
              How we handle complaints
            </h2>

            <div className="mt-8 space-y-5">
              {complaintSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-4 sm:w-32 sm:shrink-0">
                        <span className="text-3xl font-bold text-[#efad3f]">
                          {step.number}
                        </span>

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                          <Icon size={21} />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-[#071b3a]">
                          {step.title}
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Important clarification */}
          <article className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Emergency repairs and urgent safety concerns
            </h2>

            <p className="mt-5 leading-7 text-slate-700">
              This complaints procedure should not be used to report an
              immediate danger, suspected gas leak, fire, crime or other
              emergency. Contact the appropriate emergency service first.
            </p>

            <p className="mt-4 leading-7 text-slate-700">
              Property repairs should normally be submitted through our{" "}
              <Link
                href="/report-issue"
                className="font-semibold text-[#071b3a] underline underline-offset-4"
              >
                Report an Issue
              </Link>{" "}
              page.
            </p>
          </article>

          {/* Contact details */}
          <article className="mt-8 rounded-3xl bg-[#071b3a] p-7 text-white shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold">
              Submit a complaint
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-white/80">
              Please mark written correspondence clearly as “Formal Complaint”.
            </p>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-5">
                <Mail className="text-[#efad3f]" size={24} />

                <h3 className="mt-4 font-bold">Email</h3>

                <a
                  href="mailto:admin@wakefieldpropertylettings.co.uk?subject=Formal%20Complaint"
                  className="mt-2 block break-words text-sm leading-6 text-white/80 underline underline-offset-4"
                >
                  admin@wakefieldpropertylettings.co.uk
                </a>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <Phone className="text-[#efad3f]" size={24} />

                <h3 className="mt-4 font-bold">Telephone</h3>

                <a
                  href="tel:07438647424"
                  className="mt-2 block text-sm text-white/80 underline underline-offset-4"
                >
                  07438 647424
                </a>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <Building2 className="text-[#efad3f]" size={24} />

                <h3 className="mt-4 font-bold">Post or in person</h3>

                <p className="mt-2 text-sm leading-6 text-white/80">
                  219 Kirkgate
                  <br />
                  Wakefield
                  <br />
                  WF1 1JG
                </p>
              </div>
            </div>
          </article>

          {/* Company information */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Company information
            </h2>

            <div className="mt-5 leading-7 text-slate-600">
              <p className="font-semibold text-[#071b3a]">
                WAKEFIELD PROPERTY LETTINGS LTD
              </p>

              <p>Company number: 16866876</p>

              <p className="mt-3">
                Registered office:
                <br />
                219 Kirkgate
                <br />
                Wakefield
                <br />
                England
                <br />
                WF1 1JG
              </p>
            </div>
          </article>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[#071b3a] px-6 py-3 font-semibold text-white transition hover:bg-[#102c55]"
            >
              Contact us
            </Link>

            
          </div>
        </div>
      </section>
    </main>
  );
}