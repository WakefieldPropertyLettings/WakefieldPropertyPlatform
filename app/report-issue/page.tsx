"use client";

import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Mail,
  Phone,
  Upload,
} from "lucide-react";

export default function ReportIssuePage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const email = String(form.get("email") || "");
    const propertyAddress = String(form.get("propertyAddress") || "");
    const issueType = String(form.get("issueType") || "");
    const priority = String(form.get("priority") || "");
    const description = String(form.get("description") || "");

    const subject = encodeURIComponent(
      `Property maintenance issue - ${propertyAddress}`
    );

    const body = encodeURIComponent(
      `Name: ${name}
Phone: ${phone}
Email: ${email}
Property address: ${propertyAddress}
Issue type: ${issueType}
Priority: ${priority}

Issue description:
${description}`
    );

    window.location.href =
      `mailto:admin@wakefieldpropertylettings.co.uk?subject=${subject}&body=${body}`;

    setSubmitted(true);
  }

  return (
    <main className="bg-[#faf8f3]">
      <section className="bg-[#071b3a] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1220px]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#efad3f]">
            Tenant support
          </p>

          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Report a property issue
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Tell us about a repair or maintenance problem and provide as much
            information as possible so our team can respond appropriately.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1220px] gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="space-y-6">
            <div className="rounded-[28px] bg-[#071b3a] p-8 text-white shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#efad3f] text-[#071b3a]">
                <AlertTriangle size={27} />
              </div>

              <h2 className="mt-6 font-serif text-3xl font-bold">
                Is it an emergency?
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                For serious emergencies involving immediate danger, fire, gas,
                flooding or risk to life, contact the relevant emergency
                service first.
              </p>

              <a
                href="tel:07438647424"
                className="mt-7 flex items-center gap-3 rounded-xl bg-[#efad3f] px-5 py-4 font-semibold text-[#071b3a]"
              >
                <Phone size={20} />
                07438 647424
              </a>

              <a
                href="mailto:admin@wakefieldpropertylettings.co.uk"
                className="mt-3 flex items-center gap-3 rounded-xl border border-white/20 px-5 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                <Mail size={20} />
                Email our team
              </a>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#071b3a]">
                Before submitting
              </h3>

              <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#d9992d]"
                  />
                  Include the full property address.
                </li>

                <li className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#d9992d]"
                  />
                  Explain when the issue started.
                </li>

                <li className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#d9992d]"
                  />
                  Describe any damage or safety concern.
                </li>

                <li className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#d9992d]"
                  />
                  Keep photographs ready if our team requests them.
                </li>
              </ul>
            </div>
          </aside>

          <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c98b25]">
                Maintenance request
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold text-[#071b3a]">
                Tell us what has happened
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Complete the form below. Your email application will open with
                the information prepared for sending.
              </p>
            </div>

            {submitted && (
              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
                <CheckCircle2 size={21} className="mt-0.5 shrink-0" />

                <p className="text-sm leading-6">
                  Your email application should now open. Please check the
                  information and send the message to our team.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#071b3a]">
                    Full name
                  </span>

                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[#efad3f] focus:ring-2 focus:ring-[#efad3f]/20"
                    placeholder="Your full name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#071b3a]">
                    Phone number
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[#efad3f] focus:ring-2 focus:ring-[#efad3f]/20"
                    placeholder="Your contact number"
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#071b3a]">
                    Email address
                  </span>

                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[#efad3f] focus:ring-2 focus:ring-[#efad3f]/20"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#071b3a]">
                    Property address
                  </span>

                  <input
                    type="text"
                    name="propertyAddress"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[#efad3f] focus:ring-2 focus:ring-[#efad3f]/20"
                    placeholder="Full rental property address"
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#071b3a]">
                    Type of issue
                  </span>

                  <select
                    name="issueType"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-[#efad3f] focus:ring-2 focus:ring-[#efad3f]/20"
                  >
                    <option value="" disabled>
                      Select an issue
                    </option>
                    <option value="Heating or hot water">
                      Heating or hot water
                    </option>
                    <option value="Plumbing or leak">Plumbing or leak</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Appliance">Appliance</option>
                    <option value="Door, lock or window">
                      Door, lock or window
                    </option>
                    <option value="Damage">Property damage</option>
                    <option value="Other">Other issue</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#071b3a]">
                    Priority
                  </span>

                  <select
                    name="priority"
                    required
                    defaultValue="Normal"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-[#efad3f] focus:ring-2 focus:ring-[#efad3f]/20"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#071b3a]">
                  Describe the issue
                </span>

                <textarea
                  name="description"
                  required
                  rows={7}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-[#efad3f] focus:ring-2 focus:ring-[#efad3f]/20"
                  placeholder="Explain what happened, when it started and whether there is any immediate danger or damage."
                />
              </label>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <Upload
                    size={22}
                    className="mt-0.5 shrink-0 text-[#d9992d]"
                  />

                  <div>
                    <p className="font-semibold text-[#071b3a]">
                      Photographs
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      This version prepares an email request. Attach relevant
                      photographs to the email before sending it.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#071b3a] px-7 py-4 font-semibold text-white transition hover:bg-[#102b55]"
              >
                Prepare maintenance email
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}