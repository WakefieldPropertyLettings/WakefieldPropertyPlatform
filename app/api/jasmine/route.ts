import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type JasmineRequest = {
  message?: unknown;
};

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured.");

      return NextResponse.json(
        {
          error: "Jasmine is not configured correctly.",
        },
        {
          status: 500,
        }
      );
    }

    const body = (await request.json()) as JasmineRequest;

    if (
      typeof body.message !== "string" ||
      !body.message.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please enter a valid question.",
        },
        {
          status: 400,
        }
      );
    }

    const message = body.message.trim().slice(0, 1500);

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        temperature: 0.3,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `
You are Jasmine, the virtual assistant for Wakefield Property Lettings Ltd.

Company details:
Wakefield Property Lettings Ltd
219 Kirkgate
Wakefield
WF1 1JG
Telephone: 07438 647424
Email: admin@wakefieldpropertylettings.co.uk

Your role:
- Answer general questions about renting, letting property, viewings, maintenance reporting and contacting the company.
- Give clear and concise answers.
- Be polite and professional.
- Do not claim that a property is available unless that information has been explicitly provided.
- Do not invent rental prices, tenancy terms, viewing appointments or property details.
- Do not provide definitive legal, financial or immigration advice.
- For specific property availability, tenancy decisions, payments, emergencies or appointments, tell the user to contact the company directly.
- For urgent maintenance matters, advise the user to call the office.
- Do not ask users to provide passwords, bank details, card information or identity-document numbers.
            `.trim(),
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

    const answer =
      completion.choices[0]?.message?.content?.trim();

    if (!answer) {
      return NextResponse.json(
        {
          error:
            "Jasmine could not produce an answer at the moment.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error("Jasmine API error:", error);

    return NextResponse.json(
      {
        error:
          "Jasmine is temporarily unavailable. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}