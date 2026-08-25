import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.wakefieldpropertylettings.co.uk";

  const pages = [
    "",
    "/properties",
    "/about",
    "/tenants",
    "/landlords",
    "/contact",
    "/eligibility",
    "/faq",
    "/fees",
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "/properties" ? "daily" : "weekly",
    priority:
      page === ""
        ? 1
        : page === "/properties"
          ? 1
          : 0.7,
  }));
}