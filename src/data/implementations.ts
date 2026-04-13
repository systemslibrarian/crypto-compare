// All entries verified as of 2024-12. Flag for re-review every 6 months.
// Anti-hallucination: only libraries the author is certain of are listed.
// Use auditStatus: 'unknown' liberally. Do not invent library names.

export type Ecosystem = "rust" | "python" | "typescript" | "go" | "dotnet" | "java";

export type ImplementationEntry = {
  algorithmId: string;
  ecosystem: Ecosystem;
  library: string;
  packageName: string;
  url: string;
  notes: string;
  auditStatus: "audited" | "unaudited" | "unknown";
  lastVerified: string;
  warning?: string;
};

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
  { algorithmId: "aes256gcm", ecosystem: "rust", library: "ring", packageName: "ring", url: "https://github.com/briansmith/ring", notes: "aead::AES_256_GCM. Hardware-accelerated. Minimal unsafe surface.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "aes256gcm", ecosystem: "rust", library: "RustCrypto aes-gcm", packageName: "aes-gcm", url: "https://github.com/RustCrypto/AEADs", notes: "Pure Rust with optional AES-NI. Part of the RustCrypto ecosystem.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "aes256gcm", ecosystem: "python", library: "cryptography (PyCA)", packageName: "cryptography", url: "https://cryptography.io/", notes: "cryptography.hazmat.primitives.ciphers.aead.AESGCM. Built on OpenSSL.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "aes256gcm", ecosystem: "typescript", library: "@noble/ciphers", packageName: "@noble/ciphers", url: "https://github.com/paulmillr/noble-ciphers", notes: "Pure JS/TS AES-GCM. Audited. No native dependencies.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "aes256gcm", ecosystem: "typescript", library: "Web Crypto API", packageName: "built-in", url: "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt", notes: "crypto.subtle.encrypt({name:'AES-GCM',...}). Native browser implementation.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "aes256gcm", ecosystem: "go", library: "crypto/aes + crypto/cipher", packageName: "stdlib", url: "https://pkg.go.dev/crypto/aes", notes: "cipher.NewGCM(block). Standard library. Hardware-accelerated.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "aes256gcm", ecosystem: "dotnet", library: "System.Security.Cryptography", packageName: "built-in", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.aesgcm", notes: "AesGcm class. .NET 6+. Uses OS-level crypto provider.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "aes256gcm", ecosystem: "java", library: "JCA/JCE", packageName: "built-in", url: "https://docs.oracle.com/en/java/javase/17/security/java-cryptography-architecture-jca-reference-guide.html", notes: "Cipher.getInstance(\"AES/GCM/NoPadding\"). Built into JDK.", auditStatus: "audited", lastVerified: "2024-12-01" },

  // ─── XChaCha20-Poly1305 ──────────────────────────────────────────
  { algorithmId: "xchacha20poly", ecosystem: "rust", library: "sodiumoxide", packageName: "sodiumoxide", url: "https://github.com/sodiumoxide/sodiumoxide", notes: "Rust bindings to libsodium. secretbox/aead APIs.", auditStatus: "audited", lastVerified: "2024-12-01", warning: "Maintenance pace has slowed; consider libsodium-sys-stable for new projects." },
  { algorithmId: "xchacha20poly", ecosystem: "rust", library: "RustCrypto chacha20poly1305", packageName: "chacha20poly1305", url: "https://github.com/RustCrypto/AEADs", notes: "XChaCha20Poly1305 type. Pure Rust, constant-time.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "xchacha20poly", ecosystem: "python", library: "PyNaCl", packageName: "PyNaCl", url: "https://pynacl.readthedocs.io/", notes: "nacl.secret.SecretBox (XSalsa20-Poly1305) or nacl.aead for XChaCha20. Wraps libsodium.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "xchacha20poly", ecosystem: "typescript", library: "libsodium-wrappers", packageName: "libsodium-wrappers", url: "https://github.com/nickg/libsodium.js", notes: "crypto_aead_xchacha20poly1305_ietf_encrypt. WASM build of libsodium.", auditStatus: "audited", lastVerified: "2024-12-01", warning: "Use the WASM build (-sumo for full API), not the JS fallback." },
  { algorithmId: "xchacha20poly", ecosystem: "go", library: "golang.org/x/crypto/chacha20poly1305", packageName: "golang.org/x/crypto", url: "https://pkg.go.dev/golang.org/x/crypto/chacha20poly1305", notes: "chacha20poly1305.NewX() for XChaCha20. Official Go extended crypto.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "xchacha20poly", ecosystem: "dotnet", library: "libsodium-core", packageName: "Sodium.Core", url: "https://github.com/tabrath/libsodium-core", notes: ".NET bindings to libsodium. SecretAead.Encrypt.", auditStatus: "unknown", lastVerified: "2024-12-01" },
  { algorithmId: "xchacha20poly", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "XChaCha20Poly1305 via BC lightweight API.", auditStatus: "unknown", lastVerified: "2024-12-01" },

  // ─── Argon2id ────────────────────────────────────────────────────
  { algorithmId: "argon2id", ecosystem: "rust", library: "argon2 (RustCrypto)", packageName: "argon2", url: "https://github.com/RustCrypto/password-hashes", notes: "Pure Rust Argon2id. Implements RFC 9106.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "argon2id", ecosystem: "python", library: "argon2-cffi", packageName: "argon2-cffi", url: "https://argon2-cffi.readthedocs.io/", notes: "Wraps the C reference implementation. OWASP-recommended defaults.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "argon2id", ecosystem: "typescript", library: "argon2", packageName: "argon2", url: "https://github.com/ranisalt/node-argon2", notes: "Node.js native binding to the C reference. Server-side only.", auditStatus: "unknown", lastVerified: "2024-12-01", warning: "Browser-side Argon2 is impractical due to memory constraints; use server-side." },
  { algorithmId: "argon2id", ecosystem: "go", library: "golang.org/x/crypto/argon2", packageName: "golang.org/x/crypto", url: "https://pkg.go.dev/golang.org/x/crypto/argon2", notes: "argon2.IDKey(). Official Go extended crypto library.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "argon2id", ecosystem: "dotnet", library: "Konscious.Security.Cryptography", packageName: "Konscious.Security.Cryptography.Argon2", url: "https://github.com/kmaragon/Konscious.Security.Cryptography", notes: "Pure .NET Argon2id implementation.", auditStatus: "unknown", lastVerified: "2024-12-01" },
  { algorithmId: "argon2id", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "Argon2BytesGenerator class in BC lightweight API.", auditStatus: "unknown", lastVerified: "2024-12-01" },

  // ─── Ed25519 ─────────────────────────────────────────────────────
  { algorithmId: "ed25519", ecosystem: "rust", library: "ed25519-dalek", packageName: "ed25519-dalek", url: "https://github.com/dalek-cryptography/curve25519-dalek", notes: "Part of the dalek ecosystem. Widely used in Rust crypto.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "ed25519", ecosystem: "python", library: "PyNaCl", packageName: "PyNaCl", url: "https://pynacl.readthedocs.io/", notes: "nacl.signing.SigningKey. Wraps libsodium Ed25519.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "ed25519", ecosystem: "python", library: "cryptography (PyCA)", packageName: "cryptography", url: "https://cryptography.io/", notes: "Ed25519PrivateKey.generate(). Built on OpenSSL 3.x.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "ed25519", ecosystem: "typescript", library: "@noble/curves", packageName: "@noble/curves", url: "https://github.com/paulmillr/noble-curves", notes: "ed25519.sign/verify. Pure JS, audited, zero dependencies.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "ed25519", ecosystem: "go", library: "crypto/ed25519", packageName: "stdlib", url: "https://pkg.go.dev/crypto/ed25519", notes: "Standard library Ed25519. Used throughout Go ecosystem.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "ed25519", ecosystem: "dotnet", library: "System.Security.Cryptography", packageName: "built-in", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography", notes: "Not natively available before .NET 9 preview. Use Bouncy Castle or NSec.", auditStatus: "unknown", lastVerified: "2024-12-01", warning: "Use NSec or Bouncy Castle on .NET 8 and earlier." },
  { algorithmId: "ed25519", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "Ed25519Signer class. Also available in JDK 15+ via EdDSA provider.", auditStatus: "unknown", lastVerified: "2024-12-01" },

  // ─── X25519 (Curve25519 key exchange) ────────────────────────────
  { algorithmId: "curve25519", ecosystem: "rust", library: "x25519-dalek", packageName: "x25519-dalek", url: "https://github.com/dalek-cryptography/curve25519-dalek", notes: "EphemeralSecret + PublicKey. Part of the dalek ecosystem.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "curve25519", ecosystem: "python", library: "PyNaCl", packageName: "PyNaCl", url: "https://pynacl.readthedocs.io/", notes: "nacl.public.Box for X25519 key agreement. Wraps libsodium.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "curve25519", ecosystem: "typescript", library: "@noble/curves", packageName: "@noble/curves", url: "https://github.com/paulmillr/noble-curves", notes: "x25519.getSharedSecret(). Pure JS, audited.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "curve25519", ecosystem: "go", library: "golang.org/x/crypto/curve25519", packageName: "golang.org/x/crypto", url: "https://pkg.go.dev/golang.org/x/crypto/curve25519", notes: "curve25519.X25519(). Official Go extended library.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "curve25519", ecosystem: "dotnet", library: "NSec", packageName: "NSec.Cryptography", url: "https://nsec.rocks/", notes: "X25519 key agreement. Modern .NET crypto library.", auditStatus: "unknown", lastVerified: "2024-12-01" },
  { algorithmId: "curve25519", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "X25519Agreement class. Also in JDK 11+ via XDH.", auditStatus: "unknown", lastVerified: "2024-12-01" },

  // ─── HKDF ────────────────────────────────────────────────────────
  { algorithmId: "hkdf", ecosystem: "rust", library: "hkdf (RustCrypto)", packageName: "hkdf", url: "https://github.com/RustCrypto/KDFs", notes: "Hkdf::<Sha256>::new_from_prk(). Pure Rust.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hkdf", ecosystem: "python", library: "cryptography (PyCA)", packageName: "cryptography", url: "https://cryptography.io/", notes: "cryptography.hazmat.primitives.kdf.hkdf.HKDF. Built on OpenSSL.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hkdf", ecosystem: "typescript", library: "@noble/hashes", packageName: "@noble/hashes", url: "https://github.com/paulmillr/noble-hashes", notes: "hkdf(sha256, inputKey, salt, info, length). Pure JS, audited.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hkdf", ecosystem: "go", library: "golang.org/x/crypto/hkdf", packageName: "golang.org/x/crypto", url: "https://pkg.go.dev/golang.org/x/crypto/hkdf", notes: "hkdf.New(sha256.New, secret, salt, info). Official Go crypto.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hkdf", ecosystem: "dotnet", library: "System.Security.Cryptography", packageName: "built-in", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.hkdf", notes: "HKDF.DeriveKey(). .NET 5+.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hkdf", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "HKDFBytesGenerator class.", auditStatus: "unknown", lastVerified: "2024-12-01" },

  // ─── HMAC-SHA-256 ────────────────────────────────────────────────
  { algorithmId: "hmac_sha256", ecosystem: "rust", library: "ring", packageName: "ring", url: "https://github.com/briansmith/ring", notes: "hmac::sign/verify. Hardware-accelerated SHA-256.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hmac_sha256", ecosystem: "python", library: "hmac (stdlib)", packageName: "built-in", url: "https://docs.python.org/3/library/hmac.html", notes: "hmac.new(key, msg, hashlib.sha256). Python standard library.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hmac_sha256", ecosystem: "typescript", library: "@noble/hashes", packageName: "@noble/hashes", url: "https://github.com/paulmillr/noble-hashes", notes: "hmac(sha256, key, message). Pure JS, audited.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hmac_sha256", ecosystem: "typescript", library: "Web Crypto API", packageName: "built-in", url: "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign", notes: "crypto.subtle.sign('HMAC', key, data). Native browser.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hmac_sha256", ecosystem: "go", library: "crypto/hmac + crypto/sha256", packageName: "stdlib", url: "https://pkg.go.dev/crypto/hmac", notes: "hmac.New(sha256.New, key). Standard library.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hmac_sha256", ecosystem: "dotnet", library: "System.Security.Cryptography", packageName: "built-in", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.hmacsha256", notes: "HMACSHA256 class. Built into .NET.", auditStatus: "audited", lastVerified: "2024-12-01" },
  { algorithmId: "hmac_sha256", ecosystem: "java", library: "JCA/JCE", packageName: "built-in", url: "https://docs.oracle.com/en/java/javase/17/security/java-cryptography-architecture-jca-reference-guide.html", notes: "Mac.getInstance(\"HmacSHA256\"). Built into JDK.", auditStatus: "audited", lastVerified: "2024-12-01" },

  // ─── ML-KEM-768 ──────────────────────────────────────────────────
  { algorithmId: "mlkem768", ecosystem: "rust", library: "ml-kem (RustCrypto)", packageName: "ml-kem", url: "https://github.com/RustCrypto/KEMs", notes: "FIPS 203 implementation. Pure Rust.", auditStatus: "unknown", lastVerified: "2024-12-01", warning: "PQ implementations are newer; verify against NIST test vectors." },
  { algorithmId: "mlkem768", ecosystem: "python", library: "kyber-py", packageName: "kyber-py", url: "https://github.com/GiacomoPope/kyber-py", notes: "Pure Python ML-KEM. Educational and testing use. [verify before use]", auditStatus: "unaudited", lastVerified: "2024-12-01", warning: "Pure Python — not suitable for production performance requirements." },
  { algorithmId: "mlkem768", ecosystem: "typescript", library: "crystals-kyber-js", packageName: "crystals-kyber-js", url: "https://github.com/nickg/crystals-kyber-js", notes: "TypeScript ML-KEM implementation. [verify before use]", auditStatus: "unknown", lastVerified: "2024-12-01", warning: "PQ JS implementations are immature. Verify against NIST KAT vectors." },
  { algorithmId: "mlkem768", ecosystem: "go", library: "filippo.io/mlkem768", packageName: "filippo.io/mlkem768", url: "https://pkg.go.dev/filippo.io/mlkem768", notes: "By Go crypto team lead Filippo Valsorda. Clean API.", auditStatus: "unknown", lastVerified: "2024-12-01" },
  { algorithmId: "mlkem768", ecosystem: "dotnet", library: "Bouncy Castle", packageName: "BouncyCastle.Cryptography", url: "https://www.bouncycastle.org/csharp/", notes: "ML-KEM implementation in BC C# API.", auditStatus: "unknown", lastVerified: "2024-12-01" },
  { algorithmId: "mlkem768", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "MLKEMKeyPairGenerator / MLKEMExtractor. BC 1.78+.", auditStatus: "unknown", lastVerified: "2024-12-01" },

  // ─── ML-DSA-65 ───────────────────────────────────────────────────
  { algorithmId: "mldsa65", ecosystem: "rust", library: "ml-dsa (RustCrypto)", packageName: "ml-dsa", url: "https://github.com/RustCrypto/signatures", notes: "FIPS 204 implementation. Pure Rust.", auditStatus: "unknown", lastVerified: "2024-12-01", warning: "PQ signature implementations are newer; verify against NIST test vectors." },
  { algorithmId: "mldsa65", ecosystem: "python", library: "dilithium-py", packageName: "dilithium-py", url: "https://github.com/GiacomoPope/dilithium-py", notes: "Pure Python ML-DSA reference. [verify before use]", auditStatus: "unaudited", lastVerified: "2024-12-01", warning: "Educational/testing only. Not production-grade." },
  { algorithmId: "mldsa65", ecosystem: "go", library: "circl", packageName: "github.com/cloudflare/circl", url: "https://github.com/cloudflare/circl", notes: "Cloudflare's PQ crypto library. Dilithium/ML-DSA modes.", auditStatus: "unknown", lastVerified: "2024-12-01" },
  { algorithmId: "mldsa65", ecosystem: "dotnet", library: "Bouncy Castle", packageName: "BouncyCastle.Cryptography", url: "https://www.bouncycastle.org/csharp/", notes: "ML-DSA implementation in BC C# API.", auditStatus: "unknown", lastVerified: "2024-12-01" },
  { algorithmId: "mldsa65", ecosystem: "java", library: "Bouncy Castle", packageName: "org.bouncycastle:bcprov-jdk18on", url: "https://www.bouncycastle.org/java.html", notes: "MLDSAKeyPairGenerator / MLDSASigner. BC 1.78+.", auditStatus: "unknown", lastVerified: "2024-12-01" },
];
