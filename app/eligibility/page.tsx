"use client";

import { useState } from "react";
import ProgressBar from "./components/ProgressBar";
import QuestionCard from "./components/QuestionCard";
import { questions } from "./components/questions";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function EligibilityPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const router = useRouter();

  const question = questions[step];
  console.log(questions);

  function updateAnswer(value: string) {
    setAnswers((prev) => ({
      ...prev,
      [question.key]: value,
    }));
  }

  async function nextStep() {
    const currentQuestion = questions[step];
    const answer = answers[currentQuestion.key];

    // -----------------------------
    // Question 1
    // -----------------------------
    if (currentQuestion.key === "enquiryFor") {

  console.log("Answer =", answer);

  if (answer === "Yes") {
    console.log("Going to Living With");
    setStep(1);
    return;
  }

  if (answer === "No") {
    console.log("Going to Other Person");
    setStep(2);
    return;
  }
}

    // -----------------------------
    // After Living With OR Other Person
    // -----------------------------
    if (
      currentQuestion.key === "livingWith" ||
      currentQuestion.key === "otherPerson"
    ) {
      setStep(3); // Employment
      return;
    }

    // -----------------------------
    // Employment Logic
    // -----------------------------
    if (currentQuestion.key === "employment") {
      if (
        answer === "Student" ||
        answer === "Retired" ||
        answer === "Currently Not Working"
      ) {
        // Skip Payslips & Bank Statements
        setStep(6);
        return;
      }
    }

    // -----------------------------
    // Benefits Logic
    // -----------------------------
    if (currentQuestion.key === "benefits") {
      if (answer === "No") {
        // Skip Benefit Type
        setStep(step + 2);
        return;
      }
    }

    // -----------------------------
    // Normal Next
    // -----------------------------
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    // -----------------------------
    // Save to Supabase
    // -----------------------------
    const { error } = await supabase
      .from("enquiries")
      .insert([
  {
    enquiry_for: answers.enquiryFor,
    other_person: answers.otherPerson,
    living_with: answers.livingWith,

    employment: answers.employment,
    payslips: answers.payslips,
    bank_statements: answers.bankStatements,

    current_address: answers.currentAddress,
    landlord_reference: answers.landlordReference,

    property_type: answers.propertyType,
    bedrooms: answers.bedrooms,
    budget: answers.budget,
    move_date: answers.moveDate,

    benefits: answers.benefits,
    benefit_type: answers.benefitType,

    immigration_status: answers.immigrationStatus,

    full_name: answers.fullName,
    phone: answers.phone,
    email: answers.email,
  },
]);

    if (error) {
      console.error(error);
      alert("Something went wrong.");
      return;
    }

    router.push("/eligibility/success");
  }

  function previousStep() {
  const currentQuestion = questions[step];

  // If we're on either follow-up question,
  // go back to the first question.
  if (
    currentQuestion.key === "livingWith" ||
    currentQuestion.key === "otherPerson"
  ) {
    setStep(0);
    return;
  }

  // If we're on Employment,
  // go back to whichever follow-up question the user answered.
  if (currentQuestion.key === "employment") {
    if (answers.enquiryFor === "Yes") {
      setStep(1);
    } else {
      setStep(2);
    }
    return;
  }

  // Default behaviour
  if (step > 0) {
    setStep(step - 1);
  }
}

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-[#0B1F3A] py-16 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-5xl font-bold">
            Quick Eligibility Check
          </h1>

          <p className="mt-4 text-lg text-gray-300">
            This helps us understand your requirements before arranging a
            property viewing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <ProgressBar
          current={step + 1}
          total={questions.length}
        />

        <QuestionCard
          title={question.title}
          value={answers[question.key] || ""}
          options={question.options}
          placeholder="Type your answer..."
          onChange={updateAnswer}
        />

        <div className="mt-10 flex justify-between">
          <button
            onClick={previousStep}
            disabled={step === 0}
            className="rounded-2xl border-2 border-gray-300 bg-white px-10 py-4 font-bold disabled:opacity-40"
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            className="rounded-2xl bg-[#D4AF37] px-10 py-4 font-bold text-[#0B1F3A] hover:opacity-90"
          >
            {step === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </section>
    </main>
  );
}