import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CardioVale",
    short_name: "CardioVale",
    description:
      "Agende consultas, acompanhe exames e resultados direto pelo portal da CardioVale.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7a0f1f",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
