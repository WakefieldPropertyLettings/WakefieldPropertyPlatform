import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

type EligibilitySubmission = {
  enquiryFor?: string;
  otherPerson?: string;
  livingWith?: string;

  employment?: string;
  payslips?: string;
  bankStatements?: string;

  currentAddress?: string;
  landlordReference?: string;

  propertyType?: string;
  bedrooms?: string;
  budget?: string;
  moveDate?: string;

  benefits?: string;
  benefitType?: string;

  immigrationStatus?: string;

  fullName?: string;
  phone?: string;
  email?: string;

  propertyReference?: string;
};

type TenNinetyResponse = {
  IsSuccessful?: boolean;
  ErrorMessage?: string | null;
  Name?: string;
  Id?: number;
};

export async function POST(request: Request) {
  try {
    const submission =
      (await request.json()) as EligibilitySubmission;

    // =====================================================
    // 1. Validate applicant
    // =====================================================

    const fullName = String(
      submission.fullName || ""
    ).trim();

    const email = String(
      submission.email || ""
    )
      .trim()
      .toLowerCase();

    const phone = String(
      submission.phone || ""
    ).trim();

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        {
          error:
            "Full name, email address and phone number are required.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // 2. Supabase configuration
    // =====================================================

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          error:
            "Database configuration is missing.",
        },
        {
          status: 500,
        }
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

    // =====================================================
    // 3. Save into Supabase
    // =====================================================

    const {
      data: enquiry,
      error: databaseError,
    } = await supabase
      .from("enquiries")
      .insert({
        enquiry_for:
          submission.enquiryFor || null,

        other_person:
          submission.otherPerson || null,

        living_with:
          submission.livingWith || null,

        employment:
          submission.employment || null,

        payslips:
          submission.payslips || null,

        bank_statements:
          submission.bankStatements || null,

        current_address:
          submission.currentAddress || null,

        landlord_reference:
          submission.landlordReference || null,

        property_type:
          submission.propertyType || null,

        bedrooms:
          submission.bedrooms || null,

        budget:
          submission.budget || null,

        move_date:
          submission.moveDate || null,

        benefits:
          submission.benefits || null,

        benefit_type:
          submission.benefitType || null,

        immigration_status:
          submission.immigrationStatus || null,

        full_name: fullName,
        phone,
        email,
      })
      .select("id")
      .single();

    if (databaseError || !enquiry) {
      console.error(
        "Supabase eligibility error:",
        databaseError
      );

      return NextResponse.json(
        {
          error:
            databaseError?.message ||
            "The enquiry could not be saved.",
        },
        {
          status: 500,
        }
      );
    }

    const enquiryId = enquiry.id;

    // =====================================================
    // 4. Send to 10ninety
    // =====================================================

    let tenNinetySuccess = false;
    let tenNinetyLeadId: number | null = null;
    let tenNinetyWarning: string | null = null;

    const tenNinetyApiKey =
      process.env.TENNINETY_API_KEY;

    const tenNinetyApiUrl =
      process.env.TENNINETY_API_URL;

    if (!tenNinetyApiKey || !tenNinetyApiUrl) {
      console.error(
        "10ninety configuration missing:",
        {
          hasApiKey:
            Boolean(tenNinetyApiKey),
          hasApiUrl:
            Boolean(tenNinetyApiUrl),
        }
      );

      tenNinetyWarning =
        "Saved in Supabase, but 10ninety is not configured.";
    } else {
      try {
        const payload: Record<
          string,
          unknown
        > = {
          BranchName: "Head Office",

          ContactRoleType: "Tenant",

          Name: fullName,

          Email: email,

          MobilePhoneNumber: phone,

          Comments:
            "Eligibility form submitted through Wakefield Property Lettings website.",

          AdditionalInfo:
            buildTenNinetyNotes(
              submission,
              enquiryId
            ),

          EmploymentStatusString:
            submission.employment ||
            undefined,

          RightToRentNotes:
            submission.immigrationStatus ||
            undefined,

          PropertyReference:
            submission.propertyReference ||
            undefined,

          RegistrationComplete: false,
        };

        const budget =
          parsePositiveNumber(
            submission.budget
          );

        if (budget !== undefined) {
          payload.MaxPrice = budget;
        }

        const bedrooms =
          parsePositiveInteger(
            submission.bedrooms
          );

        if (bedrooms !== undefined) {
          payload.BedsEqual = bedrooms;
        }

        if (
          submission.propertyType &&
          submission.propertyType !==
            "No Preference"
        ) {
          payload.PropTypeNames = [
            submission.propertyType,
          ];
        }

        const cleanedPayload =
          Object.fromEntries(
            Object.entries(
              payload
            ).filter(
              ([, value]) =>
                value !== undefined
            )
          );

        const crmResponse =
          await fetch(
            tenNinetyApiUrl,
            {
              method: "POST",

              headers: {
                Accept:
                  "application/json",

                "Content-Type":
                  "application/json",

                "10ninety.OpenApi.Key":
                  tenNinetyApiKey,
              },

              body: JSON.stringify(
                cleanedPayload
              ),

              cache: "no-store",
            }
          );

        const responseText =
          await crmResponse.text();

        let crmResult:
          | TenNinetyResponse
          | null = null;

        try {
          crmResult =
            JSON.parse(
              responseText
            );
        } catch {
          console.error(
            "Invalid 10ninety response:",
            responseText
          );
        }

        if (
          crmResponse.ok &&
          crmResult?.IsSuccessful !==
            false
        ) {
          tenNinetySuccess = true;

          tenNinetyLeadId =
            crmResult?.Id ?? null;
        } else {
          console.error(
            "10ninety API error:",
            {
              status:
                crmResponse.status,

              response:
                crmResult,

              raw:
                responseText,
            }
          );

          tenNinetyWarning =
            crmResult?.ErrorMessage ||
            "10ninety could not be updated.";
        }
      } catch (crmError) {
        console.error(
          "10ninety connection error:",
          crmError
        );

        tenNinetyWarning =
          "10ninety connection failed.";
      }
    }

    // =====================================================
    // 5. Send notification email
    // =====================================================

    let emailSent = false;
    let emailWarning: string | null =
      null;

    const resendApiKey =
      process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error(
        "RESEND_API_KEY is missing."
      );

      emailWarning =
        "Email notification is not configured.";
    } else {
      try {
        const resend =
          new Resend(resendApiKey);

        const {
          error: emailError,
        } =
          await resend.emails.send({
            from:
              process.env
                .ELIGIBILITY_FROM_EMAIL ||
              "Wakefield Property Lettings <onboarding@resend.dev>",

            to: [
              process.env
                .ELIGIBILITY_NOTIFICATION_EMAIL ||
                "admin@wakefieldpropertylettings.co.uk",
            ],

            replyTo: email,

            subject:
              `New Eligibility Submission - ${fullName}`,

            html:
              buildEmailHtml({
                submission,
                fullName,
                email,
                phone,
                enquiryId,
                tenNinetySuccess,
                tenNinetyLeadId,
              }),
          });

        if (emailError) {
          console.error(
            "Eligibility email error:",
            emailError
          );

          emailWarning =
            "Email notification failed.";
        } else {
          emailSent = true;
        }
      } catch (emailError) {
        console.error(
          "Eligibility email exception:",
          emailError
        );

        emailWarning =
          "Email notification failed.";
      }
    }

    // =====================================================
    // 6. Return success
    // =====================================================

    /*
     * Important:
     * Supabase has already saved the enquiry.
     *
     * Even if 10ninety/email fail temporarily,
     * we still show success to the applicant.
     * This prevents duplicate form submissions.
     */

    return NextResponse.json(
      {
        success: true,

        enquiryId,

        tenNinety: {
          success:
            tenNinetySuccess,

          leadId:
            tenNinetyLeadId,

          warning:
            tenNinetyWarning,
        },

        email: {
          sent: emailSent,
          warning:
            emailWarning,
        },
      },
      {
        status: 201,
      }
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
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// Helpers
// =====================================================

function parsePositiveNumber(
  value?: string
) {
  if (!value) {
    return undefined;
  }

  const number = Number(
    value.replace(/[^\d.]/g, "")
  );

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    return undefined;
  }

  return number;
}

function parsePositiveInteger(
  value?: string
) {
  if (!value) {
    return undefined;
  }

  if (
    value === "No Preference"
  ) {
    return undefined;
  }

  const number = Number(
    value.replace(/[^\d]/g, "")
  );

  if (
    !Number.isInteger(number) ||
    number <= 0
  ) {
    return undefined;
  }

  return number;
}

function buildTenNinetyNotes(
  submission: EligibilitySubmission,
  enquiryId: number
) {
  return [
    `Website enquiry reference: WPL-E-${enquiryId}`,

    `Enquiry for: ${
      submission.enquiryFor ||
      "Not provided"
    }`,

    `Living with: ${
      submission.livingWith ||
      "Not provided"
    }`,

    `Other person: ${
      submission.otherPerson ||
      "Not provided"
    }`,

    `Employment: ${
      submission.employment ||
      "Not provided"
    }`,

    `Payslips: ${
      submission.payslips ||
      "Not provided"
    }`,

    `Bank statements: ${
      submission.bankStatements ||
      "Not provided"
    }`,

    `Current address: ${
      submission.currentAddress ||
      "Not provided"
    }`,

    `Landlord reference: ${
      submission.landlordReference ||
      "Not provided"
    }`,

    `Property type: ${
      submission.propertyType ||
      "Not provided"
    }`,

    `Bedrooms: ${
      submission.bedrooms ||
      "Not provided"
    }`,

    `Budget: ${
      submission.budget ||
      "Not provided"
    }`,

    `Move date: ${
      submission.moveDate ||
      "Not provided"
    }`,

    `Benefits: ${
      submission.benefits ||
      "Not provided"
    }`,

    `Benefit type: ${
      submission.benefitType ||
      "Not provided"
    }`,

    `Right to Rent: ${
      submission.immigrationStatus ||
      "Not provided"
    }`,
  ].join("\n");
}

function buildEmailHtml({
  submission,
  fullName,
  email,
  phone,
  enquiryId,
  tenNinetySuccess,
  tenNinetyLeadId,
}: {
  submission: EligibilitySubmission;
  fullName: string;
  email: string;
  phone: string;
  enquiryId: number;
  tenNinetySuccess: boolean;
  tenNinetyLeadId: number | null;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;color:#1e293b;">

      <div style="background:#071b3a;padding:25px;">
        <h1 style="margin:0;color:#ffffff;">
          New Eligibility Submission
        </h1>

        <p style="color:#efad3f;">
          Wakefield Property Lettings
        </p>
      </div>

      <div style="padding:25px;border:1px solid #e5e7eb;">

        <h2>Applicant Details</h2>

        ${emailRow(
          "Name",
          fullName
        )}

        ${emailRow(
          "Email",
          email
        )}

        ${emailRow(
          "Phone",
          phone
        )}

        <hr />

        <h2>Property Requirements</h2>

        ${emailRow(
          "Property Type",
          submission.propertyType
        )}

        ${emailRow(
          "Bedrooms",
          submission.bedrooms
        )}

        ${emailRow(
          "Budget",
          submission.budget
        )}

        ${emailRow(
          "Move Date",
          submission.moveDate
        )}

        <hr />

        <h2>Eligibility</h2>

        ${emailRow(
          "Employment",
          submission.employment
        )}

        ${emailRow(
          "Payslips",
          submission.payslips
        )}

        ${emailRow(
          "Bank Statements",
          submission.bankStatements
        )}

        ${emailRow(
          "Current Address",
          submission.currentAddress
        )}

        ${emailRow(
          "Landlord Reference",
          submission.landlordReference
        )}

        ${emailRow(
          "Benefits",
          submission.benefits
        )}

        ${emailRow(
          "Benefit Type",
          submission.benefitType
        )}

        ${emailRow(
          "Right to Rent",
          submission.immigrationStatus
        )}

        <hr />

        <h2>System Information</h2>

        ${emailRow(
          "Reference",
          `WPL-E-${enquiryId}`
        )}

        ${emailRow(
          "10ninety",
          tenNinetySuccess
            ? "Successfully registered"
            : "Not registered"
        )}

        ${
          tenNinetyLeadId
            ? emailRow(
                "10ninety Lead ID",
                String(
                  tenNinetyLeadId
                )
              )
            : ""
        }

      </div>
    </div>
  `;
}

function emailRow(
  label: string,
  value?: string | null
) {
  return `
    <p>
      <strong>
        ${escapeHtml(label)}:
      </strong>
      ${escapeHtml(
        value || "Not provided"
      )}
    </p>
  `;
}

function escapeHtml(
  value: string
) {
  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}