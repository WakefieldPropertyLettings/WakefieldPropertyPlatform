import type { Metadata } from "next";
import PropertySEOPage from "@/components/property/PropertySEOPage";

export const metadata: Metadata = {
  title: "Studios to Rent in Wakefield | Wakefield Property Lettings",
  description:
    "Find studios to rent in Wakefield. Browse self-contained studio accommodation and current availability with Wakefield Property Lettings Ltd.",
  alternates: {
    canonical:
      "https://www.wakefieldpropertylettings.co.uk/studios-to-rent-wakefield",
  },
};

export default function StudiosWakefieldPage() {
  return (
    <PropertySEOPage
      eyebrow="Studios to Rent"
      heading="Studios to Rent in Wakefield"
      introduction="Looking for a studio to rent in Wakefield? Browse our current studio accommodation for tenants looking for greater privacy and convenient access to Wakefield and surrounding areas."
      propertyTypes={[
        "Studio",
        "studio",
        "Studio Flat",
        "studio flat",
      ]}
      emptyMessage="We do not currently have a studio listed on this page, but new rental availability is added regularly."
      contentHeading="Studio Accommodation in Wakefield"
      content={[
        "Studio accommodation can be a convenient option for tenants looking for their own private living space. Features, furnishings, bills and facilities vary between individual properties.",
        "Our Wakefield studio listings provide clear information about monthly rent, deposits, availability and property features to help you compare suitable accommodation.",
        "Check the available studios above or complete our eligibility check to tell our team about your budget, preferred location and expected move-in date.",
      ]}
    />
  );
}