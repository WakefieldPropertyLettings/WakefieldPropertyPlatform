import type { Metadata } from "next";
import PropertySEOPage from "@/components/property/PropertySEOPage";

export const metadata: Metadata = {
  title: "Rooms to Rent in Wakefield | Wakefield Property Lettings",
  description:
    "Find rooms to rent in Wakefield. Browse furnished rooms and shared accommodation available through Wakefield Property Lettings Ltd.",
  alternates: {
    canonical:
      "https://www.wakefieldpropertylettings.co.uk/rooms-to-rent-wakefield",
  },
};

export default function RoomsToRentWakefieldPage() {
  return (
    <PropertySEOPage
      eyebrow="Rooms to Rent"
      heading="Rooms to Rent in Wakefield"
      introduction="Looking for a room to rent in Wakefield? Browse our current room availability across Wakefield and surrounding areas, with accommodation suitable for working professionals, new starters and people relocating to the area."
      propertyTypes={["Room", "room"]}
      emptyMessage="We do not currently have a room listed on this page, but availability changes regularly."
      contentHeading="Finding a Room to Rent in Wakefield"
      content={[
        "Wakefield Property Lettings Ltd provides rooms in shared accommodation across Wakefield and surrounding areas. Individual properties may offer furnished accommodation, shared kitchens, shared living facilities and other features depending on the property.",
        "Wakefield is well connected for people working locally or commuting across West Yorkshire, with rail, bus and road connections serving the city and surrounding areas.",
        "Rental prices, deposits, bills and availability vary between properties. Check each individual listing for the latest information and complete our eligibility check if you would like to arrange a viewing.",
      ]}
    />
  );
}