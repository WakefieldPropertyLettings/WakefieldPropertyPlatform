import BookingForm from "@/components/bookings/BookingForm";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-10 text-center text-4xl font-bold text-[#0B1F3A]">
          Book a Viewing
        </h1>

        <BookingForm />
      </div>
    </main>
  );
}