import Link from "next/link";
import {
  BadgePoundSterling,
  Building2,
  CheckCircle2,
  CirclePoundSterling,
  FileText,
  Home,
  KeyRound,
  Mail,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Fees and Permitted Payments | Wakefield Property Lettings",
  description:
    "Information about tenant permitted payments and landlord service fees at Wakefield Property Lettings Ltd.",
};

const permittedPayments = [
  {
    icon: Home,
    title: "Rent",
    description:
      "Rent is payable in accordance with the amount, frequency and payment terms stated in the tenancy agreement.",
  },
  {
    icon: CirclePoundSterling,
    title: "Refundable Holding Deposit",
    description:
      "Where applicable, a refundable holding deposit may be requested to reserve a property while referencing and other checks are completed. The amount will not exceed the maximum permitted by law and will be confirmed before payment.",
  },
  {
    icon: ShieldCheck,
    title: "Refundable Tenancy Deposit",
    description:
      "A refundable tenancy deposit may be required before the tenancy begins. The amount will comply with the applicable legal limit and will be confirmed before the tenancy agreement is completed.",
  },
  {
    icon: ReceiptText,
    title: "Utilities and Other Bills",
    description:
      "Tenants may be responsible for council tax, utilities, communication services and television licence payments where stated in the tenancy agreement.",
  },
  {
    icon: FileText,
    title: "Changes Requested by the Tenant",
    description:
      "A payment may apply where a tenant asks to assign, vary or change a tenancy. Any payment will only be requested where permitted by law and will be explained before the change is made.",
  },
  {
    icon: KeyRound,
    title: "Lost Keys or Security Devices",
    description:
      "Tenants may be required to pay the reasonable and evidenced replacement cost of a lost key, access fob or other security device.",
  },
  {
    icon: BadgePoundSterling,
    title: "Late Payment of Rent",
    description:
      "A late-payment charge may only apply where rent is overdue and the charge is permitted by law and provided for in the tenancy agreement.",
  },
  {
    icon: Building2,
    title: "Early Termination Requested by the Tenant",
    description:
      "Where a tenant asks to leave without giving the required notice or before the appropriate tenancy end date, reasonable costs may apply, subject to the tenancy agreement and applicable law.",
  },
];

const prohibitedFees = [
  "Viewing fees",
  "Tenant administration fees",
  "Referencing fees",
  "Inventory fees charged merely for entering a tenancy",
  "Check-in fees charged merely for entering a tenancy",
  "Tenancy application fees that are not legally permitted",
];

const landlordServices = [
  "Property marketing",
  "Tenant-find services",
  "Tenant referencing and onboarding",
  "Rent collection",
  "Fully managed services",
  "Property inspections",
  "Maintenance coordination",
  "Compliance support",
];

export default function FeesPage() {
  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="bg-[#071b3a] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#efad3f]">
            Fees and Permitted Payments
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Fees and Permitted Payments
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Clear information about payments that may apply to tenants,
            prospective tenants and landlords.
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
                <ReceiptText size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#071b3a]">
                  Our approach to fees
                </h2>

                <div className="mt-5 space-y-4 leading-7 text-slate-600">
                  <p>
                    WAKEFIELD PROPERTY LETTINGS LTD is committed to clear and
                    transparent information about payments connected with a
                    tenancy or property service.
                  </p>

                  <p>
                    We will not request a tenant payment that is prohibited by
                    applicable law.
                  </p>

                  <p>
                    The exact rent, deposit and any other permitted payment
                    relating to a particular property will be explained before
                    payment is requested or an agreement is entered into.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Tenant payments */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-[#071b3a]">
              Payments that may apply to tenants
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              The following types of payment may apply, depending on the
              property, tenancy agreement and circumstances.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {permittedPayments.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-[#071b3a]">
                      {item.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          {/* No fixed price explanation */}
          <article className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Why fixed amounts are not shown
            </h2>

            <div className="mt-5 space-y-4 leading-7 text-slate-700">
              <p>
                Rent and deposit amounts depend on the specific property and
                tenancy.
              </p>

              <p>
                Where a payment is calculated using the rent, the exact amount
                will be shown clearly in the property or tenancy information
                before payment is requested.
              </p>

              <p>
                Where a payment relates to an actual cost, such as replacing a
                lost key, the reasonable cost and supporting information will
                be provided.
              </p>
            </div>
          </article>

          {/* Prohibited fees */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-[#071b3a]">
              Fees we do not charge tenants
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              We do not charge tenants prohibited fees merely for applying for
              or entering into a tenancy.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {prohibitedFees.map((fee) => (
                <div
                  key={fee}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <p className="font-medium leading-6 text-slate-700">{fee}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Landlord fees */}
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#071b3a] text-[#efad3f]">
                <Building2 size={24} />
              </div>

              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-[#071b3a]">
                  Landlord service fees
                </h2>

                <div className="mt-5 space-y-4 leading-7 text-slate-600">
                  <p>
                    Landlord fees depend on the service required, the property
                    and the terms agreed with the landlord.
                  </p>

                  <p>
                    A written quotation and service agreement will be provided
                    before Wakefield Property Lettings Ltd is formally
                    instructed.
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {landlordServices.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"
                    >
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-[#efad3f]"
                      />

                      <span className="font-medium text-slate-700">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 font-medium text-slate-700">
                  Please contact us for a personalised landlord quotation.
                </p>
              </div>
            </div>
          </article>

          {/* Important notice */}
          <article className="mt-8 rounded-3xl bg-[#071b3a] p-7 text-white shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <ShieldCheck
                size={30}
                className="mt-1 shrink-0 text-[#efad3f]"
              />

              <div>
                <h2 className="text-2xl font-bold">
                  Transparent payment information
                </h2>

                <div className="mt-5 space-y-4 leading-7 text-white/80">
                  <p>
                    Any payment requested by Wakefield Property Lettings Ltd
                    will be explained before payment is taken.
                  </p>

                  <p>
                    Never send money using payment details received from an
                    unverified source. Contact us directly if you are uncertain
                    about any payment request.
                  </p>
                </div>
              </div>
            </div>
          </article>

          
          <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            

            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              

              <p>
                Where we hold client money and client money protection
                membership is required, the name and certificate of the
                relevant scheme will be displayed.
              </p>

              <p>
                Please do not replace this wording with a scheme name until the
                business has completed and confirmed its membership.
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
                  Questions about payments
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

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[#071b3a] px-6 py-3 font-semibold text-white transition hover:bg-[#102c55]"
            >
              Contact us
            </Link>

            <Link
              href="/terms"
              className="rounded-full border border-[#071b3a] px-6 py-3 font-semibold text-[#071b3a] transition hover:bg-[#071b3a] hover:text-white"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}