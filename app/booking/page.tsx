import BookingForm from "@/components/bookings/BookingForm";

type BookingPageProps = {
  searchParams: Promise<{
    propertyId?: string;
  }>;
};

export default async function BookingPage({
  searchParams,
}: BookingPageProps) {
  const params = await searchParams;

  const parsedPropertyId = Number(params.propertyId);

  const propertyId =
    Number.isInteger(parsedPropertyId) &&
    parsedPropertyId > 0
      ? parsedPropertyId
      : null;

  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-10 text-center text-4xl font-bold text-[#0B1F3A]">
          Book a Viewing
        </h1>

        <BookingForm propertyId={propertyId} />
      </div>
    </main>
  );
}