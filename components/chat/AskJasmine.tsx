"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AskJasmine() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello 👋 I'm Jasmine from Wakefield Property Lettings Ltd. How may I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    // Save the message before clearing the input
    const message = input;

    const userMessage: Message = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[#0B1F3A] px-6 py-4 text-white shadow-xl hover:opacity-90"
      >
        💬 Ask Jasmine
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* Header */}
          <div className="bg-[#0B1F3A] p-5 text-white">
            <h2 className="text-xl font-bold">
              Ask Jasmine
            </h2>

            <p className="text-sm text-gray-300">
              Wakefield Property Lettings Ltd
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-100 p-4">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "assistant"
                    ? "bg-white"
                    : "ml-auto bg-[#D4AF37]"
                }`}
              >
                {message.content}
              </div>
            ))}

          </div>

          {/* Input */}
          <div className="flex gap-2 border-t p-3">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border p-3"
            />

            <button
              onClick={sendMessage}
              className="rounded-lg bg-[#D4AF37] px-5 font-bold text-[#0B1F3A]"
            >
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}