"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ConversationStage =
  | "menu"
  | "name"
  | "phone"
  | "email"
  | "propertyType"
  | "bedrooms"
  | "location"
  | "budget"
  | "moveInDate"
  | "requirements"
  | "confirmation"
  | "completed"
  | "generalQuestion";

type PropertyEnquiry = {
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  bedrooms: string;
  location: string;
  budget: string;
  moveInDate: string;
  requirements: string;
};

type ApiErrorResponse = {
  error?: string;
};

type JasmineResponse = {
  answer?: string;
  error?: string;
};

const emptyEnquiry: PropertyEnquiry = {
  name: "",
  phone: "",
  email: "",
  propertyType: "",
  bedrooms: "",
  location: "",
  budget: "",
  moveInDate: "",
  requirements: "",
};

export default function JasmineChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<ConversationStage>("menu");
  const [enquiry, setEnquiry] =
    useState<PropertyEnquiry>(emptyEnquiry);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello, I’m Jasmine, the virtual assistant for Wakefield Property Lettings. What would you like help with today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  function addAssistantMessage(content: string) {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "assistant",
        content,
      },
    ]);
  }

  function addUserMessage(content: string) {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        content,
      },
    ]);
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone: string) {
    const cleanedPhone = phone.replace(/[\s()-]/g, "");

    return /^(\+44|0)\d{9,10}$/.test(cleanedPhone);
  }

  function startPropertySearch() {
    addUserMessage("Find a Property");
    setEnquiry(emptyEnquiry);
    setStage("name");

    addAssistantMessage(
      "I’d be happy to help you find a property. First, what is your full name?"
    );
  }

  function startGeneralQuestion() {
    addUserMessage("General Question");
    setStage("generalQuestion");

    addAssistantMessage(
      "Of course. Please type your question and I’ll do my best to help."
    );
  }

  function handleViewingRequest() {
    addUserMessage("Book a Viewing");

    addAssistantMessage(
      "To request a viewing, please contact our office on 07438 647424 or email admin@wakefieldpropertylettings.co.uk. You can also submit your details using Find a Property."
    );
  }

  function handleLandlordEnquiry() {
    addUserMessage("Landlord Enquiry");

    addAssistantMessage(
      "We would be happy to discuss letting or managing your property. Please contact Wakefield Property Lettings on 07438 647424 or email admin@wakefieldpropertylettings.co.uk."
    );
  }

  function handleMaintenanceRequest() {
    addUserMessage("Report Maintenance");

    addAssistantMessage(
      "Please use the Report Issue page on our website to submit maintenance details. For urgent matters, contact the office on 07438 647424."
    );
  }

  function selectPropertyType(propertyType: string) {
    addUserMessage(propertyType);

    setEnquiry((current) => ({
      ...current,
      propertyType,
    }));

    setStage("bedrooms");
    addAssistantMessage("How many bedrooms do you need?");
  }

  function selectBedrooms(bedrooms: string) {
    addUserMessage(bedrooms);

    setEnquiry((current) => ({
      ...current,
      bedrooms,
    }));

    setStage("location");

    addAssistantMessage(
      "Which area would you prefer? For example, Wakefield, Ossett, Horbury, Normanton or Castleford."
    );
  }

  function showEnquirySummary(finalEnquiry: PropertyEnquiry) {
    addAssistantMessage(
      `Please check your enquiry details:

Name: ${finalEnquiry.name}
Mobile: ${finalEnquiry.phone}
Email: ${finalEnquiry.email}
Property type: ${finalEnquiry.propertyType}
Bedrooms: ${finalEnquiry.bedrooms}
Preferred area: ${finalEnquiry.location}
Maximum budget: ${finalEnquiry.budget}
Move-in date: ${finalEnquiry.moveInDate}
Additional requirements: ${finalEnquiry.requirements}

Is this information correct?`
    );

    setStage("confirmation");
  }

  async function confirmEnquiry() {
    if (isLoading) {
      return;
    }

    addUserMessage("Confirm enquiry");
    setIsLoading(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enquiry),
      });

      const responseText = await response.text();

      let data: ApiErrorResponse = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText) as ApiErrorResponse;
        } catch {
          throw new Error(
            `The enquiry service returned an invalid response. Status: ${response.status}`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit your enquiry."
        );
      }

      addAssistantMessage(
        `Thank you, ${enquiry.name}. Your property enquiry has been submitted successfully. Our team will contact you as soon as possible.`
      );

      setStage("completed");
    } catch (error) {
      console.error("Enquiry submission error:", error);

      addAssistantMessage(
        error instanceof Error
          ? `Sorry, your enquiry could not be saved: ${error.message}`
          : "Sorry, your enquiry could not be saved."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function restartEnquiry() {
    addUserMessage("Start again");
    setEnquiry(emptyEnquiry);
    setStage("name");

    addAssistantMessage(
      "No problem. Let’s start again. What is your full name?"
    );
  }

  function returnToMenu() {
    addUserMessage("Main menu");
    setStage("menu");
    setEnquiry(emptyEnquiry);
    setQuestion("");

    addAssistantMessage("What would you like help with today?");
  }

  async function sendGeneralQuestion(message: string) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/jasmine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const responseText = await response.text();

      let data: JasmineResponse = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText) as JasmineResponse;
        } catch {
          throw new Error(
            "Jasmine returned an invalid response."
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Jasmine is currently unavailable."
        );
      }

      addAssistantMessage(
        data.answer ||
          "Sorry, I could not answer that question at the moment."
      );
    } catch (error) {
      console.error("Jasmine request error:", error);

      addAssistantMessage(
        error instanceof Error
          ? error.message
          : "Jasmine is temporarily unavailable. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function processAnswer(answer: string) {
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      return;
    }

    addUserMessage(trimmedAnswer);
    setQuestion("");

    switch (stage) {
      case "name": {
        if (trimmedAnswer.length < 2) {
          addAssistantMessage("Please enter your full name.");
          return;
        }

        setEnquiry((current) => ({
          ...current,
          name: trimmedAnswer,
        }));

        setStage("phone");

        addAssistantMessage(
          `Thank you, ${trimmedAnswer}. What is the best mobile number to contact you on?`
        );

        return;
      }

      case "phone": {
        if (!isValidPhone(trimmedAnswer)) {
          addAssistantMessage(
            "Please enter a valid UK telephone number, for example 07700 900123."
          );
          return;
        }

        setEnquiry((current) => ({
          ...current,
          phone: trimmedAnswer,
        }));

        setStage("email");
        addAssistantMessage("What is your email address?");

        return;
      }

      case "email": {
        if (!isValidEmail(trimmedAnswer)) {
          addAssistantMessage(
            "That email address does not appear to be valid. Please enter it again."
          );
          return;
        }

        setEnquiry((current) => ({
          ...current,
          email: trimmedAnswer,
        }));

        setStage("propertyType");

        addAssistantMessage(
          "What type of property are you looking for?"
        );

        return;
      }

      case "propertyType":
        selectPropertyType(trimmedAnswer);
        return;

      case "bedrooms":
        selectBedrooms(trimmedAnswer);
        return;

      case "location":
        setEnquiry((current) => ({
          ...current,
          location: trimmedAnswer,
        }));

        setStage("budget");

        addAssistantMessage(
          "What is your maximum monthly rental budget? For example, £900 per month."
        );

        return;

      case "budget":
        setEnquiry((current) => ({
          ...current,
          budget: trimmedAnswer,
        }));

        setStage("moveInDate");

        addAssistantMessage(
          "When would you like to move in? You can enter a date or say as soon as possible."
        );

        return;

      case "moveInDate":
        setEnquiry((current) => ({
          ...current,
          moveInDate: trimmedAnswer,
        }));

        setStage("requirements");

        addAssistantMessage(
          "Do you have any additional requirements, such as parking, a garden, furnished accommodation, pet-friendly accommodation or bills included? Type “None” if you have no additional requirements."
        );

        return;

      case "requirements": {
        const completedEnquiry: PropertyEnquiry = {
          ...enquiry,
          requirements: trimmedAnswer,
        };

        setEnquiry(completedEnquiry);
        showEnquirySummary(completedEnquiry);

        return;
      }

      case "generalQuestion":
        await sendGeneralQuestion(trimmedAnswer);
        return;

      case "menu":
        addAssistantMessage(
          "Please select one of the available options below."
        );
        return;

      case "confirmation":
        addAssistantMessage(
          "Please use the Confirm enquiry or Start again button below."
        );
        return;

      case "completed":
        addAssistantMessage(
          "Your enquiry has already been completed. Use the Main menu button to start another request."
        );
        return;
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!question.trim() || isLoading) {
      return;
    }

    await processAnswer(question);
  }

  function getPlaceholder() {
    switch (stage) {
      case "name":
        return "Enter your full name...";
      case "phone":
        return "Enter your mobile number...";
      case "email":
        return "Enter your email address...";
      case "location":
        return "Enter your preferred area...";
      case "budget":
        return "Enter your maximum budget...";
      case "moveInDate":
        return "Enter your move-in date...";
      case "requirements":
        return "Enter any additional requirements...";
      case "generalQuestion":
        return "Ask Jasmine a question...";
      default:
        return "Type your answer...";
    }
  }

  const showTextInput = ![
    "menu",
    "propertyType",
    "bedrooms",
    "confirmation",
    "completed",
  ].includes(stage);

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {isOpen && (
        <div className="mb-4 flex h-[560px] w-[calc(100vw-40px)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-black px-5 py-4 text-white">
            <div>
              <h2 className="text-lg font-bold">Jasmine AI</h2>

              <p className="text-xs text-neutral-300">
                Wakefield Property Lettings
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Jasmine chatbot"
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/10"
            >
              ×
            </button>
          </header>

          <div
            className="flex-1 space-y-4 overflow-y-auto bg-neutral-50 p-4"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[85%] whitespace-pre-line rounded-2xl rounded-br-md bg-black px-4 py-3 text-sm leading-6 text-white"
                      : "max-w-[90%] whitespace-pre-line rounded-2xl rounded-bl-md border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 text-neutral-800 shadow-sm"
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}

            {stage === "menu" && !isLoading && (
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={startPropertySearch}
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-left text-sm font-semibold text-neutral-900 transition hover:border-black hover:bg-neutral-100"
                >
                  🏠 Find a Property
                </button>

                <button
                  type="button"
                  onClick={handleViewingRequest}
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-left text-sm font-semibold text-neutral-900 transition hover:border-black hover:bg-neutral-100"
                >
                  📅 Book a Viewing
                </button>

                <button
                  type="button"
                  onClick={handleLandlordEnquiry}
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-left text-sm font-semibold text-neutral-900 transition hover:border-black hover:bg-neutral-100"
                >
                  🏡 Landlord Enquiry
                </button>

                <button
                  type="button"
                  onClick={handleMaintenanceRequest}
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-left text-sm font-semibold text-neutral-900 transition hover:border-black hover:bg-neutral-100"
                >
                  🔧 Report Maintenance
                </button>

                <button
                  type="button"
                  onClick={startGeneralQuestion}
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-left text-sm font-semibold text-neutral-900 transition hover:border-black hover:bg-neutral-100"
                >
                  ❓ General Question
                </button>
              </div>
            )}

            {stage === "propertyType" && (
              <div className="grid grid-cols-2 gap-2">
                {["House", "Flat", "Studio", "Room"].map(
                  (propertyType) => (
                    <button
                      key={propertyType}
                      type="button"
                      onClick={() =>
                        selectPropertyType(propertyType)
                      }
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm font-semibold transition hover:border-black hover:bg-neutral-100"
                    >
                      {propertyType}
                    </button>
                  )
                )}
              </div>
            )}

            {stage === "bedrooms" && (
              <div className="grid grid-cols-4 gap-2">
                {["1", "2", "3", "4+"].map((bedrooms) => (
                  <button
                    key={bedrooms}
                    type="button"
                    onClick={() => selectBedrooms(bedrooms)}
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm font-semibold transition hover:border-black hover:bg-neutral-100"
                  >
                    {bedrooms}
                  </button>
                ))}
              </div>
            )}

            {stage === "confirmation" && (
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={confirmEnquiry}
                  disabled={isLoading}
                  className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm enquiry
                </button>

                <button
                  type="button"
                  onClick={restartEnquiry}
                  disabled={isLoading}
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Start again
                </button>
              </div>
            )}

            {stage === "completed" && (
              <button
                type="button"
                onClick={returnToMenu}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold transition hover:border-black"
              >
                Return to main menu
              </button>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-500">
                  Jasmine is thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showTextInput && (
            <form
              onSubmit={handleSubmit}
              className="border-t border-neutral-200 bg-white p-4"
            >
              <div className="flex items-center gap-2">
                <input
                  type={
                    stage === "email"
                      ? "email"
                      : stage === "phone"
                        ? "tel"
                        : "text"
                  }
                  value={question}
                  onChange={(event) =>
                    setQuestion(event.target.value)
                  }
                  placeholder={getPlaceholder()}
                  disabled={isLoading}
                  autoComplete={
                    stage === "email"
                      ? "email"
                      : stage === "phone"
                        ? "tel"
                        : stage === "name"
                          ? "name"
                          : "off"
                  }
                  className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-black"
                />

                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>

              <p className="mt-2 text-center text-[10px] text-neutral-400">
                Please confirm important property details with our
                team.
              </p>
            </form>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          setIsOpen((currentValue) => !currentValue)
        }
        aria-label={
          isOpen
            ? "Close Jasmine AI chatbot"
            : "Open Jasmine AI chatbot"
        }
        aria-expanded={isOpen}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl transition duration-200 hover:scale-105 hover:bg-neutral-800"
      >
        {isOpen ? (
          <span className="text-2xl">×</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        )}
      </button>
    </div>
  );
}