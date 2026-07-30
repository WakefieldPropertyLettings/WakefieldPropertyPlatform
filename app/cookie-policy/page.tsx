import Link from "next/link";
import {
  BarChart3,
  Cookie,
  Database,
  ExternalLink,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Cookie Policy | Wakefield Property Lettings",
  description:
    "Information about how Wakefield Property Lettings Ltd uses cookies and similar technologies.",
};

const cookieTypes = [
  {
    icon: ShieldCheck,
    title: "Strictly necessary cookies",
    description:
      "These cookies are required for the website to operate securely and correctly. They may support navigation, security, form protection, session management and cookie-preference storage.",
    consent: "These cookies do not normally require consent.",
  },
  {
    icon: Settings,
    title: "Preference cookies",
    description:
      "These cookies remember choices you make, such as language, display settings or cookie preferences, so the website can provide a more personalised experience.",
    consent:
      "Where these cookies are not essential, they will only be used after you provide consent.",
  },
  {
    icon: BarChart3,
    title: "Analytics cookies",
    description:
      "Analytics cookies help us understand how visitors use the website, which pages are visited and whether users experience technical problems.",
    consent:
      "Analytics cookies will only be used where you have provided consent.",
  },
  {
    icon: ExternalLink,
    title: "Third-party cookies",
    description:
      "Some website features may be supplied by third parties, such as maps, embedded media, analytics, property portals or social-media links. Those providers may place their own cookies when their services are used.",
    consent:
      "Where required, third-party cookies will be blocked until consent is provided.",
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="bg-[#071b3a] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#efad3f]">
            Legal information
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Cookie Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            This policy explains how WAKEFIELD PROPERTY LETTINGS LTD uses
            cookies and similar technologies on this website.
          </p>

          <p className="mt-6 text-sm text-white/65">
            Last updated: 27 July 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* What cookies are */}
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                <Cookie size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#071b3a]">
                  What are cookies?
                </h2>

                <div className="mt-5 space-y-4 leading-7 text-slate-600">
                  <p>
                    Cookies are small text files stored on your computer,
                    tablet or mobile device when you visit a website.
                  </p>

                  <p>
                    Cookies can help websites operate correctly, remember your
                    preferences, maintain security and understand how visitors
                    use the website.
                  </p>

                  <p>
                    Similar technologies, such as local storage, pixels and
                    tracking identifiers, may perform comparable functions.
                    References to cookies in this policy include these similar
                    technologies where appropriate.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* How we use cookies */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                <Database size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#071b3a]">
                  How we use cookies
                </h2>

                <div className="mt-5 space-y-4 leading-7 text-slate-600">
                  <p>We may use cookies and similar technologies to:</p>

                  <ul className="list-disc space-y-2 pl-6">
                    <li>Operate and secure the website.</li>
                    <li>Remember your cookie preferences.</li>
                    <li>Support online forms and property enquiries.</li>
                    <li>
                      Identify and resolve website errors or performance
                      problems.
                    </li>
                    <li>
                      Understand how visitors navigate and interact with the
                      website.
                    </li>
                    <li>
                      Improve the design, content and functionality of the
                      website.
                    </li>
                    <li>
                      Enable approved third-party services, where applicable.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </article>

          {/* Cookie categories */}
          <div className="mt-8 space-y-8">
            {cookieTypes.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                      <Icon size={23} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-[#071b3a]">
                        {item.title}
                      </h2>

                      <p className="mt-5 leading-7 text-slate-600">
                        {item.description}
                      </p>

                      <p className="mt-4 font-medium leading-7 text-slate-700">
                        {item.consent}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Current cookies */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Cookies currently used
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              The exact cookies used may change as the website is developed or
              additional services are introduced.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-4 font-semibold text-[#071b3a]">
                      Cookie or storage item
                    </th>
                    <th className="px-4 py-4 font-semibold text-[#071b3a]">
                      Provider
                    </th>
                    <th className="px-4 py-4 font-semibold text-[#071b3a]">
                      Purpose
                    </th>
                    <th className="px-4 py-4 font-semibold text-[#071b3a]">
                      Duration
                    </th>
                  </tr>
                </thead>

                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-200">
                    <td className="px-4 py-4">Cookie preference</td>
                    <td className="px-4 py-4">
                      Wakefield Property Lettings
                    </td>
                    <td className="px-4 py-4">
                      Remembers whether you accepted or rejected optional
                      cookies.
                    </td>
                    <td className="px-4 py-4">
                      Up to 12 months
                    </td>
                  </tr>

                  <tr className="border-b border-slate-200">
                    <td className="px-4 py-4">Essential session storage</td>
                    <td className="px-4 py-4">
                      Wakefield Property Lettings
                    </td>
                    <td className="px-4 py-4">
                      Supports website security and temporary form or session
                      functionality.
                    </td>
                    <td className="px-4 py-4">
                      Session
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-4">Supabase authentication data</td>
                    <td className="px-4 py-4">Supabase</td>
                    <td className="px-4 py-4">
                      May support secure authentication or session management
                      where protected website features are used.
                    </td>
                    <td className="px-4 py-4">
                      Session or as configured
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              This table must be updated if analytics, advertising, mapping,
              live chat, embedded video or other third-party tools are added.
            </p>
          </article>

          {/* Consent */}
          <article className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Your cookie choices
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-700">
              <p>
                Strictly necessary cookies may be placed because they are
                required for the website to function.
              </p>

              <p>
                Optional analytics, preference or third-party cookies should
                only be placed after you have provided consent through the
                website cookie banner.
              </p>

              <p>
                You should be able to accept optional cookies, reject them or
                change your preferences later.
              </p>
            </div>
          </article>

          {/* Browser settings */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Managing cookies through your browser
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>
                Most browsers allow you to view, delete or block cookies
                through their privacy or security settings.
              </p>

              <p>
                Blocking strictly necessary cookies may prevent parts of the
                website from operating correctly.
              </p>

              <p>
                Browser settings do not always remove information saved using
                other technologies such as local storage, so you may need to
                clear website data separately.
              </p>
            </div>
          </article>

          {/* Changes */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Changes to this policy
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              We may update this Cookie Policy when our website, technology,
              services or legal obligations change. The latest version will
              always be published on this page with an updated revision date.
            </p>
          </article>

          {/* Contact */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Contact information
            </h2>

            <div className="mt-5 leading-7 text-slate-600">
              <p className="font-semibold text-[#071b3a]">
                WAKEFIELD PROPERTY LETTINGS LTD
              </p>

              <p className="mt-2">
                Company number: 16866876
              </p>

              <p className="mt-2">
                Registered office: 219 Kirkgate, Wakefield, England, WF1 1JG
              </p>

              <p className="mt-2">
                Email:{" "}
                <a
                  href="mailto:admin@wakefieldpropertylettings.co.uk"
                  className="font-medium text-[#071b3a] underline underline-offset-4"
                >
                  admin@wakefieldpropertylettings.co.uk
                </a>
              </p>

              <p className="mt-2">
                Telephone:{" "}
                <a
                  href="tel:07438647424"
                  className="font-medium text-[#071b3a] underline underline-offset-4"
                >
                  07438 647424
                </a>
              </p>
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/privacy-policy"
              className="rounded-full bg-[#071b3a] px-6 py-3 font-semibold text-white transition hover:bg-[#102c55]"
            >
              Read our Privacy Policy
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-[#071b3a] px-6 py-3 font-semibold text-[#071b3a] transition hover:bg-[#071b3a] hover:text-white"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}