"use client";

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

const supabase = createClient();

export default function AdminMarketingPage() {
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

  useEffect(() => {
    void loadProperties();
  }, []);

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
                <div className="rounded-lg bg-[#0B1F3A] px-4 py-2 text-sm font-bold text-white">
                  Campaign #
                  {
                    campaignId
                  }
                </div>
              )}
            </div>

            <div className="grid gap-6">
              <MarketingCard
                title="Headline"
                text={
                  result.headline
                }
                onCopy={
                  copyText
                }
              />

              <MarketingCard
                title="Facebook Post"
                text={
                  result.facebookPost
                }
                onCopy={
                  copyText
                }
              />

              <MarketingCard
                title="Instagram Caption"
                text={
                  result.instagramCaption
                }
                onCopy={
                  copyText
                }
              />

              <MarketingCard
                title="Facebook Marketplace"
                text={
                  result.facebookMarketplace
                }
                onCopy={
                  copyText
                }
              />

              <MarketingCard
                title="Google Business Post"
                text={
                  result.googleBusinessPost
                }
                onCopy={
                  copyText
                }
              />

              <MarketingCard
                title="WhatsApp Message"
                text={
                  result.whatsappMessage
                }
                onCopy={
                  copyText
                }
              />

              <MarketingCard
                title="Reel / TikTok Script"
                text={
                  result.reelScript
                }
                onCopy={
                  copyText
                }
              />

              <MarketingCard
                title="SEO Title"
                text={
                  result.seoTitle
                }
                onCopy={
                  copyText
                }
              />

              <MarketingCard
                title="SEO Description"
                text={
                  result.seoDescription
                }
                onCopy={
                  copyText
                }
              />

              {result.hashtags &&
                result.hashtags
                  .length >
                  0 && (
                  <MarketingCard
                    title="Hashtags"
                    text={result.hashtags.join(
                      " "
                    )}
                    onCopy={
                      copyText
                    }
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
  onCopy,
}: {
  title: string;
  text?: string;
  onCopy: (
    text?: string
  ) => void;
}) {
  if (!text) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-xl font-bold text-[#0B1F3A]">
          {title}
        </h3>

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

      <div className="mt-4 whitespace-pre-wrap leading-7 text-gray-700">
        {text}
      </div>
    </div>
  );
}