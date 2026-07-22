import ContactForm from "@/components/forms/ContactForm";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <ContactForm
          title="Maintenance Request"
          description="Report a maintenance issue and our team will respond as quickly as possible."
        />
      </div>
    </main>
  );
}