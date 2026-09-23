import { Suspense } from "react";

import ProceedTenantForm from "./ProceedTenantForm";

export default function ProceedTenantPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f4f6fa] px-6 py-32">
          <div className="mx-auto max-w-4xl">
            <p className="text-slate-600">
              Loading tenant details...
            </p>
          </div>
        </main>
      }
    >
      <ProceedTenantForm />
    </Suspense>
  );
}