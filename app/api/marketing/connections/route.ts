import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";

export async function GET() {
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
        {
          status: 401,
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

    /*
     * IMPORTANT:
     * Do NOT return access_token or refresh_token
     * to the browser.
     */
    const {
      data,
      error,
    } = await supabase
      .from("marketing_connections")
      .select(
        `
        id,
        channel,
        account_name,
        account_external_id,
        connected,
        token_expires_at,
        metadata,
        created_at,
        updated_at
        `
      )
      .order("id", {
        ascending: true,
      });

    if (error) {
      throw new Error(
        error.message
      );
    }

    return NextResponse.json({
      success: true,
      connections: data ?? [],
    });
  } catch (error) {
    console.error(
      "Marketing connections error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load marketing connections.",
      },
      {
        status: 500,
      }
    );
  }
}
