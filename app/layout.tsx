import type { Metadata, Viewport } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Find My RPG Table | Encontre sua Mesa de RPG",
  description:
    "Plataforma para encontrar e criar mesas de RPG. Conecte-se com jogadores, encontre campanhas e viva aventuras épicas.",
  keywords: ["RPG", "mesa de RPG", "D&D", "Tormenta", "campanhas", "jogadores"],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${cinzel.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
