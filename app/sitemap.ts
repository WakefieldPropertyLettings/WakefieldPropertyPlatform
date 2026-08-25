import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.wakefieldpropertylettings.co.uk";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tenants`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/landlords`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/eligibility`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/fees`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const supabase = await createClient();

    const { data: properties, error } = await supabase
      .from("properties")
      .select("id")
      .order("id", { ascending: false });

    if (error) {
      console.error("Sitemap properties error:", error);
      return staticPages;
    }

    const propertyPages: MetadataRoute.Sitemap =
      (properties ?? []).map((property) => ({
        url: `${baseUrl}/properties/${property.id}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));

    return [...staticPages, ...propertyPages];
  } catch (error) {
    console.error("Sitemap generation error:", error);

    // Keep the sitemap working even if Supabase
    // temporarily cannot be reached.
    return staticPages;
  }
}