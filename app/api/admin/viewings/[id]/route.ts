
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";

async function getAdminClient() {
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
    throw new Error("UNAUTHORISED");
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase server environment variables are missing."
    );
  }

  return createAdminClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

/*
 * GET /api/admin/viewings/[id]
 *
 * Loads the complete viewing record,
 * linked applicant and available properties.
 */
export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const supabase =
      await getAdminClient();

    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Viewing ID is required.",
        },
        { status: 400 }
      );
    }

    const {
      data: viewing,
      error: viewingError,
    } = await supabase
      .from("viewings")
      .select("*")
      .eq("id", id)
      .single();

    if (viewingError || !viewing) {
      return NextResponse.json(
        {
          success: false,
          error: "Viewing not found.",
        },
        { status: 404 }
      );
    }

    let applicant = null;

    if (viewing.applicant_id) {
      const {
        data,
        error,
      } = await supabase
        .from("applicants")
        .select("*")
        .eq(
          "id",
          viewing.applicant_id
        )
        .single();

      if (!error) {
        applicant = data;
      }
    }

    const {
      data: properties,
      error: propertiesError,
    } = await supabase
      .from("properties")
      .select(
        "id,title,address,location,postcode,status,price,deposit"
      )
      .order("title", {
        ascending: true,
      });

    if (propertiesError) {
      throw new Error(
        propertiesError.message
      );
    }

    const {
      data: activity,
    } = viewing.applicant_id
      ? await supabase
          .from("activity_log")
          .select("*")
          .eq(
            "applicant_id",
            viewing.applicant_id
          )
          .order("created_at", {
            ascending: false,
          })
          .limit(20)
      : {
          data: [],
        };

    return NextResponse.json({
      success: true,
      viewing,
      applicant,
      properties:
        properties ?? [],
      activity:
        activity ?? [],
    });
  } catch (error) {
    console.error(
      "Viewing GET error:",
      error
    );

    if (
      error instanceof Error &&
      error.message === "UNAUTHORISED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorised.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load viewing.",
      },
      { status: 500 }
    );
  }
}

/*
 * PATCH /api/admin/viewings/[id]
 *
 * Updates both the viewing and its linked
 * applicant so the CRM stays synchronised.
 */
export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const supabase =
      await getAdminClient();

    const { id } =
      await context.params;

    const body =
      await request.json();

    const fullName =
      String(
        body.fullName ?? ""
      ).trim();

    const phone =
      String(
        body.phone ?? ""
      ).trim();

    const email =
      String(
        body.email ?? ""
      ).trim();

    const propertyId =
      Number(body.propertyId);

    const viewingDate =
      String(
        body.viewingDate ?? ""
      ).trim();

    const viewingTime =
      String(
        body.viewingTime ?? ""
      ).trim();

    const notes =
      String(
        body.notes ?? ""
      ).trim();

    const status =
      String(
        body.status ?? "booked"
      ).trim();

    if (
      !id ||
      !fullName ||
      !phone ||
      !Number.isInteger(propertyId) ||
      propertyId <= 0 ||
      !viewingDate ||
      !viewingTime
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, phone, property, viewing date and viewing time are required.",
        },
        { status: 400 }
      );
    }

    /*
     * Only statuses allowed by the existing
     * viewings_status_check constraint.
     */
    const allowedStatuses = [
      "booked",
      "confirmed",
      "completed",
      "cancelled",
      "no_show",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid viewing status.",
        },
        { status: 400 }
      );
    }

    /*
     * Load existing viewing first.
     */
    const {
      data: existingViewing,
      error: existingError,
    } = await supabase
      .from("viewings")
      .select(
        "id,applicant_id,property_id"
      )
      .eq("id", id)
      .single();

    if (
      existingError ||
      !existingViewing
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Viewing not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Confirm selected property exists.
     */
    const {
      data: property,
      error: propertyError,
    } = await supabase
      .from("properties")
      .select("id,title")
      .eq("id", propertyId)
      .single();

    if (
      propertyError ||
      !property
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Property not found.",
        },
        { status: 400 }
      );
    }

    /*
     * Update viewing.
     */
    const {
      data: updatedViewing,
      error: viewingError,
    } = await supabase
      .from("viewings")
      .update({
        property_id:
          propertyId,

        full_name:
          fullName,

        phone,

        email:
          email || null,

        viewing_date:
          viewingDate,

        viewing_time:
          viewingTime,

        notes:
          notes || null,

        status,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (
      viewingError ||
      !updatedViewing
    ) {
      throw new Error(
        viewingError?.message ||
          "Unable to update viewing."
      );
    }

    /*
     * Keep linked applicant synchronised.
     */
    if (
      existingViewing.applicant_id
    ) {
      const {
        error: applicantError,
      } = await supabase
        .from("applicants")
        .update({
          full_name:
            fullName,

          phone,

          email:
            email || null,

          property_id:
            propertyId,

          notes:
            notes || null,
        })
        .eq(
          "id",
          existingViewing.applicant_id
        );

      if (applicantError) {
        throw new Error(
          applicantError.message
        );
      }

      /*
       * Record the edit in the timeline.
       */
      const {
        error: activityError,
      } = await supabase
        .from("activity_log")
        .insert({
          applicant_id:
            existingViewing.applicant_id,

          property_id:
            propertyId,

          activity_type:
            "viewing_updated",

          title:
            "Viewing details updated",

          description:
            `Viewing updated for ${viewingDate} at ${viewingTime}.`,

          source:
            "admin",
        });

      if (activityError) {
        console.error(
          "Activity log error:",
          activityError
        );
      }
    }

    return NextResponse.json({
      success: true,
      viewing:
        updatedViewing,
    });
  } catch (error) {
    console.error(
      "Viewing PATCH error:",
      error
    );

    if (
      error instanceof Error &&
      error.message === "UNAUTHORISED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorised.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update viewing.",
      },
      { status: 500 }
    );
  }
}