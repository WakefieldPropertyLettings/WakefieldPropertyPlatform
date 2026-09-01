import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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
    {
  url: `${baseUrl}/rooms-to-rent-wakefield`,
  lastModified: new Date(),
  changeFrequency: "daily",
  priority: 0.9,
},
{
  url: `${baseUrl}/ensuite-rooms-wakefield`,
  lastModified: new Date(),
  changeFrequency: "daily",
  priority: 0.9,
},
{
  url: `${baseUrl}/studios-to-rent-wakefield`,
  lastModified: new Date(),
  changeFrequency: "daily",
  priority: 0.9,
},
{
  url: `${baseUrl}/flats-to-rent-wakefield`,
  lastModified: new Date(),
  changeFrequency: "daily",
  priority: 0.9,
},
{
  url: `${baseUrl}/houses-to-rent-wakefield`,
  lastModified: new Date(),
  changeFrequency: "daily",
  priority: 0.9,
},
  ];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables missing for sitemap.");
      return staticPages;
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    const { data: properties, error } = await supabase
      .from("properties")
      .select("id")
      .order("id", { ascending: false });

    if (error) {
      console.error("Sitemap properties error:", error);
      return staticPages;
    }

    const propertyPages: MetadataRoute.Sitemap = (properties ?? []).map(
      (property) => ({
        url: `${baseUrl}/properties/${property.id}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      })
    );

    return [...staticPages, ...propertyPages];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticPages;
  }
}