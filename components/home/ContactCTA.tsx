"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="bg-[#faf8f3] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-[1220px] overflow-hidden rounded-[36px] bg-[#071b3a] px-10 py-16 text-white shadow-2xl lg:flex lg:items-center lg:justify-between">

        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#efad3f]">
            Ready to move?
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Let's find your
            <br />
            perfect property.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Whether you're searching for a new home or looking for a trusted
            letting agent, our team is here to help.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 lg:mt-0">
          <Link
            href="/properties"
            className="rounded-xl bg-[#efad3f] px-8 py-4 font-semibold text-[#071b3a] transition hover:bg-[#f6bf57]"
          >
            Browse Properties
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 font-semibold transition hover:bg-white/10"
          >
            Contact Us
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}