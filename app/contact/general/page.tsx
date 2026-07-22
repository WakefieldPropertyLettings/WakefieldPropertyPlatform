import ContactForm from "@/components/forms/ContactForm";

export default function GeneralPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <ContactForm
          title="General Enquiry"
          description="Send us your enquiry and our team will get back to you as soon as possible."
        />
      </div>
    </main>
  );
}