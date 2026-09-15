import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";

type Property = {
  id: number;
  title: string;
  location?: string | null;
  postcode?: string | null;
  property_type?: string | null;
  status?: string | null;
};

type Applicant = {
  id: number;
  reference?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  property_id?: number | null;
  property_type?: string | null;
  budget?: number | null;
  move_date?: string | null;
  lead_source?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type Viewing = {
  id: number;
  property_id?: number | null;
  applicant_id?: number | null;
  viewing_date?: string | null;
  viewing_time?: string | null;
  status?: string | null;
  notes?: string | null;
};

type Tenancy = {
  id: number;
  property_id?: number | null;
  applicant_id?: number | null;
  tenant_name?: string | null;
  tenant_email?: string | null;
  tenant_phone?: string | null;
  tenancy_start?: string | null;
  tenancy_end?: string | null;
  notice_date?: string | null;
  move_out_date?: string | null;
  monthly_rent?: number | null;
  status?: string | null;
};

type OperationTask = {
  id: number;
  title?: string | null;
  description?: string | null;
  applicant_id?: number | null;
  property_id?: number | null;
  tenancy_id?: number | null;
  due_date?: string | null;
  due_time?: string | null;
  priority?: string | null;
  status?: string | null;
};

function londonDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(date);

  const year =
    parts.find(
      (part) => part.type === "year"
    )?.value ?? "";

  const month =
    parts.find(
      (part) => part.type === "month"
    )?.value ?? "";

  const day =
    parts.find(
      (part) => part.type === "day"
    )?.value ?? "";

  return `${year}-${month}-${day}`;
}

function formatDate(
  date?: string | null
) {
  if (!date) {
    return "Not set";
  }

  const parsedDate =
    new Date(`${date}T12:00:00`);

  return parsedDate.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Europe/London",
    }
  );
}

function formatTime(
  time?: string | null
) {
  if (!time) {
    return "—";
  }

  return time.slice(0, 5);
}

function formatMoney(
  value?: number | null
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-GB",
    {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function displayPropertyType(
  type?: string | null
) {
  switch (
    String(type ?? "")
      .trim()
      .toLowerCase()
  ) {
    case "room":
      return "Room";

    case "ensuite":
      return "En-suite Room";

    case "studio":
      return "Studio";

    case "flat":
      return "Flat";

    case "house":
      return "House";

    default:
      return type || "Property";
  }
}

function statusLabel(
  status?: string | null
) {
  switch (status) {
    case "let_agreed":
      return "Let Agreed";

    case "viewing_booked":
      return "Viewing Booked";

    case "deposit_paid":
      return "Deposit Paid";

    case "notice_given":
      return "Notice Given";

    case "in_progress":
      return "In Progress";

    case "no_show":
      return "No Show";

    default:
      return status
        ? status
            .replace(/_/g, " ")
            .replace(
              /\b\w/g,
              (character) =>
                character.toUpperCase()
            )
        : "Unknown";
  }
}

export default async function OperationsPage() {
  const supabase =
    await createClient();

  /* ======================================================
     AUTHENTICATION
  ====================================================== */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (
    user.email?.toLowerCase() !==
    ADMIN_EMAIL
  ) {
    redirect("/admin/login");
  }

  const today =
    londonDateString();

  /* ======================================================
     LOAD DATA
  ====================================================== */

  const [
    propertiesResult,
    applicantsResult,
    viewingsResult,
    tenanciesResult,
    tasksResult,
  ] = await Promise.all([
    supabase
      .from("properties")
      .select(
        `
        id,
        title,
        location,
        postcode,
        property_type,
        status
        `
      )
      .order("id", {
        ascending: false,
      }),

    supabase
      .from("applicants")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(50),

    supabase
      .from("viewings")
      .select("*")
      .gte(
        "viewing_date",
        today
      )
      .order("viewing_date", {
        ascending: true,
      })
      .order("viewing_time", {
        ascending: true,
      })
      .limit(50),

    supabase
      .from("tenancies")
      .select("*")
      .order("tenancy_start", {
        ascending: true,
      })
      .limit(100),

    supabase
      .from("operations_tasks")
      .select("*")
      .neq(
        "status",
        "completed"
      )
      .neq(
        "status",
        "cancelled"
      )
      .order("due_date", {
        ascending: true,
        nullsFirst: false,
      })
      .order("due_time", {
        ascending: true,
        nullsFirst: false,
      })
      .limit(50),
  ]);

  if (propertiesResult.error) {
    console.error(
      "Operations properties error:",
      propertiesResult.error
    );
  }

  if (applicantsResult.error) {
    console.error(
      "Operations applicants error:",
      applicantsResult.error
    );
  }

  if (viewingsResult.error) {
    console.error(
      "Operations viewings error:",
      viewingsResult.error
    );
  }

  if (tenanciesResult.error) {
    console.error(
      "Operations tenancies error:",
      tenanciesResult.error
    );
  }

  if (tasksResult.error) {
    console.error(
      "Operations tasks error:",
      tasksResult.error
    );
  }

  const properties =
    (propertiesResult.data as
      | Property[]
      | null) ?? [];

  const applicants =
    (applicantsResult.data as
      | Applicant[]
      | null) ?? [];

  const viewings =
    (viewingsResult.data as
      | Viewing[]
      | null) ?? [];

  const tenancies =
    (tenanciesResult.data as
      | Tenancy[]
      | null) ?? [];

  const tasks =
    (tasksResult.data as
      | OperationTask[]
      | null) ?? [];

  /* ======================================================
     LOOKUPS
  ====================================================== */

  const propertyMap =
    new Map(
      properties.map(
        (property) => [
          property.id,
          property,
        ]
      )
    );

  const applicantMap =
    new Map(
      applicants.map(
        (applicant) => [
          applicant.id,
          applicant,
        ]
      )
    );

  /* ======================================================
     COUNTS
  ====================================================== */

  const availableCount =
    properties.filter(
      (property) =>
        !property.status ||
        property.status ===
          "available"
    ).length;

  const reservedCount =
    properties.filter(
      (property) =>
        property.status ===
        "reserved"
    ).length;

  const letAgreedCount =
    properties.filter(
      (property) =>
        property.status ===
        "let_agreed"
    ).length;

  const todayViewings =
    viewings.filter(
      (viewing) =>
        viewing.viewing_date ===
        today &&
        viewing.status !==
          "cancelled"
    );

  const newApplicants =
    applicants.filter(
      (applicant) =>
        applicant.status === "new"
    );

  const applicationsInProgress =
    applicants.filter(
      (applicant) =>
        [
          "contacted",
          "viewing_booked",
          "viewed",
          "application",
          "deposit_paid",
          "approved",
        ].includes(
          applicant.status ?? ""
        )
    );

  const openTasks =
    tasks.filter(
      (task) =>
        task.status === "open" ||
        task.status ===
          "in_progress"
    );

  const upcomingMoveIns =
    tenancies
      .filter(
        (tenancy) =>
          tenancy.tenancy_start &&
          tenancy.tenancy_start >=
            today &&
          tenancy.status !== "ended"
      )
      .slice(0, 8);

  const upcomingMoveOuts =
    tenancies
      .filter((tenancy) => {
        const moveOutDate =
          tenancy.move_out_date ||
          tenancy.tenancy_end;

        return (
          moveOutDate &&
          moveOutDate >= today &&
          tenancy.status !== "ended"
        );
      })
      .sort((a, b) => {
        const dateA =
          a.move_out_date ||
          a.tenancy_end ||
          "";

        const dateB =
          b.move_out_date ||
          b.tenancy_end ||
          "";

        return dateA.localeCompare(
          dateB
        );
      })
      .slice(0, 8);

  /* ======================================================
     PAGE
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#f4f6fa]">
      <section className="bg-[#071b3a] px-6 pb-12 pt-28 text-white">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#efad3f]">
                Wakefield Property
                Lettings
              </p>

              <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
                Operations Dashboard
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Vacancies,
                applications,
                viewings, move-ins,
                move-outs and office
                reminders in one
                place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                href="/admin"
                className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10"
              >
                Admin Home
              </Link>

              <Link
                href="/properties"
                className="rounded-xl bg-[#efad3f] px-5 py-3 font-bold text-[#071b3a]"
              >
                View Properties
              </Link>

            </div>

          </div>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* ==================================================
            TODAY
        ================================================== */}

        <div className="mb-10">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c98b25]">
            Today
          </p>

          <h2 className="mt-2 font-serif text-3xl font-bold text-[#071b3a]">
            Office Overview
          </h2>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            label="Today's Viewings"
            value={
              todayViewings.length
            }
            description="Booked for today"
          />

          <SummaryCard
            label="New Applicants"
            value={
              newApplicants.length
            }
            description="Need attention"
          />

          <SummaryCard
            label="Applications"
            value={
              applicationsInProgress.length
            }
            description="Currently progressing"
          />

          <SummaryCard
            label="Outstanding Tasks"
            value={
              openTasks.length
            }
            description="Office follow-ups"
          />

        </div>

        {/* ==================================================
            PORTFOLIO
        ================================================== */}

        <div className="mt-12">

          <h2 className="font-serif text-3xl font-bold text-[#071b3a]">
            Property Portfolio
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">

            <StatusCard
              title="Available"
              value={
                availableCount
              }
              description="Actively available to market"
              status="available"
            />

            <StatusCard
              title="Reserved"
              value={
                reservedCount
              }
              description="Holding deposit / applicant progressing"
              status="reserved"
            />

            <StatusCard
              title="Let Agreed"
              value={
                letAgreedCount
              }
              description="Tenancy agreed"
              status="let_agreed"
            />

          </div>

        </div>

        {/* ==================================================
            VIEWINGS
        ================================================== */}

        <DashboardSection
          title="Upcoming Viewings"
          subtitle="Current and future property viewings"
        >

          {viewings.length ===
          0 ? (
            <EmptyMessage message="No upcoming viewings have been added yet." />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

              {viewings
                .slice(0, 10)
                .map(
                  (
                    viewing
                  ) => {
                    const property =
                      viewing.property_id
                        ? propertyMap.get(
                            viewing.property_id
                          )
                        : undefined;

                    const applicant =
                      viewing.applicant_id
                        ? applicantMap.get(
                            viewing.applicant_id
                          )
                        : undefined;

                    return (
                      <div
                        key={
                          viewing.id
                        }
                        className="grid gap-4 border-b border-slate-100 p-5 last:border-b-0 md:grid-cols-[150px_1fr_1fr_150px]"
                      >

                        <div>
                          <p className="font-bold text-[#071b3a]">
                            {formatDate(
                              viewing.viewing_date
                            )}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {formatTime(
                              viewing.viewing_time
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase text-slate-400">
                            Property
                          </p>

                          <p className="mt-1 font-semibold text-[#071b3a]">
                            {property?.title ||
                              "Property not linked"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase text-slate-400">
                            Applicant
                          </p>

                          <p className="mt-1 font-semibold text-[#071b3a]">
                            {applicant?.full_name ||
                              "Applicant not linked"}
                          </p>

                          {applicant?.reference && (
                            <p className="mt-1 text-xs text-slate-500">
                              {
                                applicant.reference
                              }
                            </p>
                          )}
                        </div>

                        <div className="md:text-right">
                          <Badge
                            value={
                              statusLabel(
                                viewing.status
                              )
                            }
                          />
                        </div>

                      </div>
                    );
                  }
                )}

            </div>
          )}

        </DashboardSection>

        {/* ==================================================
            MOVE INS / MOVE OUTS
        ================================================== */}

        <div className="grid gap-8 lg:grid-cols-2">

          <DashboardSection
            title="Upcoming Move-ins"
            subtitle="Tenancies due to start"
          >

            {upcomingMoveIns.length ===
            0 ? (
              <EmptyMessage message="No upcoming move-ins recorded." />
            ) : (
              <div className="space-y-3">

                {upcomingMoveIns.map(
                  (
                    tenancy
                  ) => {
                    const property =
                      tenancy.property_id
                        ? propertyMap.get(
                            tenancy.property_id
                          )
                        : undefined;

                    return (
                      <SmallCard
                        key={
                          tenancy.id
                        }
                        title={
                          tenancy.tenant_name ||
                          "Tenant"
                        }
                        description={
                          property?.title ||
                          "Property not linked"
                        }
                        meta={`Move in: ${formatDate(
                          tenancy.tenancy_start
                        )}`}
                      />
                    );
                  }
                )}

              </div>
            )}

          </DashboardSection>

          <DashboardSection
            title="Upcoming Move-outs"
            subtitle="Tenancies ending or notice given"
          >

            {upcomingMoveOuts.length ===
            0 ? (
              <EmptyMessage message="No upcoming move-outs recorded." />
            ) : (
              <div className="space-y-3">

                {upcomingMoveOuts.map(
                  (
                    tenancy
                  ) => {
                    const property =
                      tenancy.property_id
                        ? propertyMap.get(
                            tenancy.property_id
                          )
                        : undefined;

                    return (
                      <SmallCard
                        key={
                          tenancy.id
                        }
                        title={
                          tenancy.tenant_name ||
                          "Tenant"
                        }
                        description={
                          property?.title ||
                          "Property not linked"
                        }
                        meta={`Move out: ${formatDate(
                          tenancy.move_out_date ||
                            tenancy.tenancy_end
                        )}`}
                      />
                    );
                  }
                )}

              </div>
            )}

          </DashboardSection>

        </div>

        {/* ==================================================
            APPLICANTS
        ================================================== */}

        <DashboardSection
          title="Recent Applicants"
          subtitle="Latest enquiries and applications"
        >

          {applicants.length ===
          0 ? (
            <EmptyMessage message="No applicants have been added to the Operations system yet." />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

              {applicants
                .slice(0, 10)
                .map(
                  (
                    applicant
                  ) => (
                    <div
                      key={
                        applicant.id
                      }
                      className="grid gap-4 border-b border-slate-100 p-5 last:border-b-0 md:grid-cols-[150px_1fr_150px_150px]"
                    >

                      <div>
                        <p className="font-bold text-[#071b3a]">
                          {applicant.reference ||
                            `Applicant ${applicant.id}`}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {applicant.lead_source ||
                            "Unknown source"}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#071b3a]">
                          {applicant.full_name ||
                            "No name"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {displayPropertyType(
                            applicant.property_type
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Budget
                        </p>

                        <p className="mt-1 font-semibold text-[#071b3a]">
                          {formatMoney(
                            applicant.budget
                          )}
                        </p>
                      </div>

                      <div className="md:text-right">
                        <Badge
                          value={
                            statusLabel(
                              applicant.status
                            )
                          }
                        />
                      </div>

                    </div>
                  )
                )}

            </div>
          )}

        </DashboardSection>

        {/* ==================================================
            TASKS
        ================================================== */}

        <DashboardSection
          title="Tasks & Follow-ups"
          subtitle="Outstanding actions for the office"
        >

          {tasks.length ===
          0 ? (
            <EmptyMessage message="No outstanding tasks." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">

              {tasks
                .slice(0, 12)
                .map(
                  (task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <p className="font-bold text-[#071b3a]">
                            {task.title ||
                              "Task"}
                          </p>

                          {task.description && (
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {
                                task.description
                              }
                            </p>
                          )}
                        </div>

                        <Badge
                          value={
                            statusLabel(
                              task.priority
                            )
                          }
                        />

                      </div>

                      <p className="mt-4 text-sm text-slate-500">
                        Due:{" "}
                        <span className="font-semibold text-[#071b3a]">
                          {task.due_date
                            ? formatDate(
                                task.due_date
                              )
                            : "No date"}
                          {task.due_time
                            ? ` at ${formatTime(
                                task.due_time
                              )}`
                            : ""}
                        </span>
                      </p>

                    </div>
                  )
                )}

            </div>
          )}

        </DashboardSection>

      </section>
    </main>
  );
}

/* ========================================================
   COMPONENTS
======================================================== */

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-bold text-[#071b3a]">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
}

function StatusCard({
  title,
  value,
  description,
  status,
}: {
  title: string;
  value: number;
  description: string;
  status:
    | "available"
    | "reserved"
    | "let_agreed";
}) {
  const styles = {
    available:
      "border-emerald-200 bg-emerald-50",

    reserved:
      "border-amber-200 bg-amber-50",

    let_agreed:
      "border-blue-200 bg-blue-50",
  };

  return (
    <div
      className={`rounded-2xl border p-6 ${styles[status]}`}
    >

      <p className="text-sm font-bold uppercase tracking-wide text-slate-600">
        {title}
      </p>

      <p className="mt-3 text-4xl font-bold text-[#071b3a]">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-600">
        {description}
      </p>

    </div>
  );
}

function DashboardSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">

      <div className="mb-5">

        <h2 className="font-serif text-3xl font-bold text-[#071b3a]">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>

      </div>

      {children}

    </section>
  );
}

function EmptyMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
      {message}
    </div>
  );
}

function Badge({
  value,
}: {
  value: string;
}) {
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-[#071b3a]">
      {value}
    </span>
  );
}

function SmallCard({
  title,
  description,
  meta,
}: {
  title: string;
  description: string;
  meta: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="font-bold text-[#071b3a]">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-600">
        {description}
      </p>

      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#c98b25]">
        {meta}
      </p>

    </div>
  );
}