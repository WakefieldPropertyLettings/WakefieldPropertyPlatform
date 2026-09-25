import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
export const dynamic =
  "force-dynamic";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";

type Campaign = {
  id: number;
  property_id: number | null;
  property_title: string | null;
  headline: string | null;
  facebook_post: string | null;
  instagram_caption: string | null;
  google_business_post: string | null;
  whatsapp_message: string | null;
  status: string | null;
  created_at: string | null;
};

function formatDate(
  value: string | null
) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/London",
    }
  ).format(new Date(value));
}

function statusLabel(
  status: string | null
) {
  switch (status) {
    case "published":
      return "Published";

    case "scheduled":
      return "Scheduled";

    case "failed":
      return "Failed";

    default:
      return "Draft";
  }
}

export default async function MarketingCampaignsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (
    !user ||
    user.email?.toLowerCase() !==
      ADMIN_EMAIL
  ) {
    redirect("/admin/login");
  }

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !supabaseUrl ||
  !serviceRoleKey
) {
  throw new Error(
    "Supabase server configuration is missing."
  );
}

const adminSupabase =
  createAdminClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const {
    data,
    error,
  } = await adminSupabase
    .from("marketing_campaigns")
    .select(`
      id,
      property_id,
      property_title,
      headline,
      facebook_post,
      instagram_caption,
      google_business_post,
      whatsapp_message,
      status,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    })
    .limit(100);

  const campaigns =
    (data as Campaign[]) ?? [];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-[#0B1F3A] py-10 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            Wakefield Property Lettings
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold">
                Marketing Campaigns
              </h1>

              <p className="mt-2 text-gray-300">
                Review generated campaigns
                and track publishing.
              </p>
            </div>

            <Link
              href="/admin/marketing"
              className="w-fit rounded-xl bg-[#D4AF37] px-5 py-3 font-bold text-[#0B1F3A]"
            >
              + New Campaign
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            Unable to load marketing
            campaigns.
          </div>
        )}

        {!error &&
        campaigns.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              No campaigns yet
            </h2>

            <p className="mt-2 text-gray-600">
              Generate your first AI
              marketing campaign.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {campaigns.map(
              (campaign) => (
                <article
                  key={campaign.id}
                  className="rounded-2xl bg-white p-6 shadow"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-lg bg-[#0B1F3A] px-3 py-1 text-xs font-bold text-white">
                          Campaign #
                          {campaign.id}
                        </span>

                        <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                          {statusLabel(
                            campaign.status
                          )}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-bold text-[#0B1F3A]">
                        {campaign.headline ||
                          campaign.property_title ||
                          "Marketing Campaign"}
                      </h2>

                      <p className="mt-2 text-sm text-gray-600">
                        {campaign.property_title ||
                          "Property not specified"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Created{" "}
                        {formatDate(
                          campaign.created_at
                        )}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {campaign.facebook_post && (
                          <ChannelBadge text="Facebook" />
                        )}

                        {campaign.instagram_caption && (
                          <ChannelBadge text="Instagram" />
                        )}

                        {campaign.google_business_post && (
                          <ChannelBadge text="Google" />
                        )}

                        {campaign.whatsapp_message && (
                          <ChannelBadge text="WhatsApp" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {campaign.property_id && (
                        <Link
                          href={`/properties/${campaign.property_id}`}
                          target="_blank"
                          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700"
                        >
                          View Property
                        </Link>
                      )}

                      <Link
                        href={`/admin/marketing?campaignId=${campaign.id}`}
                        className="rounded-xl bg-[#D4AF37] px-5 py-2 text-sm font-bold text-[#0B1F3A]"
                      >
                        Open Campaign
                      </Link>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function ChannelBadge({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
      {text}
    </span>
  );
}
