import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const submission = await request.json();

    // --------------------------------
    // Validate required information
    // --------------------------------

    const fullName = String(submission.fullName || "").trim();

    const email = String(submission.email || "")
      .trim()
      .toLowerCase();

    const phone = String(submission.phone || "").trim();

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        {
          error: "Full name, email and phone number are required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Supabase
    // --------------------------------

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase environment variables.");

      return NextResponse.json(
        {
          error: "Database configuration is missing.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // --------------------------------
    // Save eligibility form
    // --------------------------------

    const { data, error: databaseError } = await supabase
      .from("enquiries")
      .insert([
        {
          enquiry_for: submission.enquiryFor || null,

          other_person: submission.otherPerson || null,

          living_with: submission.livingWith || null,

          employment: submission.employment || null,

          payslips: submission.payslips || null,

          bank_statements:
            submission.bankStatements || null,

          current_address:
            submission.currentAddress || null,

          landlord_reference:
            submission.landlordReference || null,

          property_type:
            submission.propertyType || null,

          bedrooms: submission.bedrooms || null,

          budget: submission.budget || null,

          move_date: submission.moveDate || null,

          benefits: submission.benefits || null,

          benefit_type:
            submission.benefitType || null,

          immigration_status:
            submission.immigrationStatus || null,

          full_name: fullName,

          phone: phone,

          email: email,
        },
      ])
      .select("id")
      .single();

    if (databaseError) {
      console.error(
        "Supabase eligibility error:",
        databaseError
      );

      return NextResponse.json(
        {
          error: databaseError.message,
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // Email notification
    // --------------------------------

    const resendApiKey =
      process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is missing.");

      // IMPORTANT:
      // The enquiry is already saved.
      // We don't want the applicant submitting again.
      return NextResponse.json(
        {
          success: true,
          enquiryId: data.id,
          emailSent: false,
          warning:
            "Enquiry saved successfully but email notification is not configured.",
        },
        { status: 201 }
      );
    }

    const resend = new Resend(resendApiKey);

    const { error: emailError } =
      await resend.emails.send({
        from:
          process.env.ELIGIBILITY_FROM_EMAIL ||
          "Wakefield Property Lettings <onboarding@resend.dev>",

        to: [
          process.env.ELIGIBILITY_NOTIFICATION_EMAIL ||
            "admin@wakefieldpropertylettings.co.uk",
        ],

        replyTo: email,

        subject: `New Eligibility Submission - ${fullName}`,

        html: `
          <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;color:#1e293b;">

            <div style="background:#0B1F3A;padding:25px;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;">
                New Eligibility Submission
              </h1>
            </div>

            <div style="padding:25px;border:1px solid #e5e7eb;">

              <h2 style="color:#0B1F3A;">
                Applicant Details
              </h2>

              <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>

              <p>
                <strong>Email:</strong>
                ${escapeHtml(email)}
              </p>

              <p>
                <strong>Phone:</strong>
                ${escapeHtml(phone)}
              </p>

              <hr style="margin:25px 0;border:none;border-top:1px solid #ddd;" />

              <h2 style="color:#0B1F3A;">
                Eligibility Information
              </h2>

              ${row("Enquiry For", submission.enquiryFor)}

              ${row("Living With", submission.livingWith)}

              ${row("Other Person", submission.otherPerson)}

              ${row("Employment", submission.employment)}

              ${row("Payslips", submission.payslips)}

              ${row(
                "Bank Statements",
                submission.bankStatements
              )}

              ${row(
                "Current Address",
                submission.currentAddress
              )}

              ${row(
                "Landlord Reference",
                submission.landlordReference
              )}

              ${row(
                "Property Type",
                submission.propertyType
              )}

              ${row("Bedrooms", submission.bedrooms)}

              ${row("Budget", submission.budget)}

              ${row("Move Date", submission.moveDate)}

              ${row("Benefits", submission.benefits)}

              ${row(
                "Benefit Type",
                submission.benefitType
              )}

              ${row(
                "Immigration Status",
                submission.immigrationStatus
              )}

              <hr style="margin:25px 0;border:none;border-top:1px solid #ddd;" />

              <p style="color:#64748b;font-size:13px;">
                Submitted through
                Wakefield Property Lettings website.
              </p>

              <p style="color:#64748b;font-size:13px;">
                Enquiry Reference: WPL-E-${data.id}
              </p>

            </div>

          </div>
        `,
      });

    if (emailError) {
      console.error(
        "Eligibility notification email error:",
        emailError
      );

      // Again: enquiry is already safely stored.
      return NextResponse.json(
        {
          success: true,
          enquiryId: data.id,
          emailSent: false,
          warning:
            "Eligibility saved successfully, but notification email failed.",
        },
        { status: 201 }
      );
    }

    // --------------------------------
    // Everything successful
    // --------------------------------

    return NextResponse.json(
      {
        success: true,
        enquiryId: data.id,
        emailSent: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Eligibility API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Eligibility submission failed.",
      },
      { status: 500 }
    );
  }
}

// --------------------------------
// Email helper
// --------------------------------

function row(label: string, value?: string) {
  return `
    <p>
      <strong>${escapeHtml(label)}:</strong>
      ${escapeHtml(value || "Not provided")}
    </p>
  `;
}

function escapeHtml(value: string) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}