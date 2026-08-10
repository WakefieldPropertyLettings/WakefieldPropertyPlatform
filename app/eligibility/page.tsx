"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ProgressBar from "./components/ProgressBar";
import QuestionCard from "./components/QuestionCard";
import { questions } from "./components/questions";

export default function EligibilityPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const question = questions[step];

  function updateAnswer(value: string) {
    setErrorMessage("");

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [question.key]: value,
    }));
  }

  async function submitEligibility() {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      const responseText = await response.text();

      let result: {
        success?: boolean;
        error?: string;
        warning?: string;
        enquiryId?: number;
        emailSent?: boolean;
      };

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          `The server returned an invalid response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error || "The eligibility form could not be submitted."
        );
      }

      if (result.warning) {
        console.warn(result.warning);
      }

      router.push("/eligibility/success");
      router.refresh();
    } catch (error) {
      console.error("Eligibility form error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your information."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function nextStep() {
    const currentQuestion = questions[step];

    if (!currentQuestion) {
      return;
    }

    const answer = answers[currentQuestion.key];

    if (!answer?.trim()) {
      setErrorMessage(
        "Please answer this question before continuing."
      );
      return;
    }

    setErrorMessage("");

    // First question
    if (currentQuestion.key === "enquiryFor") {
      if (answer === "Yes") {
        setStep(1);
        return;
      }

      if (answer === "No") {
        setStep(2);
        return;
      }
    }

    // Living With / Other Person
    if (
      currentQuestion.key === "livingWith" ||
      currentQuestion.key === "otherPerson"
    ) {
      setStep(3);
      return;
    }

    // Employment
    if (currentQuestion.key === "employment") {
      if (
        answer === "Student" ||
        answer === "Retired" ||
        answer === "Currently Not Working"
      ) {
        setStep(6);
        return;
      }
    }

    // Benefits
    if (
      currentQuestion.key === "benefits" &&
      answer === "No"
    ) {
      setStep((currentStep) =>
        Math.min(currentStep + 2, questions.length - 1)
      );
      return;
    }

    // Normal next question
    if (step < questions.length - 1) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    // Final question
    await submitEligibility();
  }

  function previousStep() {
    const currentQuestion = questions[step];

    if (!currentQuestion) {
      return;
    }

    setErrorMessage("");

    if (
      currentQuestion.key === "livingWith" ||
      currentQuestion.key === "otherPerson"
    ) {
      setStep(0);
      return;
    }

    if (currentQuestion.key === "employment") {
      setStep(answers.enquiryFor === "Yes" ? 1 : 2);
      return;
    }

    if (step > 0) {
      setStep((currentStep) => currentStep - 1);
    }
  }

  if (!question) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h1 className="text-3xl font-bold text-[#0B1F3A]">
            Eligibility form unavailable
          </h1>

          <p className="mt-3 text-gray-600">
            Please refresh the page and try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-[#0B1F3A] py-16 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-5xl font-bold">
            Quick Eligibility Check
          </h1>

          <p className="mt-4 text-lg text-gray-300">
            This helps us understand your requirements before
            arranging a property viewing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <ProgressBar
          current={step + 1}
          total={questions.length}
        />

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <QuestionCard
          title={question.title}
          value={answers[question.key] || ""}
          options={question.options}
          placeholder="Type your answer..."
          onChange={updateAnswer}
        />

        <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={previousStep}
            disabled={step === 0 || submitting}
            className="rounded-2xl border-2 border-gray-300 bg-white px-10 py-4 font-bold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={() => void nextStep()}
            disabled={submitting}
            className="rounded-2xl bg-[#D4AF37] px-10 py-4 font-bold text-[#0B1F3A] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : step === questions.length - 1
                ? "Finish"
                : "Next"}
          </button>
        </div>
      </section>
    </main>
  );
}