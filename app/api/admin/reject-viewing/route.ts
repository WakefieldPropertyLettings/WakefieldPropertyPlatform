import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";

export async function POST(request: Request) {
  try {
    /*
     * 1. Confirm the logged-in administrator.
     */
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

    /*
     * 2. Read the IDs sent by the Operations page.
     */
    const body =
      await request.json();

    const applicantId =
      Number(body.applicantId);

    const propertyId =
      Number(body.propertyId);

    const viewingId =
      String(
        body.viewingId ?? ""
      ).trim();

    if (
      !Number.isInteger(applicantId) ||
      applicantId <= 0 ||
      !Number.isInteger(propertyId) ||
      propertyId <= 0 ||
      !viewingId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Applicant, property and viewing are required.",
        },
        { status: 400 }
      );
    }

    /*
     * 3. Server-only Supabase access.
     */
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      throw new Error(
        "Supabase server environment variables are missing."
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
     * 4. Verify that this viewing really belongs
     *    to this applicant/property combination.
     */
    const {
      data: viewing,
      error: viewingError,
    } = await supabase
      .from("viewings")
      .select(
        "id,applicant_id,property_id,status"
      )
      .eq("id", viewingId)
      .single();

    if (
      viewingError ||
      !viewing
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Viewing not found.",
        },
        { status: 404 }
      );
    }

    if (
      Number(viewing.applicant_id) !==
        applicantId ||
      Number(viewing.property_id) !==
        propertyId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Viewing does not match this applicant and property.",
        },
        { status: 409 }
      );
    }

    /*
     * 5. Reject applicant.
     */
    const {
      error: applicantError,
    } = await supabase
      .from("applicants")
      .update({
        status: "rejected",
      })
      .eq("id", applicantId);

    if (applicantError) {
      throw new Error(
        applicantError.message
      );
    }

    /*
     * 6. Mark viewing rejected.
     */
    const {
      error: updateViewingError,
    } = await supabase
      .from("viewings")
      .update({
        status: "rejected",
      })
      .eq("id", viewingId);

    if (updateViewingError) {
      /*
       * Restore applicant status if the
       * second database operation fails.
       */
      await supabase
        .from("applicants")
        .update({
          status:
            "viewing_booked",
        })
        .eq("id", applicantId);

      throw new Error(
        updateViewingError.message
      );
    }

    /*
     * 7. Record the decision.
     *
     * NO WhatsApp/email/message is generated.
     */
    const {
      error: activityError,
    } = await supabase
      .from("activity_log")
      .insert({
        applicant_id:
          applicantId,

        property_id:
          propertyId,

        activity_type:
          "applicant_rejected",

        title:
          "Applicant rejected after viewing",

        description:
          "Applicant was not progressed after the viewing.",

        source:
          "admin",
      });

    if (activityError) {
      console.error(
        "Rejection activity log error:",
        activityError
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Reject viewing error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to reject applicant.",
      },
      { status: 500 }
    );
  }
}