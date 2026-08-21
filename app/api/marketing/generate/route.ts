import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type MarketingRequest = {
  propertyId?: number;
  title?: string;
  propertyType?: string;
  location?: string;
  price?: string | number;
  deposit?: string | number;
  furnished?: boolean;
  billsIncluded?: boolean;
  availableFrom?: string;
  description?: string;
  propertyUrl?: string;
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

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const property =
      (await request.json()) as MarketingRequest;

    if (!property.propertyType || !property.price) {
      return NextResponse.json(
        {
          error:
            "Property type and price are required.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
You are the AI marketing assistant for Wakefield Property Lettings Ltd,
a professional local letting agency based in Wakefield, West Yorkshire.

Your job is to create high-quality tenant lead-generation marketing content.

IMPORTANT RULES:

- Use British English.
- Do not invent features that are not provided.
- Do not claim parking, garden, number of bedrooms, transport links,
  bills included, private bathroom, private kitchen or any other feature
  unless the information is provided.
- Do not claim bills are included unless billsIncluded is true.
- If a deposit is provided, you may describe it as a low deposit only if
  it is reasonable compared with the monthly rent.
- Do not guarantee acceptance or tenancy approval.
- Do not encourage rental bidding.
- If referring to quick move-in, say:
  "Subject to availability and the required checks."
- Keep Facebook and Instagram content attractive but professional.
- The main objective is to generate genuine tenant enquiries.
- Direct applicants to the property URL.
- Mention Wakefield Property Lettings Ltd.
- Do not overuse emojis.
- Do not sound spammy.
- SEO content should target relevant Wakefield rental searches naturally.

PROPERTY INFORMATION:

Title: ${property.title || "Not provided"}
Property type: ${property.propertyType}
Location: ${property.location || "Wakefield"}
Monthly rent: £${property.price}
Deposit: ${
      property.deposit
        ? `£${property.deposit}`
        : "Not provided"
    }
Furnished: ${
      property.furnished
        ? "Yes"
        : "No / not provided"
    }
Bills included: ${
      property.billsIncluded
        ? "Yes"
        : "No"
    }
Available from: ${
      property.availableFrom ||
      "Available now"
    }
Description: ${
      property.description ||
      "Not provided"
    }
Property URL: ${
      property.propertyUrl ||
      "https://www.wakefieldpropertylettings.co.uk/properties"
    }

Return valid JSON only.

Use exactly this structure:

{
  "headline": "",
  "facebookPost": "",
  "instagramCaption": "",
  "facebookMarketplace": "",
  "googleBusinessPost": "",
  "whatsappMessage": "",
  "reelScript": "",
  "seoTitle": "",
  "seoDescription": "",
  "hashtags": []
}
`;

    const response =
      await openai.responses.create({
        model: "gpt-5.6",
        input: prompt,
      });

    const rawText =
      response.output_text.trim();

    let marketing: MarketingResult;

    try {
      marketing =
        JSON.parse(rawText);
    } catch {
      console.error(
        "AI returned invalid JSON:",
        rawText
      );

      return NextResponse.json(
        {
          error:
            "AI generated an invalid response.",
          raw: rawText,
        },
        {
          status: 502,
        }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Supabase server configuration is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const supabase =
      createClient(
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
      data: savedCampaign,
      error: saveError,
    } = await supabase
      .from("marketing_campaigns")
      .insert({
        property_id:
          property.propertyId || null,

        property_title:
          property.title || null,

        property_url:
          property.propertyUrl || null,

        headline:
          marketing.headline || null,

        facebook_post:
          marketing.facebookPost || null,

        instagram_caption:
          marketing.instagramCaption || null,

        facebook_marketplace:
          marketing.facebookMarketplace ||
          null,

        google_business_post:
          marketing.googleBusinessPost ||
          null,

        whatsapp_message:
          marketing.whatsappMessage ||
          null,

        reel_script:
          marketing.reelScript ||
          null,

        seo_title:
          marketing.seoTitle ||
          null,

        seo_description:
          marketing.seoDescription ||
          null,

        hashtags:
          Array.isArray(
            marketing.hashtags
          )
            ? marketing.hashtags
            : [],

        status: "draft",
      })
      .select("id")
      .single();

    if (saveError) {
      console.error(
        "Failed to save marketing campaign:",
        saveError
      );

      return NextResponse.json(
        {
          error:
            "AI generated the marketing, but it could not be saved.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        campaignId:
          savedCampaign?.id,

        marketing,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "AI marketing generation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Marketing generation failed.",
      },
      {
        status: 500,
      }
    );
  }
}