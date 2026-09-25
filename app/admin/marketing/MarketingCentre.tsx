"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

type Property = {
  id: number;
  title: string;
  location: string | null;
  price: string | number | null;
  deposit: string | number | null;
  furnished: boolean | null;
  bills_included: boolean | null;
  available_from: string | null;
  description: string | null;
  property_type: string | null;
};

type MarketingResult = {
  headline?: string;
  facebookPost?: string;
  instagramCaption?: string;
  facebookMarketplace?: string;
  googleBusinessPost?: string;
  whatsappMessage?: string;
  reelScript?: string;
  seoTitle?: string;
  seoDescription?: string;
  hashtags?: string[];
};

type ApiResponse = {
  success?: boolean;
  campaignId?: number;
  marketing?: MarketingResult;
  error?: string;
};

type MarketingConnection = {
  id: number;
  channel: string;
  account_name: string | null;
  account_external_id: string | null;
  connected: boolean;
  token_expires_at?: string | null;
};

type ConnectionsResponse = {
  success?: boolean;
  connections?: MarketingConnection[];
  error?: string;
};
const supabase = createClient();

export default function AdminMarketingPage() {
  
const searchParams = useSearchParams();

const campaignIdFromUrl =
  searchParams.get("campaignId");
const [
    properties,
    setProperties,
  ] = useState<Property[]>([]);

  const [
    selectedId,
    setSelectedId,
  ] = useState("");

  const [
    loadingProperties,
    setLoadingProperties,
  ] = useState(true);

  const [
    generating,
    setGenerating,
  ] = useState(false);

  const [
  saving,
  setSaving,
] = useState(false);

  const [
    result,
    setResult,
  ] =
    useState<MarketingResult | null>(
      null
    );

  const [
    campaignId,
    setCampaignId,
  ] =
    useState<number | null>(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
  connections,
  setConnections,
] = useState<MarketingConnection[]>([]);

const [
  loadingConnections,
  setLoadingConnections,
] = useState(true);

  useEffect(() => {
  void loadProperties();
  void loadConnections();
}, []);

useEffect(() => {
  if (!campaignIdFromUrl) {
    return;
  }

  void loadExistingCampaign(
    campaignIdFromUrl
  );
}, [campaignIdFromUrl]);

async function loadConnections() {
  setLoadingConnections(true);

  try {
    const response = await fetch(
      "/api/marketing/connections",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data =
      (await response.json()) as ConnectionsResponse;

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ||
          "Unable to load marketing connections."
      );
    }

    setConnections(
      data.connections ?? []
    );
  } catch (error) {
    console.error(
      "Marketing connections loading error:",
      error
    );

    setConnections([]);
  } finally {
    setLoadingConnections(false);
  }
}

async function loadExistingCampaign(
  id: string
) {
  setErrorMessage("");
  setSuccessMessage("");

  try {
    const response = await fetch(
      `/api/marketing/campaigns/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success ||
      !data.campaign
    ) {
      throw new Error(
        data.error ||
          "Unable to load campaign."
      );
    }

    const campaign =
      data.campaign;

    setCampaignId(
      Number(campaign.id)
    );

    setResult({
      headline:
        campaign.headline || "",

      facebookPost:
        campaign.facebookPost || "",

      instagramCaption:
        campaign.instagramCaption || "",

      facebookMarketplace:
        campaign.facebookMarketplace || "",

      googleBusinessPost:
        campaign.googleBusinessPost || "",

      whatsappMessage:
        campaign.whatsappMessage || "",

      reelScript:
        campaign.reelScript || "",

      seoTitle:
        campaign.seoTitle || "",

      seoDescription:
        campaign.seoDescription || "",

      hashtags:
        Array.isArray(
          campaign.hashtags
        )
          ? campaign.hashtags
          : [],
    });

    if (campaign.propertyId) {
      setSelectedId(
        String(
          campaign.propertyId
        )
      );
    }

    setSuccessMessage(
      `Campaign #${campaign.id} loaded. You can edit and save it.`
    );
  } catch (error) {
    console.error(
      "Campaign loading error:",
      error
    );

    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Unable to load campaign."
    );
  }
}

  async function loadProperties() {
    setLoadingProperties(true);
    setErrorMessage("");

    const {
      data,
      error,
    } = await supabase
      .from("properties")
      .select(
        `
        id,
        title,
        location,
        price,
        deposit,
        furnished,
        bills_included,
        available_from,
        description,
        property_type
        `
      )
      .order("id", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Failed to load properties:",
        error
      );

      setErrorMessage(
        "Could not load properties."
      );

      setProperties([]);
    } else {
      setProperties(
        (data as Property[]) || []
      );
    }

    setLoadingProperties(false);
  }

  async function generateMarketing() {
    setErrorMessage("");
    setSuccessMessage("");
    setResult(null);
    setCampaignId(null);

    const property =
      properties.find(
        (item) =>
          String(item.id) ===
          selectedId
      );

    if (!property) {
      setErrorMessage(
        "Please select a property first."
      );

      return;
    }

    if (!property.price) {
      setErrorMessage(
        "The selected property does not have a monthly rent."
      );

      return;
    }

    setGenerating(true);

    try {
      const response =
        await fetch(
          "/api/marketing/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              propertyId:
                property.id,

              title:
                property.title,

              propertyType:
                property.property_type ||
                "Property",

              location:
                property.location ||
                "Wakefield",

              price:
                property.price,

              deposit:
                property.deposit,

              furnished:
                Boolean(
                  property.furnished
                ),

              billsIncluded:
                Boolean(
                  property.bills_included
                ),

              availableFrom:
                property.available_from ||
                "Available now",

              description:
                property.description ||
                "",

              propertyUrl:
                `https://www.wakefieldpropertylettings.co.uk/properties/${property.id}`,
            }),
          }
        );

      const data =
        (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(
          data.error ||
            "AI marketing generation failed."
        );
      }

      if (!data.marketing) {
        throw new Error(
          "AI did not return marketing content."
        );
      }

      setResult(
        data.marketing
      );

      setCampaignId(
        data.campaignId ||
          null
      );

      setSuccessMessage(
        data.campaignId
          ? `Marketing generated and saved successfully. Campaign #${data.campaignId}`
          : "Marketing generated successfully."
      );
    } catch (error) {
      console.error(
        "Marketing generation error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setGenerating(false);
    }
  }
function updateMarketingField(
  field: keyof MarketingResult,
  value: string
) {
  setResult((current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      [field]: value,
    };
  });
}

async function saveMarketingChanges() {
  if (!campaignId || !result) {
    setErrorMessage(
      "Generate a marketing campaign before saving."
    );
    return;
  }

  setSaving(true);
  setErrorMessage("");
  setSuccessMessage("");

  try {
    const response = await fetch(
      `/api/marketing/campaigns/${campaignId}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          result
        ),
      }
    );

    const data =
      (await response.json()) as {
        success?: boolean;
        error?: string;
      };

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data.error ||
          "Unable to save marketing changes."
      );
    }

    setSuccessMessage(
      `Campaign #${campaignId} saved successfully.`
    );
  } catch (error) {
    console.error(
      "Marketing save error:",
      error
    );

    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Unable to save marketing changes."
    );
  } finally {
    setSaving(false);
  }
}
  function copyText(
    text?: string
  ) {
    if (!text) {
      return;
    }

    void navigator.clipboard.writeText(
      text
    );
  }

  const selectedProperty =
    properties.find(
      (property) =>
        String(property.id) ===
        selectedId
    );

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-[#0B1F3A] py-12 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            Wakefield Property
            Lettings
          </p>
<Link
  href="/admin/marketing/campaigns"
  className="mt-6 inline-flex rounded-xl border border-white/30 px-5 py-3 font-bold text-white transition hover:bg-white/10"
>
  Campaign History
</Link>
          <h1 className="mt-3 text-4xl font-bold">
            AI Marketing Centre
          </h1>

          <p className="mt-3 max-w-3xl text-gray-300">
            Select a property and
            automatically generate
            professional tenant marketing
            content for your website and
            social media channels.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">

<div className="mb-8 rounded-2xl bg-white p-6 shadow">
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
    <div>
      <h2 className="text-2xl font-bold text-[#0B1F3A]">
        Connected Marketing Accounts
      </h2>

      <p className="mt-1 text-sm text-gray-600">
        Connect your business accounts to publish marketing
        directly from Wakefield Property Lettings.
      </p>
    </div>
  </div>

  {loadingConnections ? (
    <p className="mt-6 text-gray-600">
      Checking connections...
    </p>
  ) : (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {[
        ["facebook", "Facebook"],
        ["instagram", "Instagram"],
        ["google_business", "Google Business"],
        ["whatsapp", "WhatsApp"],
        ["tiktok", "TikTok"],
      ].map(([channel, label]) => {
        const connection =
          connections.find(
            (item) =>
              item.channel === channel
          );

        const connected =
          Boolean(
            connection?.connected
          );

        return (
          <div
            key={channel}
            className="rounded-xl border border-gray-200 p-4"
          >
            <p className="font-bold text-[#0B1F3A]">
              {label}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  connected
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />

              <span
                className={`text-sm font-semibold ${
                  connected
                    ? "text-green-700"
                    : "text-gray-500"
                }`}
              >
                {connected
                  ? "Connected"
                  : "Not connected"}
              </span>
            </div>

            {connection?.account_name && (
              <p className="mt-2 truncate text-xs text-gray-500">
                {connection.account_name}
              </p>
            )}

            <button
              type="button"
              disabled
              className="mt-4 w-full rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500"
            >
              {connected
                ? "Manage"
                : "Connect"}
            </button>
          </div>
        );
      })}
    </div>
  )}
</div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <label className="mb-2 block font-bold text-[#0B1F3A]">
            Select Property
          </label>

          {loadingProperties ? (
            <p className="text-gray-600">
              Loading properties...
            </p>
          ) : (
            <select
              value={
                selectedId
              }
              onChange={(
                event
              ) => {
                setSelectedId(
                  event.target.value
                );

                setResult(null);
                setCampaignId(
                  null
                );

                setErrorMessage(
                  ""
                );

                setSuccessMessage(
                  ""
                );
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#D4AF37]"
            >
              <option value="">
                Choose a property
              </option>

              {properties.map(
                (property) => (
                  <option
                    key={
                      property.id
                    }
                    value={
                      property.id
                    }
                  >
                    WPL-
                    {
                      property.id
                    }{" "}
                    —{" "}
                    {
                      property.title
                    }{" "}
                    — £
                    {
                      property.price
                    }
                  </option>
                )
              )}
            </select>
          )}

          {selectedProperty && (
            <div className="mt-6 grid gap-4 rounded-xl bg-gray-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <PropertyInfo
                label="Type"
                value={
                  selectedProperty.property_type ||
                  "Not provided"
                }
              />

              <PropertyInfo
                label="Rent"
                value={
                  selectedProperty.price
                    ? `£${selectedProperty.price} PCM`
                    : "Not provided"
                }
              />

              <PropertyInfo
                label="Deposit"
                value={
                  selectedProperty.deposit
                    ? `£${selectedProperty.deposit}`
                    : "Not provided"
                }
              />

              <PropertyInfo
                label="Available"
                value={
                  selectedProperty.available_from ||
                  "Available now"
                }
              />

              <PropertyInfo
                label="Furnished"
                value={
                  selectedProperty.furnished
                    ? "Yes"
                    : "No"
                }
              />

              <PropertyInfo
                label="Bills Included"
                value={
                  selectedProperty.bills_included
                    ? "Yes"
                    : "No"
                }
              />

              <PropertyInfo
                label="Location"
                value={
                  selectedProperty.location ||
                  "Wakefield"
                }
              />

              <PropertyInfo
                label="Reference"
                value={`WPL-${selectedProperty.id}`}
              />
            </div>
          )}

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {
                errorMessage
              }
            </div>
          )}

          {successMessage && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {
                successMessage
              }
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              void generateMarketing()
            }
            disabled={
              generating ||
              !selectedId
            }
            className="mt-6 rounded-xl bg-[#D4AF37] px-7 py-3.5 font-bold text-[#0B1F3A] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating
              ? "Generating AI Marketing..."
              : "Generate AI Marketing"}
          </button>
        </div>

        {result && (
          <section className="mt-10">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#0B1F3A]">
                  Generated
                  Marketing
                </h2>

                <p className="mt-1 text-gray-600">
                  Review and copy
                  the content below.
                </p>
              </div>

              {campaignId && (
  <div className="flex flex-wrap items-center gap-3">
    <div className="rounded-lg bg-[#0B1F3A] px-4 py-2 text-sm font-bold text-white">
      Campaign #{campaignId}
    </div>

    <button
      type="button"
      onClick={() =>
        void saveMarketingChanges()
      }
      disabled={saving}
      className="rounded-lg bg-[#D4AF37] px-5 py-2 text-sm font-bold text-[#0B1F3A] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving
        ? "Saving..."
        : "Save Changes"}
    </button>
  </div>
)}
            </div>

            <div className="grid gap-6">
              <MarketingCard
  title="Headline"
  field="headline"
  text={result.headline}
  onChange={updateMarketingField}
  onCopy={copyText}
/>

             <MarketingCard
  title="Facebook Post"
  field="facebookPost"
  text={result.facebookPost}
  onChange={updateMarketingField}
  onCopy={copyText}
  channel="Facebook"
  connected={
    connections.some(
      (item) =>
        item.channel === "facebook" &&
        item.connected
    )
  }
/>

              <MarketingCard
  title="Instagram Caption"
  field="instagramCaption"
  text={result.instagramCaption}
  onChange={updateMarketingField}
  onCopy={copyText}
  channel="Instagram"
  connected={
    connections.some(
      (item) =>
        item.channel === "instagram" &&
        item.connected
    )
  }
/>

             <MarketingCard
  title="Facebook Marketplace"
  field="facebookMarketplace"
  text={result.facebookMarketplace}
  onChange={updateMarketingField}
  onCopy={copyText}
  channel="Marketplace"
/>

             <MarketingCard
  title="Google Business Post"
  field="googleBusinessPost"
  text={result.googleBusinessPost}
  onChange={updateMarketingField}
  onCopy={copyText}
  channel="Google Business"
  connected={
    connections.some(
      (item) =>
        item.channel === "google_business" &&
        item.connected
    )
  }
/>

             <MarketingCard
  title="WhatsApp Message"
  field="whatsappMessage"
  text={result.whatsappMessage}
  onChange={updateMarketingField}
  onCopy={copyText}
  channel="WhatsApp"
  connected={
    connections.some(
      (item) =>
        item.channel === "whatsapp" &&
        item.connected
    )
  }
/>

              <MarketingCard
  title="Reel / TikTok Script"
  field="reelScript"
  text={result.reelScript}
  onChange={updateMarketingField}
  onCopy={copyText}
  channel="TikTok"
  connected={
    connections.some(
      (item) =>
        item.channel === "tiktok" &&
        item.connected
    )
  }
/>

              <MarketingCard
  title="SEO Title"
  field="seoTitle"
  text={result.seoTitle}
  onChange={updateMarketingField}
  onCopy={copyText}
/>
<MarketingCard
  title="SEO Description"
  field="seoDescription"
  text={result.seoDescription}
  onChange={updateMarketingField}
  onCopy={copyText}
/>
              {result.hashtags &&
                result.hashtags
                  .length >
                  0 && (
                  
                  <MarketingCard
  title="Hashtags"
  field="hashtags"
  text={result.hashtags.join(" ")}
  onChange={(
    _field,
    value
  ) => {
    setResult((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        hashtags: value
          .split(/\s+/)
          .map((tag) =>
            tag.trim()
          )
          .filter(Boolean),
      };
    });
  }}
  onCopy={copyText}
/>
                )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function PropertyInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-[#0B1F3A]">
        {value}
      </p>
    </div>
  );
}

function MarketingCard({
  title,
  text,
  field,
  onChange,
  onCopy,
  channel,
  connected = false,
}: {
  title: string;
  text?: string;
  field: keyof MarketingResult;
  onChange: (
    field: keyof MarketingResult,
    value: string
  ) => void;
  onCopy: (
    text?: string
  ) => void;
  channel?: string;
  connected?: boolean;
}) {
  if (text === undefined) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-[#0B1F3A]">
            {title}
          </h3>

          {channel && (
            <p
              className={`mt-1 text-xs font-semibold ${
                connected
                  ? "text-green-700"
                  : "text-gray-500"
              }`}
            >
              {connected
                ? "Ready to publish"
                : "Account not connected"}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            onCopy(text)
          }
          className="w-fit rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
        >
          Copy
        </button>
      </div>

      <textarea
        value={text}
        onChange={(event) =>
          onChange(
            field,
            event.target.value
          )
        }
        rows={8}
        className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 leading-7 text-gray-700 outline-none transition focus:border-[#D4AF37]"
      />

      {channel && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!connected}
            className="rounded-lg bg-[#0B1F3A] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#17375f] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Publish to {channel}
          </button>

          {!connected && (
            <span className="self-center text-xs text-gray-500">
              Connect the account before publishing.
            </span>
          )}
        </div>
      )}
    </div>
  );
}