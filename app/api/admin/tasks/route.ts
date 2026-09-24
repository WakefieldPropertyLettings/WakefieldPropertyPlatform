import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";

const ALLOWED_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
];

export async function POST(
  request: Request
) {
  try {
    /*
     * 1. Verify the logged-in administrator.
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

    /*
     * 2. Get server-only Supabase credentials.
     */
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
            "Supabase server environment variables are missing.",
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
     * 3. Read form data.
     */
    const body =
      await request.json();

    const title =
      String(
        body.title ?? ""
      ).trim();

    const description =
      String(
        body.description ?? ""
      ).trim();

    const priority =
      String(
        body.priority ?? "normal"
      )
        .trim()
        .toLowerCase();

    const dueDate =
      String(
        body.dueDate ?? ""
      ).trim();

    const dueTime =
      String(
        body.dueTime ?? ""
      ).trim();

    const rawPropertyId =
      body.propertyId;

    let propertyId:
      | number
      | null = null;

    if (
      rawPropertyId !== null &&
      rawPropertyId !== undefined &&
      String(rawPropertyId).trim() !== ""
    ) {
      const parsedPropertyId =
        Number(rawPropertyId);

      if (
        !Number.isInteger(
          parsedPropertyId
        ) ||
        parsedPropertyId <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid property.",
          },
          {
            status: 400,
          }
        );
      }

      propertyId =
        parsedPropertyId;
    }

    /*
     * 4. Validate task.
     */
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Task title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_PRIORITIES.includes(
        priority
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid task priority.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 5. If a property was selected,
     * make sure it exists.
     */
    if (propertyId !== null) {
      const {
        data: property,
        error: propertyError,
      } = await supabase
        .from("properties")
        .select("id")
        .eq(
          "id",
          propertyId
        )
        .maybeSingle();

      if (
        propertyError ||
        !property
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Selected property was not found.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
     * 6. Create task.
     */
    const {
      data: task,
      error: taskError,
    } = await supabase
      .from("operations_tasks")
      .insert({
        title,
        description:
          description || null,

        property_id:
          propertyId,

        due_date:
          dueDate || null,

        due_time:
          dueTime || null,

        priority,

        status:
          "open",
      })
      .select("id")
      .single();

    if (
      taskError ||
      !task
    ) {
      throw new Error(
        taskError?.message ||
          "Unable to create task."
      );
    }

    /*
     * 7. Return created task.
     */
    return NextResponse.json({
      success: true,
      taskId:
        task.id,
    });
  } catch (error) {
    console.error(
      "Task creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create task.",
      },
      {
        status: 500,
      }
    );
  }
}