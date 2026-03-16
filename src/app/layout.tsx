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
    "Interactive reference tool for 64 cryptographic algorithms across 12 categories. Compare security levels, key sizes, performance, and attack complexity.",
  keywords: ["cryptography", "post-quantum", "NIST", "ML-KEM", "ML-DSA", "AES", "ChaCha20", "SHA-3", "Argon2", "algorithm comparison", "PQC"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "crypto::compare — Cryptographic Algorithm Reference",
    description: "Interactive reference for 64 cryptographic algorithms — 12 categories, post-quantum, international standards. Compare side by side.",
    type: "website",
    siteName: "crypto::compare",
  },
  twitter: {
    card: "summary_large_image",
    title: "crypto::compare",
    description: "Interactive cryptographic algorithm reference — 12 categories, 64 algorithms, PQ-safe recommendations.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "crypto::compare",
              description: "Interactive reference tool for 64 cryptographic algorithms across 12 categories.",
              applicationCategory: "ReferenceApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires JavaScript",
              keywords: "cryptography, post-quantum, NIST, ML-KEM, ML-DSA, AES, algorithm comparison",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
