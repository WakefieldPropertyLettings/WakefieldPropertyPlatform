import Link from "next/link";
import {
  Database,
  FileCheck2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Wakefield Property Lettings",
  description:
    "Privacy information explaining how Wakefield Property Lettings Ltd collects, uses and protects personal information.",
};

const sections = [
  {
    icon: UserRound,
    title: "Information we collect",
    content: (
      <>
        <p>We may collect personal information including:</p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Your name, telephone number, email address and postal address.</li>
          <li>
            Information submitted through property enquiry, viewing,
            eligibility, contact and maintenance forms.
          </li>
          <li>
            Employment, income, affordability, guarantor and referencing
            information.
          </li>
          <li>
            Identification documents and evidence of your right to rent in the
            United Kingdom.
          </li>
          <li>
            Copies of passports, immigration documents, share-code results or
            other evidence provided for identity and right-to-rent checks.
          </li>
          <li>
            Information about your preferred property, tenancy requirements
            and proposed occupants.
          </li>
          <li>
            Communications between you and Wakefield Property Lettings Ltd.
          </li>
          <li>
            Technical information such as your IP address, browser, device and
            cookie preferences.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: FileCheck2,
    title: "How we use your information",
    content: (
      <>
        <p>We may use your personal information to:</p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Respond to enquiries and arrange property viewings.</li>
          <li>Assess eligibility, affordability and suitability.</li>
          <li>Process tenancy applications.</li>
          <li>Verify identity and carry out right-to-rent checks.</li>
          <li>
            Communicate with tenants, prospective tenants, landlords,
            guarantors and service providers.
          </li>
          <li>Manage maintenance requests and tenancy-related matters.</li>
          <li>Prevent fraud and protect our business and properties.</li>
          <li>Meet legal, regulatory and record-keeping obligations.</li>
          <li>Improve our website and services.</li>
        </ul>
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Our lawful basis",
    content: (
      <>
        <p>
          We process personal information only where we have a lawful basis to
          do so. Depending on the circumstances, this may include:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Contract:</strong> where processing is necessary to take
            steps before entering into a tenancy or to perform a contract.
          </li>
          <li>
            <strong>Legal obligation:</strong> where we must comply with
            housing, right-to-rent, tax, accounting or other legal
            requirements.
          </li>
          <li>
            <strong>Legitimate interests:</strong> where processing is
            reasonably necessary to operate and protect our property letting
            business.
          </li>
          <li>
            <strong>Consent:</strong> where you have given us permission for a
            particular use, such as optional cookies or marketing.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Database,
    title: "How your information is stored",
    content: (
      <>
        <p>
          Information submitted through our website may be stored securely
          using Supabase and may also be delivered to our business email
          account.
        </p>

        <p className="mt-4">
          We use reasonable technical and organisational measures to protect
          personal information against unauthorised access, accidental loss,
          misuse, alteration or disclosure.
        </p>

        <p className="mt-4">
          However, no internet transmission or electronic storage system can
          be guaranteed to be completely secure.
        </p>
      </>
    ),
  },
  {
    icon: LockKeyhole,
    title: "Identity and right-to-rent documents",
    content: (
      <>
        <p>
          We may request identification and right-to-rent information when it
          is necessary to assess or progress a tenancy application.
        </p>

        <p className="mt-4">
          These documents are sensitive and will only be accessed by people
          who need them for the application, tenancy or legal checks.
        </p>

        <p className="mt-4">
          Right-to-rent evidence may be retained for the duration of the
          tenancy and for one year after the tenancy ends, in accordance with
          applicable right-to-rent record-keeping requirements.
        </p>

        <p className="mt-4">
          Please do not send identity documents unless we have requested them
          and you are using the method provided by us.
        </p>
      </>
    ),
  },
  {
    icon: Mail,
    title: "Contact us",
    content: (
      <>
        <p>
          Questions about this policy or the use of your personal information
          can be sent to:
        </p>

        <div className="mt-4 rounded-2xl bg-slate-50 p-5">
          <p className="font-semibold text-[#071b3a]">
            WAKEFIELD PROPERTY LETTINGS LTD
          </p>

          <p className="mt-2">
            Company number:
            <span className="ml-1 font-medium">16866876</span>
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
            Trading address: 219 Kirkgate, Wakefield, West Yorkshire
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-slate-50">
      <section className="bg-[#071b3a] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#efad3f]">
            Legal information
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            This policy explains how WAKEFIELD PROPERTY LETTINGS LTD collects,
            uses, stores and protects personal information.
          </p>

          <p className="mt-6 text-sm text-white/65">
            Last updated: 27 July 2026
          </p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Who we are
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>
                WAKEFIELD PROPERTY LETTINGS LTD is a company registered in
                England and Wales under company number 16866876.
              </p>

              <p>
                For the purposes of applicable UK data protection law,
                WAKEFIELD PROPERTY LETTINGS LTD is the controller of the
                personal information described in this policy.
              </p>

              <p>
                Our trading address is 219 Kirkgate, Wakefield, West
                Yorkshire.
              </p>
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

                    <div>
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

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Sharing your information
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>
                We may share relevant personal information with landlords,
                property owners, referencing providers, contractors,
                professional advisers, technology providers, insurers,
                utilities, local authorities, government bodies or law
                enforcement where necessary and lawful.
              </p>

              <p>
                We do not sell personal information to third parties.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              How long we retain information
            </h2>

            <div className="mt-5 leading-7 text-slate-600">
              <p>
                We retain personal information only for as long as reasonably
                necessary for the purpose for which it was collected and to
                meet legal, accounting and regulatory requirements.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>General enquiries may be retained for up to 24 months.</li>
                <li>
                  Unsuccessful tenancy application records may normally be
                  retained for up to 12 months.
                </li>
                <li>
                  Tenancy, transaction and financial records may normally be
                  retained for up to six years after the relationship ends.
                </li>
                <li>
                  Right-to-rent records may be retained during the tenancy and
                  for one year after it ends.
                </li>
              </ul>

              <p className="mt-4">
                Information may be retained for longer where there is an
                ongoing complaint, dispute, legal claim or another legal
                requirement.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Your data protection rights
            </h2>

            <div className="mt-5 leading-7 text-slate-600">
              <p>
                Depending on the circumstances, you may have the right to:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Ask for a copy of your personal information.</li>
                <li>Ask us to correct inaccurate information.</li>
                <li>Ask us to delete information in certain circumstances.</li>
                <li>Ask us to restrict how information is used.</li>
                <li>Object to certain processing.</li>
                <li>Withdraw consent where processing relies on consent.</li>
                <li>
                  Request transfer of information where the right to data
                  portability applies.
                </li>
              </ul>

              <p className="mt-4">
                These rights are not absolute and may be limited by legal or
                regulatory requirements.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Complaints about personal information
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-700">
              <p>
                Please contact us first so we have an opportunity to resolve
                your concern.
              </p>

              <p>
                You may also make a complaint to the Information
                Commissioner&apos;s Office if you believe your information has
                not been handled correctly.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/cookie-policy"
              className="rounded-full bg-[#071b3a] px-6 py-3 font-semibold text-white transition hover:bg-[#102c55]"
            >
              Read our Cookie Policy
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