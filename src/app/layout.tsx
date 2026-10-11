import type { Metadata } from "next";
import "./globals.css";
import { OG_ALGORITHM_LABEL, OG_CATEGORY_LABEL, OG_IMAGE_ALT } from "@/lib/siteStats";

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  // Next's static export uses inline bootstrap scripts. Keep this explicit
  // until the app can attach per-build hashes or nonces at an HTTP edge.
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

// Design language ported from the sibling reference site crypto-lab:
// DM Mono for body/UI/labels, Fraunces (serif) for display headings.
// The mono keeps the old CSS variable name so existing inline
// `var(--font-jetbrains-mono)` references resolve to DM Mono without edits.
// Keep the exact existing font bytes, subsets and fallback metrics in the
// repository. Google can return extensionless URLs that Next's loader rejects.
// See public/fonts/README.md for the immutable capture and both OFL licenses.
const fontBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "crypto::compare — Cryptographic Algorithm Reference",
  description: `Choose cryptography with evidence, tradeoffs, and safe defaults. ${OG_ALGORITHM_LABEL} · ${OG_CATEGORY_LABEL} · real-world recommendations · implementation maps · architecture checklists.`,
  keywords: ["cryptography", "post-quantum", "NIST", "ML-KEM", "ML-DSA", "AES", "ChaCha20", "SHA-3", "Argon2", "algorithm comparison", "PQC", "lattice", "hash-based", "KEM", "digital signatures"],
  robots: { index: true, follow: true },
  authors: [{ name: "crypto::compare contributors" }],
  creator: "crypto::compare",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://crypto-compare.systemslibrarian.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "crypto::compare — Cryptographic Algorithm Reference",
    description: `Choose cryptography with evidence, tradeoffs, and safe defaults. ${OG_ALGORITHM_LABEL} · ${OG_CATEGORY_LABEL} · real-world recommendations.`,
    url: "/",
    type: "website",
    siteName: "crypto::compare",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "crypto::compare",
    description: `Cryptographic algorithm reference — ${OG_ALGORITHM_LABEL}, ${OG_CATEGORY_LABEL}, safe defaults, implementation maps, and architecture checklists.`,
    images: ["/og.png"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◈</text></svg>",
  },
  other: {
    "theme-color": "#071016",
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
      <head>
        {/* GitHub Pages cannot set response headers. This meta policy still
            constrains document-loaded resources; frame-ancestors and other
            header-only directives must be configured if hosting moves. */}
        <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        <link rel="stylesheet" href={`${fontBasePath}/fonts/fonts.css`} />
        {["dm-mono-400-latin.woff2", "dm-mono-500-latin.woff2", "fraunces-400-600-latin.woff2"].map((file) => (
          <link key={file} rel="preload" href={`${fontBasePath}/fonts/${file}`} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body
        className="site-fonts min-h-screen antialiased"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "crypto::compare",
              description: `Choose cryptography with evidence, tradeoffs, and safe defaults. ${OG_ALGORITHM_LABEL} · ${OG_CATEGORY_LABEL} · real-world recommendations · implementation maps.`,
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
