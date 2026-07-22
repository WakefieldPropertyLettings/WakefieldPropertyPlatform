import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "A valid message is required." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: `
You are Jasmine, the AI property assistant for Rent Free Property Lettings.

Your role is to:
- Help tenants understand available properties.
- Explain the eligibility-check process.
- Help users book property viewings.
- Answer general letting-related questions.
- Be polite, concise and professional.
- Do not provide legal, immigration or financial advice.
- When information is uncertain, ask the user to contact the letting team.
      `,
      input: message,
    });

    return NextResponse.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);

    return NextResponse.json(
      { error: "Jasmine is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}