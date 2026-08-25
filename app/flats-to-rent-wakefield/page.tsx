import type { Metadata } from "next";
import PropertySEOPage from "@/components/property/PropertySEOPage";

export const metadata: Metadata = {
  title: "Flats to Rent in Wakefield | Wakefield Property Lettings",
  description:
    "Browse flats to rent in Wakefield. Find current apartments and flats available through Wakefield Property Lettings Ltd.",
  alternates: {
    canonical:
      "https://www.wakefieldpropertylettings.co.uk/flats-to-rent-wakefield",
  },
};

export default function FlatsWakefieldPage() {
  return (
    <PropertySEOPage
      eyebrow="Flats to Rent"
      heading="Flats to Rent in Wakefield"
      introduction="Browse flats and apartments to rent in Wakefield and surrounding areas. View current prices, deposits, availability and property details online."
      propertyTypes={[
        "Flat",
        "flat",
        "Apartment",
        "apartment",
      ]}
      emptyMessage="We do not currently have a flat listed on this page. Please check our other properties or return soon for new availability."
      contentHeading="Find a Flat to Rent in Wakefield"
      content={[
        "Wakefield Property Lettings Ltd markets rental accommodation across Wakefield and surrounding areas, including flats and apartments when available.",
        "Individual listings provide information about rent, deposits, bedrooms, furnishings, bills and availability so you can identify properties suitable for your requirements.",
        "Browse the available properties above or complete our eligibility check if you would like our team to review your rental requirements.",
      ]}
    />
  );
}