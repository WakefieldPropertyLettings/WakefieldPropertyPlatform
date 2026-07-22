import ContactForm from "@/components/forms/ContactForm";

export default function LandlordPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <ContactForm
          title="Landlord Enquiry"
          description="Interested in our property management services? We'd love to hear from you."
        />
      </div>
    </main>
  );
}