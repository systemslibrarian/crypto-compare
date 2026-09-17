// `lastChecked` records the last catalog review, not an audit or security
// endorsement. An implementation is `evidence-linked` only when this dataset
// links the report and identifies its scope.

export type Ecosystem = "rust" | "python" | "typescript" | "go" | "dotnet" | "java";

export type ImplementationEntry = {
  algorithmId: string;
  ecosystem: Ecosystem;
  library: string;
  packageName: string;
  url: string;
  notes: string;
  auditStatus: "evidence-linked" | "not-evidenced";
  auditEvidence?: {
    label: string;
    url: string;
    published: string;
    scope: string;
  };
  lastChecked: string;
  warning?: string;
};

export function validateImplementationEvidence(entries: ImplementationEntry[]): string[] {
  return entries.flatMap((entry) => {
    if (entry.auditStatus === "evidence-linked" && !entry.auditEvidence) {
      return [`${entry.algorithmId}/${entry.ecosystem}/${entry.library}: audit evidence is missing`];
    }
    if (entry.auditStatus === "not-evidenced" && entry.auditEvidence) {
      return [`${entry.algorithmId}/${entry.ecosystem}/${entry.library}: evidence is linked but status is not-evidenced`];
    }
    return [];
  });
}

export function isImplementationCheckStale(
  isoDate: string,
  asOf = new Date(),
  maxAgeDays = 120,
): boolean {
  const checked = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(checked.getTime())) return true;
  return asOf.getTime() - checked.getTime() > maxAgeDays * 24 * 60 * 60 * 1000;
}

export const ECOSYSTEM_LABELS: Record<Ecosystem, { label: string; icon: string }> = {
  rust: { label: "Rust", icon: "🦀" },
  python: { label: "Python", icon: "🐍" },
  typescript: { label: "TypeScript", icon: "📘" },
  go: { label: "Go", icon: "🐹" },
  dotnet: { label: ".NET", icon: "🟣" },
  java: { label: "Java", icon: "☕" },
};

export const IMPLEMENTATIONS: ImplementationEntry[] = [
  // ─── AES-256-GCM ────────────────────────────────────────────────
  { algorithmId: "aes256gcm", ecosystem: "rust", library: "ring", packageName: "ring", url: "https://github.com/briansmith/ring", notes: "aead::AES_256_GCM. Hardware-accelerated. Minimal unsafe surface.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "aes256gcm", ecosystem: "rust", library: "RustCrypto aes-gcm", packageName: "aes-gcm", url: "https://github.com/RustCrypto/AEADs", notes: "Pure Rust with optional AES-NI. Part of the RustCrypto ecosystem.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "aes256gcm", ecosystem: "python", library: "cryptography (PyCA)", packageName: "cryptography", url: "https://cryptography.io/", notes: "cryptography.hazmat.primitives.ciphers.aead.AESGCM. Built on OpenSSL.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "aes256gcm", ecosystem: "typescript", library: "@noble/ciphers", packageName: "@noble/ciphers", url: "https://github.com/paulmillr/noble-ciphers", notes: "Pure JS/TS AES-GCM. No native dependencies.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "aes256gcm", ecosystem: "typescript", library: "Web Crypto API", packageName: "built-in", url: "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt", notes: "crypto.subtle.encrypt({name:'AES-GCM',...}). Native browser implementation.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "aes256gcm", ecosystem: "go", library: "crypto/aes + crypto/cipher", packageName: "stdlib", url: "https://pkg.go.dev/crypto/aes", notes: "cipher.NewGCM(block). Standard library. Hardware-accelerated.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "aes256gcm", ecosystem: "dotnet", library: "System.Security.Cryptography", packageName: "built-in", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.aesgcm", notes: "AesGcm class. .NET 6+. Uses OS-level crypto provider.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "aes256gcm", ecosystem: "java", library: "JCA/JCE", packageName: "built-in", url: "https://docs.oracle.com/en/java/javase/25/security/java-cryptography-architecture-jca-reference-guide.html", notes: "Cipher.getInstance(\"AES/GCM/NoPadding\"). Built into the JDK.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },

  // ─── XChaCha20-Poly1305 ──────────────────────────────────────────
  { algorithmId: "xchacha20poly", ecosystem: "rust", library: "RustCrypto chacha20poly1305", packageName: "chacha20poly1305", url: "https://github.com/RustCrypto/AEADs", notes: "XChaCha20Poly1305 type. Pure Rust, constant-time.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "xchacha20poly", ecosystem: "python", library: "PyNaCl", packageName: "PyNaCl", url: "https://pynacl.readthedocs.io/", notes: "nacl.secret.Aead uses XChaCha20-Poly1305-IETF and wraps libsodium.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "xchacha20poly", ecosystem: "typescript", library: "libsodium-wrappers", packageName: "libsodium-wrappers", url: "https://github.com/jedisct1/libsodium.js", notes: "crypto_aead_xchacha20poly1305_ietf_encrypt. WebAssembly and JavaScript builds of libsodium.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "Use the -sumo package only when the standard wrapper does not expose the API you need." },
  { algorithmId: "xchacha20poly", ecosystem: "go", library: "golang.org/x/crypto/chacha20poly1305", packageName: "golang.org/x/crypto", url: "https://pkg.go.dev/golang.org/x/crypto/chacha20poly1305", notes: "chacha20poly1305.NewX() for XChaCha20. Official Go extended crypto.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "xchacha20poly", ecosystem: "dotnet", library: "Sodium.Core", packageName: "Sodium.Core", url: "https://www.nuget.org/packages/Sodium.Core", notes: ".NET bindings to libsodium. SecretAead.Encrypt uses XChaCha20-Poly1305.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "Native libsodium deployment is platform-specific; verify the package's runtime assets for every target." },
  { algorithmId: "xchacha20poly", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "XChaCha20Poly1305 via BC lightweight API.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },

  // ─── Argon2id ────────────────────────────────────────────────────
  { algorithmId: "argon2id", ecosystem: "rust", library: "argon2 (RustCrypto)", packageName: "argon2", url: "https://github.com/RustCrypto/password-hashes", notes: "Pure Rust Argon2id. Implements RFC 9106.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "argon2id", ecosystem: "python", library: "argon2-cffi", packageName: "argon2-cffi", url: "https://argon2-cffi.readthedocs.io/", notes: "Wraps the C reference implementation. OWASP-recommended defaults.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "argon2id", ecosystem: "typescript", library: "argon2", packageName: "argon2", url: "https://github.com/ranisalt/node-argon2", notes: "Node.js native binding to the C reference. Server-side only.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "Browser-side Argon2 is impractical due to memory constraints; use server-side." },
  { algorithmId: "argon2id", ecosystem: "go", library: "golang.org/x/crypto/argon2", packageName: "golang.org/x/crypto", url: "https://pkg.go.dev/golang.org/x/crypto/argon2", notes: "argon2.IDKey(). Official Go extended crypto library.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "argon2id", ecosystem: "dotnet", library: "Konscious.Security.Cryptography", packageName: "Konscious.Security.Cryptography.Argon2", url: "https://github.com/kmaragon/Konscious.Security.Cryptography", notes: "Pure .NET Argon2id implementation.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "argon2id", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "Argon2BytesGenerator class in BC lightweight API.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },

  // ─── Ed25519 ─────────────────────────────────────────────────────
  { algorithmId: "ed25519", ecosystem: "rust", library: "ed25519-dalek", packageName: "ed25519-dalek", url: "https://github.com/dalek-cryptography/curve25519-dalek", notes: "Part of the dalek ecosystem. Widely used in Rust crypto.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "ed25519", ecosystem: "python", library: "PyNaCl", packageName: "PyNaCl", url: "https://pynacl.readthedocs.io/", notes: "nacl.signing.SigningKey. Wraps libsodium Ed25519.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "ed25519", ecosystem: "python", library: "cryptography (PyCA)", packageName: "cryptography", url: "https://cryptography.io/", notes: "Ed25519PrivateKey.generate(). Built on OpenSSL 3.x.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "ed25519", ecosystem: "typescript", library: "@noble/curves", packageName: "@noble/curves", url: "https://github.com/paulmillr/noble-curves", notes: "ed25519.sign/verify. Pure JS with zero dependencies.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "ed25519", ecosystem: "go", library: "crypto/ed25519", packageName: "stdlib", url: "https://pkg.go.dev/crypto/ed25519", notes: "Standard library Ed25519. Used throughout Go ecosystem.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "ed25519", ecosystem: "dotnet", library: "NSec", packageName: "NSec.Cryptography", url: "https://nsec.rocks/", notes: "SignatureAlgorithm.Ed25519. Managed API backed by the platform-supported NSec native runtime.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "This is a third-party package, not a System.Security.Cryptography primitive." },
  { algorithmId: "ed25519", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "Ed25519Signer class. Also available in JDK 15+ via EdDSA provider.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },

  // ─── X25519 (Curve25519 key exchange) ────────────────────────────
  { algorithmId: "curve25519", ecosystem: "rust", library: "x25519-dalek", packageName: "x25519-dalek", url: "https://github.com/dalek-cryptography/curve25519-dalek", notes: "EphemeralSecret + PublicKey. Part of the dalek ecosystem.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "curve25519", ecosystem: "python", library: "PyNaCl", packageName: "PyNaCl", url: "https://pynacl.readthedocs.io/", notes: "nacl.public.Box for X25519 key agreement. Wraps libsodium.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "curve25519", ecosystem: "typescript", library: "@noble/curves", packageName: "@noble/curves", url: "https://github.com/paulmillr/noble-curves", notes: "x25519.getSharedSecret(). Pure JS.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "curve25519", ecosystem: "go", library: "crypto/ecdh", packageName: "stdlib", url: "https://pkg.go.dev/crypto/ecdh", notes: "ecdh.X25519(). Standard-library X25519 key agreement.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "curve25519", ecosystem: "dotnet", library: "NSec", packageName: "NSec.Cryptography", url: "https://nsec.rocks/", notes: "X25519 key agreement. Modern .NET crypto library.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "curve25519", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "X25519Agreement class. Also in JDK 11+ via XDH.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },

  // ─── HKDF ────────────────────────────────────────────────────────
  { algorithmId: "hkdf", ecosystem: "rust", library: "hkdf (RustCrypto)", packageName: "hkdf", url: "https://github.com/RustCrypto/KDFs", notes: "Hkdf::<Sha256>::new_from_prk(). Pure Rust.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hkdf", ecosystem: "python", library: "cryptography (PyCA)", packageName: "cryptography", url: "https://cryptography.io/", notes: "cryptography.hazmat.primitives.kdf.hkdf.HKDF. Built on OpenSSL.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hkdf", ecosystem: "typescript", library: "@noble/hashes", packageName: "@noble/hashes", url: "https://github.com/paulmillr/noble-hashes", notes: "hkdf(sha256, inputKey, salt, info, length). Pure JS.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hkdf", ecosystem: "go", library: "crypto/hkdf", packageName: "stdlib", url: "https://pkg.go.dev/crypto/hkdf", notes: "hkdf.Key and hkdf.Extract/Expand. Standard-library RFC 5869 implementation.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hkdf", ecosystem: "dotnet", library: "System.Security.Cryptography", packageName: "built-in", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.hkdf?view=net-10.0", notes: "HKDF.DeriveKey/Extract/Expand implement RFC 5869.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hkdf", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "HKDFBytesGenerator class.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },

  // ─── HMAC-SHA-256 ────────────────────────────────────────────────
  { algorithmId: "hmac_sha256", ecosystem: "rust", library: "ring", packageName: "ring", url: "https://github.com/briansmith/ring", notes: "hmac::sign/verify. Hardware-accelerated SHA-256.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hmac_sha256", ecosystem: "python", library: "hmac (stdlib)", packageName: "built-in", url: "https://docs.python.org/3/library/hmac.html", notes: "hmac.new(key, msg, hashlib.sha256). Python standard library.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hmac_sha256", ecosystem: "typescript", library: "@noble/hashes", packageName: "@noble/hashes", url: "https://github.com/paulmillr/noble-hashes", notes: "hmac(sha256, key, message). Pure JS.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hmac_sha256", ecosystem: "typescript", library: "Web Crypto API", packageName: "built-in", url: "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign", notes: "crypto.subtle.sign('HMAC', key, data). Native browser.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hmac_sha256", ecosystem: "go", library: "crypto/hmac + crypto/sha256", packageName: "stdlib", url: "https://pkg.go.dev/crypto/hmac", notes: "hmac.New(sha256.New, key). Standard library.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hmac_sha256", ecosystem: "dotnet", library: "System.Security.Cryptography", packageName: "built-in", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.hmacsha256", notes: "HMACSHA256 class. Built into .NET.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "hmac_sha256", ecosystem: "java", library: "JCA/JCE", packageName: "built-in", url: "https://docs.oracle.com/en/java/javase/25/security/java-cryptography-architecture-jca-reference-guide.html", notes: "Mac.getInstance(\"HmacSHA256\"). Built into the JDK.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },

  // ─── ML-KEM-768 ──────────────────────────────────────────────────
  { algorithmId: "mlkem768", ecosystem: "rust", library: "ml-kem (RustCrypto)", packageName: "ml-kem", url: "https://github.com/RustCrypto/KEMs/tree/master/ml-kem", notes: "Pure Rust implementation of final FIPS 203 ML-KEM.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "The maintainer states that this crate has not been independently audited." },
  { algorithmId: "mlkem768", ecosystem: "python", library: "kyber-py", packageName: "kyber-py", url: "https://github.com/GiacomoPope/kyber-py", notes: "Pure Python implementation of final FIPS 203 ML-KEM.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "The project is for education and prototyping, not production cryptography." },
  { algorithmId: "mlkem768", ecosystem: "typescript", library: "@noble/post-quantum", packageName: "@noble/post-quantum", url: "https://github.com/paulmillr/noble-post-quantum", notes: "ml_kem768 implementation of final FIPS 203 with ACVP and Wycheproof correctness tests.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "The project reports no independent audit and cannot guarantee constant-time execution in JavaScript." },
  { algorithmId: "mlkem768", ecosystem: "go", library: "crypto/mlkem", packageName: "stdlib", url: "https://pkg.go.dev/crypto/mlkem", notes: "Standard-library implementation of final FIPS 203 ML-KEM, including ML-KEM-768.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "mlkem768", ecosystem: "dotnet", library: "System.Security.Cryptography", packageName: "built-in", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.mlkem?view=net-10.0", notes: "MLKem class for FIPS 203, including the ML-KEM-768 parameter set.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "Support is platform-dependent; check MLKem.IsSupported before use." },
  { algorithmId: "mlkem768", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "MLKEMKeyPairGenerator and MLKEMExtractor implement final FIPS 203 ML-KEM.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },

  // ─── ML-DSA-65 ───────────────────────────────────────────────────
  { algorithmId: "mldsa65", ecosystem: "rust", library: "ml-dsa (RustCrypto)", packageName: "ml-dsa", url: "https://github.com/RustCrypto/signatures/tree/master/ml-dsa", notes: "Pure Rust implementation of final FIPS 204 ML-DSA.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "The maintainer states that this crate has not been independently audited." },
  { algorithmId: "mldsa65", ecosystem: "python", library: "dilithium-py", packageName: "dilithium-py", url: "https://github.com/GiacomoPope/dilithium-py", notes: "Pure Python implementation of final FIPS 204 ML-DSA.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "The project is for education and prototyping, not production cryptography." },
  { algorithmId: "mldsa65", ecosystem: "typescript", library: "@noble/post-quantum", packageName: "@noble/post-quantum", url: "https://github.com/paulmillr/noble-post-quantum", notes: "ml_dsa65 implementation of final FIPS 204 with ACVP and Wycheproof correctness tests.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "The project reports no independent audit and cannot guarantee constant-time execution in JavaScript." },
  { algorithmId: "mldsa65", ecosystem: "go", library: "CIRCL", packageName: "github.com/cloudflare/circl/sign/mldsa", url: "https://github.com/cloudflare/circl/tree/main/sign/mldsa", notes: "Cloudflare CIRCL implementation of final FIPS 204 ML-DSA, including ML-DSA-65.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
  { algorithmId: "mldsa65", ecosystem: "dotnet", library: "System.Security.Cryptography", packageName: "built-in", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.mldsa?view=net-10.0", notes: "MLDsa class for FIPS 204, including the ML-DSA-65 parameter set.", auditStatus: "not-evidenced", lastChecked: "2026-09-17", warning: "Support is platform-dependent; check MLDsa.IsSupported before use." },
  { algorithmId: "mldsa65", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "MLDSAKeyPairGenerator and MLDSASigner implement final FIPS 204 ML-DSA.", auditStatus: "not-evidenced", lastChecked: "2026-09-17" },
];
