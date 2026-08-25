import type { Metadata } from "next";
import PropertySEOPage from "@/components/property/PropertySEOPage";

export const metadata: Metadata = {
  title: "Houses to Rent in Wakefield | Wakefield Property Lettings",
  description:
    "Browse houses to rent in Wakefield. Find furnished and unfurnished rental homes available through Wakefield Property Lettings Ltd.",
  alternates: {
    canonical:
      "https://www.wakefieldpropertylettings.co.uk/houses-to-rent-wakefield",
  },
};

export default function HousesWakefieldPage() {
  return (
    <PropertySEOPage
      eyebrow="Houses to Rent"
      heading="Houses to Rent in Wakefield"
      introduction="Looking for a house to rent in Wakefield? Browse our current houses and whole-property rentals across Wakefield and surrounding areas."
      propertyTypes={[
        "House",
        "house",
        "Terraced House",
        "Semi-Detached House",
        "Detached House",
      ]}
      emptyMessage="We do not currently have a house listed on this page, but new properties are added as they become available."
      contentHeading="Rental Houses in Wakefield"
      content={[
        "Our house listings may include accommodation suitable for professionals, couples, families and other eligible tenants looking for a whole property in the Wakefield area.",
        "Each listing provides information about monthly rent, deposit, bedrooms, bathrooms, furnishings and availability, together with photographs and other relevant property details.",
        "Browse our current houses above and complete the eligibility check if you would like to arrange a viewing or discuss your requirements with our team.",
      ]}
    />
  );
}