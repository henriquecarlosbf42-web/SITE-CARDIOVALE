import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InstallAppPrompt } from "@/components/site/InstallAppPrompt";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CardioVale — Instituto de Cardiologia do Vale do Paraíba",
  description:
    "CardioVale: consultas de cardiologia e exames (ECG, ecocardiograma, teste ergométrico, Holter, MAPA) em São José dos Campos.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <InstallAppPrompt />
      </body>
    </html>
  );
}
