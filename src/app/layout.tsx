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
    "Choose cryptography with evidence, tradeoffs, and safe defaults. 97 algorithms · 17 categories · real-world recommendations · implementation maps · architecture checklists.",
  keywords: ["cryptography", "post-quantum", "NIST", "ML-KEM", "ML-DSA", "AES", "ChaCha20", "SHA-3", "Argon2", "algorithm comparison", "PQC", "lattice", "hash-based", "KEM", "digital signatures"],
  robots: { index: true, follow: true },
  authors: [{ name: "crypto::compare contributors" }],
  creator: "crypto::compare",
  metadataBase: new URL("https://crypto-compare.systemslibrarian.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "crypto::compare — Cryptographic Algorithm Reference",
    description: "Choose cryptography with evidence, tradeoffs, and safe defaults. 97 algorithms · 17 categories · real-world recommendations.",
    type: "website",
    siteName: "crypto::compare",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "crypto::compare",
    description: "Cryptographic algorithm reference — 97 algorithms, 17 categories, safe defaults, implementation maps, and architecture checklists.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◈</text></svg>",
  },
  other: {
    "theme-color": "#070b12",
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
              description: "Choose cryptography with evidence, tradeoffs, and safe defaults. 97 algorithms · 17 categories · real-world recommendations · implementation maps.",
              applicationCategory: "ReferenceApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires JavaScript",
              keywords: "cryptography, post-quantum, NIST, ML-KEM, ML-DSA, AES, algorithm comparison",
              inLanguage: "en",
              isAccessibleForFree: true,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              about: {
                "@type": "Thing",
                name: "Cryptographic Algorithms",
                description: "Symmetric encryption, key encapsulation, digital signatures, hash functions, and more.",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
