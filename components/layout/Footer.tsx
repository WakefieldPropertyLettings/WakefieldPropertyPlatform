import Image from "next/image";
import Link from "next/link";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import {
  Building2,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const whatWeDoLinks = [
  { label: "Available Properties", href: "/properties" },
  { label: "For Landlords", href: "/landlords" },
  { label: "Tenants", href: "/tenants" },
  { label: "Book a Viewing", href: "/eligibility" },
  { label: "Report an Issue", href: "/report-issue" },
];

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Fees & Permitted Payments", href: "/fees" },
  { label: "Complaints Procedure", href: "/complaints" },
  { label: "Accessibility", href: "/accessibility" },
];

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-current"
    >
      <path d="M13.5 22v-9h3l.45-3.5H13.5V7.26c0-1.01.28-1.7 1.74-1.7H17V2.43c-.31-.04-1.38-.13-2.63-.13-2.6 0-4.37 1.58-4.37 4.5v2.7H7V13h3v9h3.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-current"
    >
      <path d="M7.8 2h8.4A5.81 5.81 0 0 1 22 7.8v8.4a5.81 5.81 0 0 1-5.8 5.8H7.8A5.81 5.81 0 0 1 2 16.2V7.8A5.81 5.81 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-current"
    >
      <path d="M6.5 8.25H3V21h3.5V8.25ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.7c0-3.85-2.05-5.65-4.8-5.65-2.2 0-3.2 1.2-3.75 2.05V8.25H9V21h3.45v-6.3c0-1.65.3-3.25 2.35-3.25 2 0 2.05 1.9 2.05 3.35V21H21v-7.3Z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#071b3a] text-white">
      <div className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-[1220px]">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* What We Do */}
            <div>
              <h2 className="text-lg font-bold">What We Do</h2>

              <nav className="mt-7 flex flex-col gap-3">
                {whatWeDoLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-white/90 transition hover:text-[#e6d739]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* About */}
            <div>
              <h2 className="text-lg font-bold">About</h2>

              <nav className="mt-7 flex flex-col gap-3">
                {aboutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-white/90 transition hover:text-[#e6d739]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-lg font-bold">Contact</h2>

              <div className="mt-7 space-y-4 text-white/90">
                <a
                  href="tel:07438647424"
                  className="flex items-start gap-3 transition hover:text-[#e6d739]"
                >
                  <Phone size={19} className="mt-0.5 shrink-0" />
                  <span>07438 647424</span>
                </a>

                <a
                  href="mailto:admin@wakefieldpropertylettings.co.uk"
                  className="flex items-start gap-3 break-all transition hover:text-[#e6d739]"
                >
                  <Mail size={19} className="mt-0.5 shrink-0" />
                  <span>admin@wakefieldpropertylettings.co.uk</span>
                </a>

                <div className="flex items-start gap-3">
                  <MapPin size={19} className="mt-0.5 shrink-0" />

                  <address className="not-italic leading-7">
                    219 Kirkgate
                    <br />
                    Wakefield
                    <br />
                    West Yorkshire
                  </address>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 size={19} className="mt-0.5 shrink-0" />

                  <div className="leading-7">
                    <p>Monday–Friday: 10:00 AM–5:00 PM</p>
                    <p>Saturday: 10:00 AM–12:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h2 className="text-lg font-bold">Social</h2>

              <p className="mt-7 max-w-xs leading-7 text-white/85">
                Follow Wakefield Property Lettings for property updates,
                availability and local letting information.
              </p>

              <div className="mt-6 flex gap-4">
                <a
                  href="YOUR_FACEBOOK_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Wakefield Property Lettings on Facebook"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4df2c] text-[#071b3a] transition hover:scale-105 hover:bg-white"
                >
                  <FacebookIcon />
                </a>

                <a
                  href="YOUR_INSTAGRAM_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Wakefield Property Lettings on Instagram"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4df2c] text-[#071b3a] transition hover:scale-105 hover:bg-white"
                >
                  <InstagramIcon />
                </a>

                <a
                  href="YOUR_LINKEDIN_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Wakefield Property Lettings on LinkedIn"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4df2c] text-[#071b3a] transition hover:scale-105 hover:bg-white"
                >
                  <LinkedinIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Company details */}
          <div className="mt-16 border-t border-white/20 pt-9">
            <div className="flex max-w-5xl items-start gap-4">
              <div className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white p-1 sm:block">
                <Image
                  src="/logo.png"
                  alt="Wakefield Property Lettings Limited"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>

              <div className="text-sm leading-7 text-white/90">
                <p>
                  Copyright © {currentYear}. All rights reserved. Wakefield
                  Property Lettings Limited.
                </p>

               <p>
  Registered in England and Wales. Company number:
  <strong> 16866876</strong>.
</p>

<p>
  Registered office:
  <strong>
    {" "}
    219 Kirkgate, Wakefield, England, WF1 1JG
  </strong>
</p>

<p>
  Trading office:
  <strong>
    {" "}
    219 Kirkgate, Wakefield, West Yorkshire, WF1 1JG
  </strong>
</p>
              </div>
            </div>
          </div>

          {/* Legal links */}
          <nav
            aria-label="Legal information"
            className="mt-9 flex flex-wrap gap-x-3 gap-y-3 border-t border-white/20 pt-7 text-sm"
          >
            {legalLinks.map((link, index) => (
              <div key={link.href} className="flex items-center gap-3">
                {index > 0 && (
                  <span aria-hidden="true" className="text-white/40">
                    |
                  </span>
                )}

                <Link
                  href={link.href}
                  className="font-medium text-white/90 transition hover:text-[#e6d739]"
                >
                  {link.label}
                </Link>
              </div>
            ))}
            <span aria-hidden="true" className="text-white/40">
    |
  </span>

  <CookieSettingsButton />
          </nav>

          {/* Regulatory information */}
          <div className="mt-8 border-t border-white/20 pt-7 text-sm leading-7 text-white/80">
            <div className="flex items-start gap-3">
              <Building2 size={19} className="mt-1 shrink-0" />

              <p>
                Wakefield Property Lettings Limited 
              </p>
            </div>

            
          </div>

          {/* Copyright */}
          <div className="mt-8 border-t border-white/20 pt-6 text-sm text-white/75">
            <p>
              © {currentYear} Wakefield Property Lettings Limited. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}