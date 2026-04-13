import type { RecommendationLevel } from "@/types/crypto";

export type MigrationPath = {
  id: string;
  from: string;
  to: string;
  priority: "critical" | "high" | "medium";
  recommendation: RecommendationLevel;
  whyMigrate: string;
  riskOfStaying: string;
  safeUpgradePath: string[];
  migrationPitfall: string;
  fromAlgorithmId?: string;
  toAlgorithmId: string;
};

export const MIGRATION_PATHS: MigrationPath[] = [
  {
    id: "md5-to-sha256",
    from: "MD5 anywhere",
    to: "SHA-256",
    priority: "critical",
    recommendation: "avoid",
    fromAlgorithmId: undefined,
    toAlgorithmId: "sha256",
    whyMigrate:
      "MD5 has been collision-broken since 2004 (Xiaoyun Wang et al.). Practical chosen-prefix collisions demonstrated in 2009. Used to forge rogue CA certificates. No remaining security margin.",
    riskOfStaying:
      "An attacker can create two different files with the same MD5 hash. In certificate contexts, this enables CA impersonation. In software distribution, it enables silent binary replacement. Compliance frameworks prohibit MD5 for integrity.",
    safeUpgradePath: [
      "Identify all MD5 usage: file checksums, API signatures, database integrity, certificate fingerprints.",
      "Replace with SHA-256 — drop-in replacement for all integrity use cases.",
      "Update verification logic to accept SHA-256 digests.",
      "Run parallel verification (old MD5 + new SHA-256) during rollout, then remove MD5 path.",
    ],
    migrationPitfall:
      "Some systems use MD5 for non-cryptographic purposes (cache keys, dedup). These are safe but should still be migrated to avoid audit confusion and to prevent accidental use in security-sensitive paths.",
  },
  {
    id: "sha1-to-sha256",
    from: "SHA-1 anywhere",
    to: "SHA-256 or BLAKE3",
    priority: "high",
    recommendation: "avoid",
    fromAlgorithmId: undefined,
    toAlgorithmId: "sha256",
    whyMigrate:
      "SHA-1 collision was demonstrated in 2017 (SHAttered attack, Google/CWI). Chosen-prefix collisions published in 2020 (SHA-1 is a Shambles). All major browsers and CAs have deprecated SHA-1 certificates.",
    riskOfStaying:
      "Collision attacks enable signature forgery in document signing and certificate chains. Git uses SHA-1 for object integrity — practical attacks motivated the SHA-256 migration in Git. Continued use fails NIST and PCI-DSS compliance requirements.",
    safeUpgradePath: [
      "Audit all SHA-1 usage: git commit signing, HMAC constructions, certificate validation, file dedup.",
      "Replace with SHA-256 for interoperability, or BLAKE3 for performance-sensitive paths.",
      "For HMAC-SHA-1: HMAC's security proof still holds even with collision-broken hashes, but migrate to HMAC-SHA-256 anyway for defense in depth and compliance.",
      "Update signature verification to reject SHA-1-signed artifacts.",
    ],
    migrationPitfall:
      "HMAC-SHA-1 is technically not broken by collision attacks (HMAC security proof does not require collision resistance). However, auditors and compliance frameworks still flag it, and there is no performance reason to keep it. Migrate anyway.",
  },
  {
    id: "pbkdf2-to-argon2id",
    from: "PBKDF2 or bcrypt",
    to: "Argon2id",
    priority: "high",
    recommendation: "recommended",
    fromAlgorithmId: "pbkdf2_pw",
    toAlgorithmId: "argon2id",
    whyMigrate:
      "PBKDF2 is not memory-hard — a GPU can run thousands of PBKDF2 instances in parallel with minimal memory. bcrypt is better (Blowfish key schedule is memory-bound) but truncates passwords at 72 bytes and has no parallelism resistance tuning. Argon2id provides memory hardness, GPU/ASIC resistance, and side-channel resistance in one algorithm.",
    riskOfStaying:
      "After a database breach, PBKDF2 hashes can be cracked at rates of ~1M guesses/sec per GPU for typical iteration counts. bcrypt is slower but still lacks the memory-hard defense that makes Argon2id significantly more expensive to attack at scale.",
    safeUpgradePath: [
      "Implement Argon2id with OWASP-recommended parameters: minimum 19 MiB memory, 2 iterations, 1 degree of parallelism.",
      "On next user login (when you have the plaintext password), verify against old hash, then re-hash with Argon2id and store the new hash.",
      "Mark users who have not logged in for migration-window period for forced password reset.",
      "Remove old hash format support after migration window closes.",
    ],
    migrationPitfall:
      "Do not force all users to reset passwords simultaneously — this creates a massive credential-reset attack surface. Use opportunistic re-hashing on login. Set a reasonable migration window (e.g., 6-12 months) before forcing resets for inactive accounts.",
  },
  {
    id: "aescbc-to-aesgcm",
    from: "AES-CBC + separate HMAC",
    to: "AES-256-GCM (AEAD)",
    priority: "high",
    recommendation: "recommended",
    fromAlgorithmId: undefined,
    toAlgorithmId: "aes256gcm",
    whyMigrate:
      "AES-CBC without authentication is vulnerable to padding oracle attacks (Vaudenay 2002), which recover full plaintext. Even with a separate HMAC, the encrypt-then-MAC composition must be implemented exactly right — MAC-then-encrypt (the wrong order) leaves the padding oracle open.",
    riskOfStaying:
      "Padding oracle attacks against AES-CBC have been demonstrated in production against ASP.NET, Java Server Faces, and TLS (Lucky13, POODLE). Encrypt-then-MAC mitigates this but is easy to implement incorrectly. AEAD eliminates the entire class of vulnerability.",
    safeUpgradePath: [
      "Replace AES-CBC + HMAC with AES-256-GCM, which provides integrated authentication.",
      "Migrate stored ciphertext: decrypt with old scheme, re-encrypt with AES-256-GCM, mark with version indicator.",
      "Use a format version byte in your ciphertext envelope so old and new formats coexist during rollout.",
      "Verify that your AES-GCM implementation checks the authentication tag before releasing any plaintext.",
    ],
    migrationPitfall:
      "Do not mix up encrypt-then-MAC with MAC-then-encrypt during the transition. If you must support CBC during migration, ensure the MAC covers the ciphertext (not the plaintext) and is verified before any decryption occurs.",
  },
  {
    id: "rsa-to-ed25519",
    from: "RSA-2048 signatures",
    to: "Ed25519",
    priority: "medium",
    recommendation: "recommended",
    fromAlgorithmId: "rsa_oaep_2048",
    toAlgorithmId: "ed25519",
    whyMigrate:
      "RSA-2048 provides ~112 bits of classical security — adequate until ~2030 per NIST guidance, but below modern minimums for new systems. Ed25519 provides 128-bit classical security with 64-byte signatures (vs. 256-byte RSA signatures), deterministic nonce generation (eliminating a major class of ECDSA bugs), and significantly faster signing and verification.",
    riskOfStaying:
      "RSA-2048 is not immediately broken, but new systems should not choose it. The key sizes are large, performance is slower than ECC, and there is no path to post-quantum safety (Shor's algorithm breaks all RSA key sizes). Organizations continuing to deploy RSA for new systems accumulate migration debt.",
    safeUpgradePath: [
      "Generate new Ed25519 signing keys alongside existing RSA keys.",
      "Implement algorithm agility: accept both RSA and Ed25519 signatures during the transition.",
      "Sign new artifacts with Ed25519 (and optionally dual-sign with RSA for backward compatibility).",
      "After downstream consumers have updated, stop accepting RSA-only signatures.",
    ],
    migrationPitfall:
      "Ed25519 uses a different key format than RSA. Do not attempt to 'convert' RSA keys to Ed25519 — generate fresh keys. Ensure your PKI and certificate issuance pipeline supports Ed25519 before migrating.",
  },
  {
    id: "x25519-to-hybrid",
    from: "X25519-only key exchange",
    to: "X25519 + ML-KEM-768 hybrid",
    priority: "medium",
    recommendation: "recommended",
    fromAlgorithmId: "curve25519",
    toAlgorithmId: "mlkem768",
    whyMigrate:
      "X25519 is classically secure but provides zero post-quantum security. Shor's algorithm on a sufficiently large quantum computer would break all elliptic curve key exchange. The harvest-now-decrypt-later threat means data encrypted today under classical-only key exchange may be retroactively compromised.",
    riskOfStaying:
      "Data exchanged today under X25519-only key agreement can be stored by adversaries and decrypted when quantum computers become available. For long-lived secrets (medical records, national security, legal communications), the risk window may already be relevant.",
    safeUpgradePath: [
      "Deploy ML-KEM-768 alongside X25519 in a hybrid scheme: both key exchanges happen, shared secrets are concatenated and fed through HKDF.",
      "For TLS: use hybrid key share extension (already supported in Chrome 124+, Firefox 132+, Cloudflare, AWS).",
      "For application-layer protocols: combine X25519 and ML-KEM encapsulation, derive the session key via HKDF(X25519_ss || ML-KEM_ss).",
      "Verify that the combiner is a proper KDF (HKDF) — never XOR shared secrets directly.",
    ],
    migrationPitfall:
      "The hybrid approach is additive — do not remove X25519. If ML-KEM's lattice assumptions break before quantum computers arrive, X25519 is your safety net. The hybrid scheme is secure if either assumption holds.",
  },
  {
    id: "tls10-to-tls13",
    from: "TLS 1.0 / 1.1",
    to: "TLS 1.3",
    priority: "high",
    recommendation: "recommended",
    fromAlgorithmId: undefined,
    toAlgorithmId: "chacha20poly",
    whyMigrate:
      "TLS 1.0 and 1.1 are deprecated by IETF (RFC 8996, March 2021) and removed from all major browsers. They support weak cipher suites, lack forward secrecy by default, and are vulnerable to BEAST, POODLE, Lucky13, and FREAK attacks. PCI-DSS prohibited TLS 1.0 since June 2018.",
    riskOfStaying:
      "Active exploitation: TLS 1.0/1.1 downgrade attacks are practical. Compliance failure: PCI-DSS, HIPAA, FedRAMP all require TLS 1.2 minimum. Browser rejection: Chrome, Firefox, Safari, and Edge all refuse TLS 1.0/1.1 connections.",
    safeUpgradePath: [
      "Configure servers to offer TLS 1.3 as preferred, TLS 1.2 as fallback. Disable TLS 1.0 and 1.1 entirely.",
      "Enable only forward-secret cipher suites: ECDHE + AES-256-GCM or ChaCha20-Poly1305.",
      "Test with SSL Labs or testssl.sh to verify no legacy protocol support remains.",
      "Monitor for client-side failures — extremely old clients may not support TLS 1.2/1.3, but these are vanishingly rare.",
    ],
    migrationPitfall:
      "Do not enable TLS 1.0/1.1 'just for one legacy client.' A single weak protocol version available on a server enables downgrade attacks that affect all clients. Address the legacy client instead of weakening the server.",
  },
  {
    id: "static-rsa-to-ecdhe",
    from: "Static RSA key exchange",
    to: "Forward-secret (ECDHE) via TLS 1.3",
    priority: "high",
    recommendation: "recommended",
    fromAlgorithmId: "rsa_oaep_2048",
    toAlgorithmId: "curve25519",
    whyMigrate:
      "Static RSA key exchange encrypts the pre-master secret with the server's RSA public key. If the server's private key is ever compromised — by theft, legal order, or vulnerability — every past session encrypted under that key can be decrypted retroactively. TLS 1.3 eliminates static RSA key exchange entirely, mandating ephemeral (EC)DHE.",
    riskOfStaying:
      "Complete retroactive decryption of all recorded sessions if the server key is compromised. This is not theoretical — intelligence agencies and threat actors routinely record encrypted traffic for later decryption. The Heartbleed vulnerability (2014) demonstrated that server key compromise is a realistic threat.",
    safeUpgradePath: [
      "Upgrade to TLS 1.3, which mandates forward-secret key exchange and does not support static RSA.",
      "If stuck on TLS 1.2, disable RSA key exchange cipher suites and enable only ECDHE suites.",
      "Prefer X25519 for the ECDHE key agreement — simpler, faster, fewer implementation pitfalls than P-256.",
      "Deploy hybrid X25519 + ML-KEM-768 where TLS stack support is available for post-quantum readiness.",
    ],
    migrationPitfall:
      "Simply upgrading to TLS 1.2 is not sufficient — TLS 1.2 still supports static RSA key exchange by default. You must explicitly configure cipher suite preferences to exclude RSA key exchange and prefer ECDHE suites.",
  },
];
