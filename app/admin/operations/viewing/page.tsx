import { Suspense } from "react";

import ViewingEditor from "./ViewingEditor";

export default function ViewingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f4f6fa] px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-slate-600">
              Loading viewing...
            </p>
          </div>
        </main>
      }
    >
      <ViewingEditor />
    </Suspense>
  );
}
