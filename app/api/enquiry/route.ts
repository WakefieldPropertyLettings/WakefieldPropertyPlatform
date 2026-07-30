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

    if (!body.name || !body.phone || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, phone and email are required.",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from("property_enquiries")
      .insert({
        name: body.name,
        phone: body.phone,
        email: body.email,
        property_type: body.propertyType,
        bedrooms: body.bedrooms,
        preferred_location: body.location,
        budget: body.budget,
        move_in_date: body.moveInDate,
        requirements: body.requirements,
        status: "New",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase enquiry insert error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      enquiryId: data.id,
    });
  } catch (error) {
    console.error("Enquiry API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save the enquiry.",
      },
      { status: 500 }
    );
  }
}