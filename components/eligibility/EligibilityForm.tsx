"use client";

import { useState } from "react";

const questions = [
  {
    label: "What is your full name?",
    type: "text",
  },
  {
    label: "What is your email address?",
    type: "email",
  },
  {
    label: "What is your phone number?",
    type: "tel",
  },
  {
    label: "Is this enquiry for yourself?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    label: "How many adults will live in the property?",
    type: "number",
  },
  {
    label: "How many children?",
    type: "number",
  },
  {
    label: "Do you have pets?",
    type: "select",
    options: ["No", "Yes"],
  },
  {
    label: "Preferred move-in date",
    type: "date",
  },
  {
    label: "Employment status",
    type: "select",
    options: [
      "Employed",
      "Self Employed",
      "Student",
      "Retired",
      "Other",
    ],
  },
  {
    label: "Can you provide proof of income?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    label: "Can you provide landlord references?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    label: "Can you complete UK Right to Rent checks?",
    type: "select",
    options: ["Yes", "No"],
  },
];

export default function EligibilityForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const question = questions[step];

  const handleNext = (value: string) => {
    const updated = [...answers];
    updated[step] = value;
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  const eligible =
    answers[9] === "Yes" &&
    answers[10] === "Yes" &&
    answers[11] === "Yes";

  if (step >= questions.length) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        {eligible ? (
          <>
            <h2 className="text-3xl font-bold text-green-600">
              Great news!
            </h2>

            <p className="mt-4">
              You can continue to book your viewing.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-yellow-600">
              Thank You
            </h2>

            <p className="mt-4">
              We need some additional information before arranging
              your viewing.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">

      <p className="text-sm text-gray-500">
        Question {step + 1} of {questions.length}
      </p>

      <h2 className="mt-3 text-2xl font-bold">
        {question.label}
      </h2>

      {question.type === "select" ? (
        <div className="mt-8 space-y-3">
          {question.options?.map((option) => (
            <button
              key={option}
              onClick={() => handleNext(option)}
              className="w-full rounded-lg border p-4 hover:bg-blue-900 hover:text-white"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <input
          type={question.type}
          className="mt-8 w-full rounded-lg border p-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleNext((e.target as HTMLInputElement).value);
            }
          }}
        />
      )}
    </div>
  );
}