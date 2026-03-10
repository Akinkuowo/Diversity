import type { Metadata } from "next";
import { Nunito_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diversity Network",
  description: "Fostering inclusion, diversity, and equity.",
};

import GoogleTranslate from "./components/GoogleTranslate";
import TranslationFixer from "./components/TranslationFixer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${nunito.className} ${geistMono.variable} antialiased`}
      >
        <TranslationFixer />
        {children}
        <Toaster position="bottom-right" />
        <GoogleTranslate />
      </body>
    </html>
  );
}
