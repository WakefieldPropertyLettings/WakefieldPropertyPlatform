import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";

function formatDate(value: string | null) {
  if (!value) return "Not confirmed";

  return new Date(
    `${value}T12:00:00`
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

function money(value: number | null) {
  return `£${Number(value ?? 0).toFixed(2)}`;
}

export async function GET(
  request: NextRequest
) {
  try {
    const authClient =
      await createServerClient();

    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (
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

    const tenancyId =
      Number(
        request.nextUrl.searchParams.get(
          "tenancyId"
        )
      );

    if (
      !Number.isInteger(tenancyId) ||
      tenancyId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid tenancy.",
        },
        { status: 400 }
      );
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
      data: tenancy,
      error: tenancyError,
    } = await supabase
      .from("tenancies")
      .select("*")
      .eq("id", tenancyId)
      .single();

    if (tenancyError || !tenancy) {
      return NextResponse.json(
        {
          success: false,
          error: "Tenancy not found.",
        },
        { status: 404 }
      );
    }

    const {
      data: property,
      error: propertyError,
    } = await supabase
      .from("properties")
      .select(
        "id,title,address,location,postcode"
      )
      .eq("id", tenancy.property_id)
      .single();

    if (propertyError || !property) {
      throw new Error(
        "Property could not be loaded."
      );
    }

    const applicationUrl =
      tenancy.application_link ||
      process.env.TENANT_APPLICATION_URL ||
      "";

    const bankName =
      process.env.LETTINGS_BANK_NAME || "";

    const accountName =
      process.env.LETTINGS_BANK_ACCOUNT_NAME ||
      "";

    const accountNumber =
      process.env
        .LETTINGS_BANK_ACCOUNT_NUMBER || "";

    const sortCode =
      process.env.LETTINGS_BANK_SORT_CODE ||
      "";

    const propertyName =
      property.address ||
      property.title ||
      property.location ||
      "the property";

    const paymentDay =
      tenancy.rent_payment_day === 15
        ? "15th"
        : "1st";

    const prorata =
      Number(tenancy.prorata_rent ?? 0);

    const message = [
      `Hi ${tenancy.tenant_name || "there"},`,
      "",
      `Thank you for viewing ${propertyName}. We are pleased to confirm that we would like to proceed with your tenancy.`,
      "",
      "Agreed tenancy details:",
      `Monthly rent: ${money(tenancy.monthly_rent)}`,
      `Deposit: ${money(tenancy.deposit)}`,
      `Proposed move-in date: ${formatDate(tenancy.tenancy_start)}`,
      `Minimum term: ${tenancy.minimum_term_months} months`,
      `Notice period: ${tenancy.notice_period_months} month${Number(tenancy.notice_period_months) === 1 ? "" : "s"}`,
      `Regular rent payment date: ${paymentDay} of every month`,
      "",
      ...(prorata > 0
        ? [
            `Based on the proposed move-in date, the pro-rata rent before the next regular payment date is ${money(prorata)}.`,
            "",
          ]
        : []),
      "Payment details:",
      `Bank: ${bankName}`,
      `Account name: ${accountName}`,
      `Account number: ${accountNumber}`,
      `Sort code: ${sortCode}`,
      "",
      "Please complete the tenant application form as soon as possible and provide the required information and documents:",
      applicationUrl,
      "",
      "Please confirm your exact moving date so we can make sure the property is clean, tidy and ready for you.",
      "",
      "Once your application form has been completed, we can prepare the tenancy agreement. Please review and sign the agreement. The required rent and other agreed payments must be received before or at the agreed time of moving in. Once the agreement has been signed and the required payment has been received, we can provide access to the property.",
      "",
      "Thank you,",
      "Wakefield Property Lettings",
    ].join("\n");

    return NextResponse.json({
      success: true,
      tenancyId: tenancy.id,
      tenantName: tenancy.tenant_name,
      phone: tenancy.tenant_phone,
      message,
    });
  } catch (error) {
    console.error(
      "Tenant message error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate message.",
      },
      { status: 500 }
    );
  }
}