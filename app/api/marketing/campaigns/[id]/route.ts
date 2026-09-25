import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";
export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authClient =
      await createServerClient();

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (
      authError ||
      !user ||
      user.email?.toLowerCase() !== ADMIN_EMAIL
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorised.",
        },
        { status: 401 }
      );
    }

    const { id } =
      await context.params;

    const campaignId =
      Number(id);

    if (
      !Number.isInteger(campaignId) ||
      campaignId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid campaign ID.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase server configuration is missing.",
        },
        { status: 500 }
      );
    }

    const supabase =
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
    } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,

      campaign: {
        id: data.id,
        propertyId: data.property_id,
        propertyTitle:
          data.property_title,
        propertyUrl:
          data.property_url,

        headline:
          data.headline ?? "",

        facebookPost:
          data.facebook_post ?? "",

        instagramCaption:
          data.instagram_caption ?? "",

        facebookMarketplace:
          data.facebook_marketplace ?? "",

        googleBusinessPost:
          data.google_business_post ?? "",

        whatsappMessage:
          data.whatsapp_message ?? "",

        reelScript:
          data.reel_script ?? "",

        seoTitle:
          data.seo_title ?? "",

        seoDescription:
          data.seo_description ?? "",

        hashtags:
          Array.isArray(data.hashtags)
            ? data.hashtags
            : [],

        status:
          data.status ?? "draft",
      },
    });
  } catch (error) {
    console.error(
      "Marketing campaign load error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load campaign.",
      },
      { status: 500 }
    );
  }
}
export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const authClient =
      await createServerClient();

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (
      authError ||
      !user ||
      user.email?.toLowerCase() !==
        ADMIN_EMAIL
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorised.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } =
      await context.params;

    const campaignId =
      Number(id);

    if (
      !Number.isInteger(campaignId) ||
      campaignId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid campaign ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase server configuration is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const supabase =
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

    const hashtags =
      Array.isArray(body.hashtags)
        ? body.hashtags
            .map((item: unknown) =>
              String(item).trim()
            )
            .filter(Boolean)
        : [];

    const {
      data,
      error,
    } = await supabase
      .from(
        "marketing_campaigns"
      )
      .update({
        headline:
          String(
            body.headline ?? ""
          ).trim() || null,

        facebook_post:
          String(
            body.facebookPost ?? ""
          ).trim() || null,

        instagram_caption:
          String(
            body.instagramCaption ?? ""
          ).trim() || null,

        facebook_marketplace:
          String(
            body.facebookMarketplace ??
              ""
          ).trim() || null,

        google_business_post:
          String(
            body.googleBusinessPost ??
              ""
          ).trim() || null,

        whatsapp_message:
          String(
            body.whatsappMessage ?? ""
          ).trim() || null,

        reel_script:
          String(
            body.reelScript ?? ""
          ).trim() || null,

        seo_title:
          String(
            body.seoTitle ?? ""
          ).trim() || null,

        seo_description:
          String(
            body.seoDescription ?? ""
          ).trim() || null,

        hashtags,
      })
      .eq(
        "id",
        campaignId
      )
      .select("id")
      .single();

    if (
      error ||
      !data
    ) {
      throw new Error(
        error?.message ||
          "Unable to save campaign."
      );
    }

    return NextResponse.json({
      success: true,
      campaignId: data.id,
    });
  } catch (error) {
    console.error(
      "Marketing campaign save error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save campaign.",
      },
      {
        status: 500,
      }
    );
  }
}
