import Link from "next/link";
import {
  CheckCircle2,
  Contrast,
  Eye,
  Keyboard,
  Mail,
  MonitorSmartphone,
  MousePointer2,
  Volume2,
  ZoomIn,
} from "lucide-react";

export const metadata = {
  title: "Accessibility Statement | Wakefield Property Lettings",
  description:
    "Accessibility information for the Wakefield Property Lettings Ltd website.",
};

const accessibilityFeatures = [
  {
    icon: MonitorSmartphone,
    title: "Responsive design",
    description:
      "The website is designed to work across desktop computers, tablets and mobile devices.",
  },
  {
    icon: Keyboard,
    title: "Keyboard navigation",
    description:
      "We aim to make navigation, links, forms and interactive controls usable with a keyboard.",
  },
  {
    icon: Contrast,
    title: "Clear colour contrast",
    description:
      "We use clear text, backgrounds and visual contrast to improve readability.",
  },
  {
    icon: ZoomIn,
    title: "Browser zoom",
    description:
      "Users should be able to increase text and page size using their browser or device settings.",
  },
  {
    icon: Eye,
    title: "Alternative text",
    description:
      "We aim to provide meaningful alternative text for important images.",
  },
  {
    icon: Volume2,
    title: "Assistive technology",
    description:
      "We aim to structure content so that it can be understood using common screen-reader technology.",
  },
];

export default function AccessibilityPage() {
  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="bg-[#071b3a] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#efad3f]">
            Inclusive Access
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Accessibility Statement
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            We want as many people as possible to be able to use the Wakefield
            Property Lettings website and access the information and services
            available through it.
          </p>

          <p className="mt-6 text-sm text-white/65">
            Last updated: 27 July 2026
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Commitment */}
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                <MousePointer2 size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#071b3a]">
                  Our accessibility commitment
                </h2>

                <div className="mt-5 space-y-4 leading-7 text-slate-600">
                  <p>
                    WAKEFIELD PROPERTY LETTINGS LTD is committed to making its
                    website accessible and straightforward to use.
                  </p>

                  <p>
                    We aim to present information using clear language,
                    consistent navigation, readable text and layouts that adapt
                    to different screen sizes.
                  </p>

                  <p>
                    Accessibility is an ongoing process. As the website develops,
                    we will continue to review and improve its content and
                    functionality.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Features */}
          <div className="mt-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#efad3f]">
              Website experience
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#071b3a]">
              How we support accessibility
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {accessibilityFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-[#071b3a]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Users should be able to */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              You should be able to
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Navigate the main pages using a keyboard",
                "Zoom and enlarge content using browser settings",
                "Use the website on mobile, tablet and desktop devices",
                "Understand page headings and link descriptions",
                "Contact us when an online service is difficult to use",
                "Request information in a reasonable alternative format",
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

          {/* Known limitations */}
          <article className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Known limitations
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-700">
              <p>
                We are continuing to assess the website and cannot currently
                guarantee that every page, document, third-party service or
                older piece of content is fully accessible.
              </p>

              <p>
                Some property photographs, maps, embedded services or documents
                supplied by third parties may have accessibility limitations
                outside our direct control.
              </p>

              <p>
                Please contact us if you encounter a specific issue. Where
                reasonably possible, we will provide the information in another
                suitable format.
              </p>
            </div>
          </article>

          {/* Reporting an issue */}
          <article className="mt-8 rounded-3xl bg-[#071b3a] p-7 text-white shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <Mail size={29} className="mt-1 shrink-0 text-[#efad3f]" />

              <div>
                <h2 className="text-2xl font-bold">
                  Report an accessibility problem
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-white/80">
                  Tell us which page or feature caused a problem, what device or
                  browser you were using and what assistance or alternative
                  format you require.
                </p>

                <div className="mt-6 space-y-2 text-white/80">
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:admin@wakefieldpropertylettings.co.uk?subject=Website%20Accessibility"
                      className="font-semibold text-white underline underline-offset-4"
                    >
                      admin@wakefieldpropertylettings.co.uk
                    </a>
                  </p>

                  <p>
                    Telephone:{" "}
                    <a
                      href="tel:07438647424"
                      className="font-semibold text-white underline underline-offset-4"
                    >
                      07438 647424
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Alternative formats */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Alternative formats and assistance
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>
                If you cannot access information published on this website,
                contact us and explain the format you require.
              </p>

              <p>
                We will consider reasonable requests for information in a
                clearer, larger, written or otherwise accessible format.
              </p>

              <p>
                Response times may depend on the amount of information requested
                and whether third-party documents must be adapted.
              </p>
            </div>
          </article>

          {/* Preparation */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Preparation of this statement
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>
                This statement was prepared on 27 July 2026.
              </p>

              <p>
                The website is reviewed internally as new pages and features are
                introduced. This statement may be updated following further
                accessibility testing.
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

            <Link
              href="/complaints"
              className="rounded-full border border-[#071b3a] px-6 py-3 font-semibold text-[#071b3a] transition hover:bg-[#071b3a] hover:text-white"
            >
              Complaints procedure
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}