import type { Metadata } from "next";
import { KlyrrProvider } from "@/context/KlyrrContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "KLYRR — Your Study Abroad Navigator",
  description: "Personalized guidance for international university applications.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-cream antialiased text-burgundy font-sans">
        <KlyrrProvider>
          {children}
        </KlyrrProvider>
      </body>
    </html>
  );
}