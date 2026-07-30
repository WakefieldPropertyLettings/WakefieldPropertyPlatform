import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  Copyright,
  FileText,
  Globe2,
  Home,
  Link2,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Wakefield Property Lettings",
  description:
    "Website terms and conditions for Wakefield Property Lettings Ltd.",
};

const sections = [
  {
    icon: Globe2,
    title: "1. About these terms",
    content: (
      <>
        <p>
          These Terms and Conditions govern your use of the Wakefield Property
          Lettings website.
        </p>

        <p className="mt-4">
          By accessing or using this website, you agree to use it in accordance
          with these terms. If you do not agree with these terms, you should
          stop using the website.
        </p>

        <p className="mt-4">
          These terms apply only to use of the website. Separate terms may
          apply to property viewings, tenancy applications, holding deposits,
          referencing, tenancy agreements, landlord services and property
          management services.
        </p>
      </>
    ),
  },
  {
    icon: Building2,
    title: "2. About us",
    content: (
      <>
        <p>
          This website is operated by WAKEFIELD PROPERTY LETTINGS LTD, a
          company registered in England and Wales.
        </p>

        <div className="mt-5 rounded-2xl bg-slate-50 p-5">
          <p>
            <strong>Company number:</strong> 16866876
          </p>

          <p className="mt-2">
            <strong>Registered office:</strong> 219 Kirkgate, Wakefield,
            England, WF1 1JG
          </p>

          <p className="mt-2">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:admin@wakefieldpropertylettings.co.uk"
              className="font-medium text-[#071b3a] underline underline-offset-4"
            >
              admin@wakefieldpropertylettings.co.uk
            </a>
          </p>

          <p className="mt-2">
            <strong>Telephone:</strong>{" "}
            <a
              href="tel:07438647424"
              className="font-medium text-[#071b3a] underline underline-offset-4"
            >
              07438 647424
            </a>
          </p>
        </div>
      </>
    ),
  },
  {
    icon: Home,
    title: "3. Property information",
    content: (
      <>
        <p>
          Property descriptions, photographs, floor plans, measurements,
          availability, rent figures and other information are provided for
          general guidance.
        </p>

        <p className="mt-4">
          We take reasonable care when preparing property information, but
          details may be supplied by landlords, property owners or other third
          parties and may change without notice.
        </p>

        <p className="mt-4">
          Property information should not be treated as a contractual offer,
          guarantee, survey, valuation or representation that a property is
          suitable for a particular purpose.
        </p>

        <p className="mt-4">
          Prospective tenants should inspect the property and verify any
          information that is important to them before entering into an
          agreement.
        </p>
      </>
    ),
  },
  {
    icon: FileText,
    title: "4. Enquiries, applications and viewings",
    content: (
      <>
        <p>
          Submitting an enquiry, eligibility form, viewing request or tenancy
          application does not guarantee:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>That a viewing will be available.</li>
          <li>That a property will remain available.</li>
          <li>That an application will be accepted.</li>
          <li>That a tenancy will be offered.</li>
          <li>That a landlord will approve an applicant.</li>
        </ul>

        <p className="mt-4">
          Applications may be subject to identity, affordability, referencing,
          right-to-rent and landlord approval checks.
        </p>

        <p className="mt-4">
          A tenancy is not created through this website. A tenancy will only
          arise when the required agreement has been completed and all relevant
          conditions have been satisfied.
        </p>
      </>
    ),
  },
  {
    icon: Scale,
    title: "5. Fees and payments",
    content: (
      <>
        <p>
          Any payment connected with a tenancy will be handled in accordance
          with applicable law and the terms provided to the applicant or
          tenant.
        </p>

        <p className="mt-4">
          Information about tenant fees and permitted payments is available on
          our Fees and Permitted Payments page.
        </p>

        <Link
          href="/fees"
          className="mt-5 inline-flex rounded-full bg-[#071b3a] px-5 py-2.5 font-semibold text-white transition hover:bg-[#102c55]"
        >
          View fees and permitted payments
        </Link>

        <p className="mt-4">
          Do not make a payment unless you have received verified payment
          instructions directly from Wakefield Property Lettings Ltd.
        </p>
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: "6. Acceptable use",
    content: (
      <>
        <p>You must not use this website:</p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>For any unlawful or fraudulent purpose.</li>
          <li>To impersonate another person.</li>
          <li>To submit false, misleading or incomplete information.</li>
          <li>To upload malicious software, harmful code or corrupted files.</li>
          <li>
            To attempt to gain unauthorised access to the website, database,
            server or connected systems.
          </li>
          <li>
            To interfere with the security, performance or availability of the
            website.
          </li>
          <li>
            To copy or collect website content or personal data through
            automated methods without permission.
          </li>
        </ul>

        <p className="mt-4">
          We may restrict or block access where we reasonably believe the
          website is being misused.
        </p>
      </>
    ),
  },
  {
    icon: Copyright,
    title: "7. Intellectual property",
    content: (
      <>
        <p>
          Unless otherwise stated, the website design, branding, written
          content, graphics and other original material are owned by or
          licensed to WAKEFIELD PROPERTY LETTINGS LTD.
        </p>

        <p className="mt-4">
          You may view and print website content for your own personal,
          non-commercial use.
        </p>

        <p className="mt-4">
          You must not reproduce, republish, sell, distribute, modify or
          commercially exploit website content without prior written
          permission.
        </p>

        <p className="mt-4">
          Property photographs, floor plans or descriptions may belong to
          landlords, photographers, property portals or other third parties.
        </p>
      </>
    ),
  },
  {
    icon: Link2,
    title: "8. Third-party websites and services",
    content: (
      <>
        <p>
          This website may contain links to external websites, maps, social
          media platforms, property portals or services operated by third
          parties.
        </p>

        <p className="mt-4">
          External links are provided for convenience. We do not control
          third-party websites and are not responsible for their content,
          availability, security or privacy practices.
        </p>

        <p className="mt-4">
          You should review the terms and privacy information of any external
          service you use.
        </p>
      </>
    ),
  },
  {
    icon: AlertTriangle,
    title: "9. Website availability and liability",
    content: (
      <>
        <p>
          We aim to keep the website accurate, secure and available, but we do
          not guarantee that it will always operate without interruption,
          delay, error or technical problems.
        </p>

        <p className="mt-4">
          We may update, suspend, restrict or withdraw all or part of the
          website where reasonably necessary.
        </p>

        <p className="mt-4">
          Nothing in these terms excludes or limits liability where doing so
          would be unlawful, including liability for death or personal injury
          caused by negligence, fraud or fraudulent misrepresentation.
        </p>

        <p className="mt-4">
          Subject to applicable law, we are not responsible for losses caused
          solely by reliance on general website information, events outside our
          reasonable control, or the acts and omissions of independent third
          parties.
        </p>

        <p className="mt-4">
          Your statutory rights are not affected by these terms.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="bg-[#071b3a] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#efad3f]">
  Terms and Conditions
</p>

<h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
  Terms and Conditions
</h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Please read these terms carefully before using the Wakefield
            Property Lettings website.
          </p>

          <p className="mt-6 text-sm text-white/65">
            Last updated: 27 July 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-10">
            <div className="flex items-start gap-4">
              <AlertTriangle
                size={25}
                className="mt-1 shrink-0 text-[#071b3a]"
              />

              <div>
                <h2 className="text-xl font-bold text-[#071b3a]">
                  Important information
                </h2>

                <p className="mt-3 leading-7 text-slate-700">
                  These are website-use terms. They do not replace any tenancy
                  agreement, landlord agreement, holding-deposit agreement,
                  property management agreement or other contract issued
                  separately by us.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                      <Icon size={23} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-2xl font-bold text-[#071b3a]">
                        {section.title}
                      </h2>

                      <div className="mt-5 leading-7 text-slate-600">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Privacy */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              10. Personal information
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>
                Personal information submitted through the website will be
                handled in accordance with our Privacy Policy.
              </p>

              <p>
                Information about cookies and similar technologies is provided
                in our Cookie Policy.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/privacy-policy"
                  className="rounded-full bg-[#071b3a] px-5 py-2.5 font-semibold text-white transition hover:bg-[#102c55]"
                >
                  Privacy Policy
                </Link>

                <Link
                  href="/cookie-policy"
                  className="rounded-full border border-[#071b3a] px-5 py-2.5 font-semibold text-[#071b3a] transition hover:bg-[#071b3a] hover:text-white"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </article>

          {/* Changes */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              11. Changes to these terms
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>
                We may update these terms where our services, website or legal
                obligations change.
              </p>

              <p>
                The latest version will be published on this page. Continued
                use of the website after an update means the revised terms will
                apply from the date shown above.
              </p>
            </div>
          </article>

          {/* Law */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              12. Governing law
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>
                These website terms are governed by the laws of England and
                Wales.
              </p>

              <p>
                The courts of England and Wales will generally have
                jurisdiction, subject to any mandatory consumer rights that
                apply.
              </p>
            </div>
          </article>

          {/* Contact */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                <Mail size={23} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#071b3a]">
                  Contact us
                </h2>

                <div className="mt-5 leading-7 text-slate-600">
                  <p className="font-semibold text-[#071b3a]">
                    WAKEFIELD PROPERTY LETTINGS LTD
                  </p>

                  <p className="mt-2">Company number: 16866876</p>

                  <p className="mt-2">
                    Registered office: 219 Kirkgate, Wakefield, England, WF1
                    1JG
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
              </div>
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
              href="/"
              className="rounded-full border border-[#071b3a] px-6 py-3 font-semibold text-[#071b3a] transition hover:bg-[#071b3a] hover:text-white"
            >
              Return home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}