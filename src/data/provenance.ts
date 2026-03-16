import type { AlgorithmSource } from "@/types/crypto";

export const ALGORITHM_PROVENANCE: Record<string, { sources: AlgorithmSource[]; lastReviewed: string }> = {
  mlkem768: {
    lastReviewed: "2026-03-16",
    sources: [
      {
        label: "NIST FIPS 203",
        url: "https://csrc.nist.gov/pubs/fips/203/final",
        note: "Defines ML-KEM parameter sets including ML-KEM-768.",
        kind: "standard",
      },
      {
        label: "NIST PQC Project",
        url: "https://csrc.nist.gov/projects/post-quantum-cryptography",
        note: "Selection and deployment context for PQ KEM transition.",
        kind: "analysis",
      },
    ],
  },
  mldsa65: {
    lastReviewed: "2026-03-16",
    sources: [
      {
        label: "NIST FIPS 204",
        url: "https://csrc.nist.gov/pubs/fips/204/final",
        note: "Defines ML-DSA parameter sets and signature sizes.",
        kind: "standard",
      },
    ],
  },
  argon2id: {
    lastReviewed: "2026-03-16",
    sources: [
      {
        label: "RFC 9106",
        url: "https://www.rfc-editor.org/rfc/rfc9106",
        note: "Primary specification and recommended Argon2id guidance.",
        kind: "standard",
      },
      {
        label: "OWASP Password Storage",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
        note: "Deployment-focused tuning recommendations.",
        kind: "deployment",
      },
    ],
  },
  chacha20poly: {
    lastReviewed: "2026-03-16",
    sources: [
      {
        label: "RFC 8439",
        url: "https://www.rfc-editor.org/rfc/rfc8439",
        note: "Specifies ChaCha20-Poly1305 construction and limits.",
        kind: "standard",
      },
    ],
  },
  xchacha20poly: {
    lastReviewed: "2026-03-16",
    sources: [
      {
        label: "libsodium XChaCha20 docs",
        url: "https://doc.libsodium.org/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction",
        note: "Construction and nonce-extension details used in major implementations.",
        kind: "deployment",
      },
    ],
  },
};
