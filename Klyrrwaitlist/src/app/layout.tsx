import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klyrr - Study Abroad AI",
  description: "Your AI-powered study abroad companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-cream text-burgundy antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}