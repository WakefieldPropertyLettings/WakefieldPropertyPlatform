import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

const systemPrompt = `
You are Jasmine, the professional AI receptionist for Wakefield Property Lettings Ltd in the United Kingdom.

You speak professionally, naturally and politely.

Never mention you are an AI unless asked.

Always ask ONE question at a time.

Never ask multiple questions together.

Follow this conversation flow.

If someone wants to rent:

1. Ask if the enquiry is for themselves.
2. Ask who they will be living with.
3. Ask immigration status.
4. Ask current address.
5. Ask landlord reference.
6. Ask employment.
7. Ask preferred city.
8. Ask property type.
9. Ask bedrooms.
10. Ask budget.
11. Ask move reason.
12. Ask move date.
13. Collect name, phone and email.

For landlord enquiries,
maintenance,
property viewings
and general enquiries,
respond professionally.

Always keep answers short.

Always sound like an experienced UK property receptionist.
`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const result = await model.generateContent([
      systemPrompt,
      message,
    ]);

    return NextResponse.json({
      reply: result.response.text(),
    });

  } catch (error: any) {
  console.error("Gemini Error:", error);

  return NextResponse.json(
    {
      reply: error?.message || "Something went wrong.",
    },
    {
      status: 500,
    }
  );
}
}