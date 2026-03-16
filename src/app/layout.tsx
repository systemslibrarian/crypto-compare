import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "crypto::compare — Cryptographic Algorithm Reference",
  description:
    "Interactive reference tool for 55+ cryptographic algorithms across 12 categories. Compare security levels, key sizes, performance, and attack complexity.",
  openGraph: {
    title: "crypto::compare",
    description: "Interactive cryptographic algorithm reference — 12 categories, 55+ algorithms, international.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.className} ${ibmPlexSans.variable} ${jetBrainsMono.variable} min-h-screen font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
