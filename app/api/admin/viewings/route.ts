import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";

export async function POST(request: Request) {
  try {
    /*
     * 1. Verify the currently logged-in Supabase user.
     */
    const authClient = await createServerClient();

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
     * 2. Server-only Supabase credentials.
     */
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase server environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const propertyId = Number(body.propertyId);
    const fullName = String(body.fullName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const viewingDate = String(
      body.viewingDate ?? ""
    ).trim();
    const viewingTime = String(
      body.viewingTime ?? ""
    ).trim();
    const comments = String(
      body.comments ?? ""
    ).trim();

    if (
      !Number.isInteger(propertyId) ||
      propertyId <= 0 ||
      !fullName ||
      !phone ||
      !viewingDate ||
      !viewingTime
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Property, name, phone, date and time are required.",
        },
        { status: 400 }
      );
    }

    /*
     * This client exists only on the server.
     * Never expose the service-role key to the browser.
     */
    const supabase = createAdminClient(
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
     * 3. Confirm the property actually exists.
     */
    const {
      data: property,
      error: propertyError,
    } = await supabase
      .from("properties")
      .select("id,title")
      .eq("id", propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        {
          success: false,
          error: "Property not found.",
        },
        { status: 400 }
      );
    }

    /*
     * 4. Create applicant.
     */
    const {
      data: applicant,
      error: applicantError,
    } = await supabase
      .from("applicants")
      .insert({
        full_name: fullName,
        phone,
        property_id: propertyId,
        lead_source: "manual",
        status: "viewing_booked",
        notes: comments || null,
      })
      .select("id")
      .single();

    if (applicantError || !applicant) {
      throw new Error(
        applicantError?.message ||
          "Unable to create applicant."
      );
    }

    /*
     * 5. Create viewing.
     */
    const {
      data: viewing,
      error: viewingError,
    } = await supabase
      .from("viewings")
      .insert({
        property_id: propertyId,
        applicant_id: applicant.id,
        full_name: fullName,
        phone,
        viewing_date: viewingDate,
        viewing_time: viewingTime,
        status: "booked",
        notes: comments || null,
      })
      .select("id")
      .single();

    if (viewingError || !viewing) {
      await supabase
        .from("applicants")
        .delete()
        .eq("id", applicant.id);

      throw new Error(
        viewingError?.message ||
          "Unable to create viewing."
      );
    }

    /*
     * 6. Create activity timeline entry.
     */
    const { error: activityError } =
      await supabase
        .from("activity_log")
        .insert({
          applicant_id: applicant.id,
          property_id: propertyId,
          activity_type: "viewing_booked",
          title: "Viewing booked",
          description: comments
            ? `Viewing booked for ${viewingDate} at ${viewingTime}. ${comments}`
            : `Viewing booked for ${viewingDate} at ${viewingTime}.`,
          source: "admin",
        });

    if (activityError) {
      console.error(
        "Activity log insert error:",
        activityError
      );
    }

    return NextResponse.json({
      success: true,
      applicantId: applicant.id,
      viewingId: viewing.id,
    });
  } catch (error) {
    console.error(
      "Admin viewing creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create viewing.",
      },
      { status: 500 }
    );
  }
}