import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://escualia.es", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://escualia.es/privacidad", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://escualia.es/terminos", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
