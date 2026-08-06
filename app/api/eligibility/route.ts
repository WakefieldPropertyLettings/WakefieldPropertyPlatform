import { NextResponse } from "next/server";

type TenNinetyResponse = {
  IsSuccessful?: boolean;
  ErrorMessage?: string | null;
  Name?: string;
  Id?: number;
};

export async function POST(request: Request) {
  try {
    const submission = await request.json();

    const apiKey = process.env.TENNINETY_API_KEY;
    const apiUrl = process.env.TENNINETY_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        {
          error: "10ninety environment variables are missing.",
        },
        {
          status: 500,
        }
      );
    }

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
        {
          status: 400,
        }
      );
    }

    const additionalInfo = [
      `Enquiry for: ${submission.enquiryFor || "Not provided"}`,
      `Living with: ${submission.livingWith || "Not provided"}`,
      `Other person: ${submission.otherPerson || "Not provided"}`,
      `Employment: ${submission.employment || "Not provided"}`,
      `Payslips: ${submission.payslips || "Not provided"}`,
      `Bank statements: ${submission.bankStatements || "Not provided"}`,
      `Current address: ${submission.currentAddress || "Not provided"}`,
      `Landlord reference: ${
        submission.landlordReference || "Not provided"
      }`,
      `Property type: ${submission.propertyType || "Not provided"}`,
      `Bedrooms: ${submission.bedrooms || "Not provided"}`,
      `Budget: ${submission.budget || "Not provided"}`,
      `Move date: ${submission.moveDate || "Not provided"}`,
      `Benefits: ${submission.benefits || "Not provided"}`,
      `Benefit type: ${submission.benefitType || "Not provided"}`,
      `Immigration status: ${
        submission.immigrationStatus || "Not provided"
      }`,
    ].join("\n");

    const budgetNumber = Number(
      String(submission.budget || "").replace(/[^\d.]/g, "")
    );

    const bedroomNumber = Number(
      String(submission.bedrooms || "").replace(/[^\d]/g, "")
    );

    const payload: Record<string, unknown> = {
      BranchName: "Head Office",
      ContactRoleType: "Tenant",
      Name: fullName,
      Email: email,
      MobilePhoneNumber: phone,
      Comments:
        "Eligibility form submitted through the Wakefield Property Lettings website.",
      AdditionalInfo: additionalInfo,
      EmploymentStatusString:
        submission.employment || undefined,
      RightToRentNotes:
        submission.immigrationStatus || undefined,
      RegistrationComplete: false,
    };

    if (Number.isFinite(budgetNumber) && budgetNumber > 0) {
      payload.MaxPrice = budgetNumber;
    }

    if (Number.isInteger(bedroomNumber) && bedroomNumber > 0) {
      payload.BedsEqual = bedroomNumber;
    }

    if (submission.propertyType) {
      payload.PropTypeNames = [submission.propertyType];
    }

    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([, value]) => value !== undefined
      )
    );

    const crmResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "10ninety.OpenApi.Key": apiKey,
      },
      body: JSON.stringify(cleanPayload),
      cache: "no-store",
    });

    const responseText = await crmResponse.text();

    let crmResult: TenNinetyResponse;

    try {
      crmResult = JSON.parse(responseText);
    } catch {
      console.error("Invalid 10ninety response:", responseText);

      return NextResponse.json(
        {
          error: "10ninety returned an invalid response.",
        },
        {
          status: 502,
        }
      );
    }

    if (
      !crmResponse.ok ||
      crmResult.IsSuccessful === false
    ) {
      console.error("10ninety error:", crmResult);

      return NextResponse.json(
        {
          error:
            crmResult.ErrorMessage ||
            "The lead could not be created in 10ninety.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        leadId: crmResult.Id,
        leadName: crmResult.Name,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Eligibility API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The eligibility submission failed.",
      },
      {
        status: 500,
      }
    );
  }
}