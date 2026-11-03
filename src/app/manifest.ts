import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TRIVA Outdoor — Style on the Trail",
    short_name: "TRIVA Outdoor",
    description: "Sewa Alat Outdoor, Camping, & Hiking Premium",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#851919",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
