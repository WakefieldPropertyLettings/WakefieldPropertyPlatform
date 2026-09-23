import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase server environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const viewingDate = String(body.viewingDate ?? "").trim();
    const viewingTime = String(body.viewingTime ?? "").trim();
    const notes = String(body.notes ?? "").trim();

    const propertyId =
      body.propertyId !== undefined &&
      body.propertyId !== null &&
      String(body.propertyId).trim() !== ""
        ? Number(body.propertyId)
        : null;

    if (
      !fullName ||
      !email ||
      !phone ||
      !viewingDate ||
      !viewingTime
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, email, phone, viewing date and viewing time are required.",
        },
        { status: 400 }
      );
    }

    if (
      propertyId !== null &&
      (!Number.isInteger(propertyId) || propertyId <= 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid property ID.",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    /*
     * Create the applicant first.
     */
    const { data: applicant, error: applicantError } =
      await supabase
        .from("applicants")
        .insert({
          full_name: fullName,
          email,
          phone,
          property_id: propertyId,
          lead_source: "website_booking",
          status: "viewing_booked",
          notes: notes || null,
        })
        .select("id")
        .single();

    if (applicantError || !applicant) {
      console.error(
        "Applicant creation error:",
        applicantError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            applicantError?.message ??
            "Unable to create applicant.",
        },
        { status: 500 }
      );
    }

    /*
     * Create the linked viewing.
     */
    const { data: viewing, error: viewingError } =
      await supabase
        .from("viewings")
        .insert({
          property_id: propertyId,
          applicant_id: applicant.id,
          full_name: fullName,
          email,
          phone,
          viewing_date: viewingDate,
          viewing_time: viewingTime,
          status: "booked",
          notes: notes || null,
        })
        .select("id")
        .single();

    if (viewingError || !viewing) {
      console.error(
        "Viewing creation error:",
        viewingError
      );

      /*
       * Avoid leaving an orphan applicant if the
       * viewing could not be created.
       */
      await supabase
        .from("applicants")
        .delete()
        .eq("id", applicant.id);

      return NextResponse.json(
        {
          success: false,
          error:
            viewingError?.message ??
            "Unable to create viewing.",
        },
        { status: 500 }
      );
    }

    /*
     * Record the event in the Business Brain timeline.
     */
    const { error: activityError } = await supabase
      .from("activity_log")
      .insert({
        applicant_id: applicant.id,
        property_id: propertyId,
        activity_type: "viewing_booked",
        title: "Website viewing booked",
        description:
          `Viewing requested for ${viewingDate} at ${viewingTime}.`,
        source: "website",
      });

    if (activityError) {
      // Booking itself succeeded, so don't fail the request
      // just because the audit entry failed.
      console.error(
        "Activity log creation error:",
        activityError
      );
    }

    return NextResponse.json({
      success: true,
      applicantId: applicant.id,
      viewingId: viewing.id,
    });
  } catch (error) {
    console.error("Booking API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save the viewing.",
      },
      { status: 500 }
    );
  }
}