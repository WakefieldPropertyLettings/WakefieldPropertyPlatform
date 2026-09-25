import { Suspense } from "react";

import MarketingCentre from "./MarketingCentre";

export default function AdminMarketingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-100">
          <section className="bg-[#0B1F3A] py-12 text-white">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                Wakefield Property Lettings
              </p>

              <h1 className="mt-3 text-4xl font-bold">
                AI Marketing Centre
              </h1>

              <p className="mt-3 text-gray-300">
                Loading marketing centre...
              </p>
            </div>
          </section>
        </main>
      }
    >
      <MarketingCentre />
    </Suspense>
  );
}
