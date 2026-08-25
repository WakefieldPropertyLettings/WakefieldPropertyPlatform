import type { Metadata } from "next";
import PropertySEOPage from "@/components/property/PropertySEOPage";

export const metadata: Metadata = {
  title: "En-Suite Rooms to Rent in Wakefield | Wakefield Property Lettings",
  description:
    "Find en-suite rooms to rent in Wakefield. Browse private en-suite accommodation and current rental availability with Wakefield Property Lettings Ltd.",
  alternates: {
    canonical:
      "https://www.wakefieldpropertylettings.co.uk/ensuite-rooms-wakefield",
  },
};

export default function EnsuiteRoomsWakefieldPage() {
  return (
    <PropertySEOPage
      eyebrow="En-Suite Rooms"
      heading="En-Suite Rooms to Rent in Wakefield"
      introduction="Browse en-suite rooms to rent in Wakefield and surrounding areas. Find accommodation offering the privacy of your own bathroom while retaining the convenience and affordability of shared living."
      propertyTypes={[
        "Ensuite",
        "ensuite",
        "En-suite",
        "en-suite",
        "En Suite",
        "en suite",
        "Ensuite Room",
        "En-suite Room",
      ]}
      emptyMessage="We do not currently have an en-suite room listed on this page, but availability changes regularly."
      contentHeading="Find an En-Suite Room in Wakefield"
      content={[
        "Our en-suite rooms offer tenants additional privacy while living in shared accommodation. Individual property features vary, so check each listing for information about furnishings, bills, kitchens, communal areas and other facilities.",
        "We provide rental accommodation across Wakefield and surrounding areas for working professionals, people relocating to the area and other eligible tenants.",
        "Availability can change quickly. Browse the current listings above and complete our eligibility check if you are interested in arranging a viewing.",
      ]}
    />
  );
}