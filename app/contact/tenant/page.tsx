import ContactForm from "@/components/forms/ContactForm";

export default function TenantPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <ContactForm
          title="Tenant Enquiry"
          description="Need help renting a property? Send us your enquiry."
        />
      </div>
    </main>
  );
}