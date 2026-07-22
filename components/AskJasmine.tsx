"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AskJasmine() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello, I’m Jasmine. How can I help you with properties, eligibility or booking a viewing?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to contact Jasmine.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
  console.error(error);

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Jasmine is temporarily unavailable.";

  setMessages((current) => [
    ...current,
    {
      role: "assistant",
      content: `Error: ${errorMessage}`,
    },
  ]);
} finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
        <div className="bg-black px-6 py-5 text-white">
          <h1 className="text-2xl font-semibold">Ask Jasmine</h1>
          <p className="mt-1 text-sm text-gray-300">
            Your Rent Free Property Lettings assistant
          </p>
        </div>

        <div className="h-[450px] space-y-4 overflow-y-auto bg-gray-50 p-6">
          {messages.map((chatMessage, index) => (
            <div
              key={`${chatMessage.role}-${index}`}
              className={`flex ${
                chatMessage.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  chatMessage.role === "user"
                    ? "bg-black text-white"
                    : "border border-gray-200 bg-white text-gray-800"
                }`}
              >
                {chatMessage.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                Jasmine is typing...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={sendMessage}
          className="flex gap-3 border-t border-gray-200 bg-white p-4"
        >
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask Jasmine a question..."
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="rounded-xl bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}