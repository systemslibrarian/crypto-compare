"use client";

import { useState } from "react";
import { RecommendationBadge, ReviewBadge, formatReviewDate } from "@/components/ui";
import { IMPLEMENTATIONS, ECOSYSTEM_LABELS } from "@/data/implementations";
import { getAssuranceProfile } from "@/lib/assurance";
import { DATASET_VERSION } from "@/lib/datasetVersion";
import {
  ADVISOR_RULESET_VERSION,
  advisorOptionId,
  resolveAdvisorChoicePath,
  type AdvisorDecisionStep,
  type AdvisorOutcome,
  type AdvisorRuleTree,
} from "@/lib/advisorEngine";
import type { Algorithm, AlgorithmCategory, AlgorithmSource } from "@/types/crypto";

export const DECISION_TREE: AdvisorRuleTree = {
  start: {
    question: "What do you need to do?",
    options: [
      { label: "Encrypt data with a shared key", next: "symmetric" },
      { label: "Establish a shared secret (key exchange)", next: "kem" },
      { label: "Prove who sent a message / sign code", next: "sig" },
      { label: "Hash data (fingerprint / integrity)", next: "hash" },
      { label: "Derive multiple keys from one secret", next: "kdf" },
      { label: "Authenticate a message (tamper detect)", next: "mac" },
      { label: "Store user passwords securely", next: "password" },
      { label: "Split a secret among multiple parties", next: "sharing" },
      { label: "Compute on encrypted data", next: "he" },
      { label: "Prove something without revealing it", next: "zkp" },
      { label: "Jointly compute without revealing inputs", next: "mpc" },
      { label: "Fetch data without revealing which item", next: "ot_pir" },
      { label: "Encrypt for a recipient without a shared secret", next: "asymmetric" },
      { label: "Hide that communication is happening at all", next: "steganography" },
      { label: "Require multiple parties to cooperate to sign", next: "threshold_sig" },
      { label: "Generate cryptographic key material or nonces", next: "csprng" },
    ],
  },
  symmetric: {
    question: "What is the deployment context?",
    options: [
      { label: "A FIPS/NIST-approved implementation is required", next: "symmetric_fips" },
      { label: "General application, record, or file encryption", next: "symmetric_nonce" },
      {
        label: "I need full-disk encryption or am designing a new protocol",
        answer: {
          kind: "review",
          algo: "Security review required",
          id: null,
          reason: "A general-purpose AEAD recommendation is not sufficient for sector encryption or a new protocol. The construction, state model, and failure behavior must be reviewed together.",
          category: "symmetric",
          nextSteps: [
            "Choose a storage- or protocol-specific construction instead of dropping in a standalone AEAD primitive.",
            "Document the record or sector format, integrity and replay requirements, nonce or state model, key hierarchy, and recovery behavior.",
            "Obtain cryptographic design review before implementation or deployment.",
          ],
        },
      },
    ],
  },
  symmetric_fips: {
    question: "Can the system guarantee a unique 96-bit nonce for every message under a key?",
    options: [
      { label: "Yes — uniqueness is enforced and monitored", answer: { algo: "AES-256-GCM", id: "aes256gcm", reason: "GCM is a NIST-approved authenticated-encryption mode with broad validated implementation support. This recommendation depends on enforcing nonce uniqueness and the applicable per-invocation and per-key limits.", category: "symmetric" } },
      {
        label: "No — nonce reuse cannot be ruled out",
        answer: {
          kind: "review",
          algo: "Security review required",
          id: null,
          reason: "AES-GCM can fail catastrophically when a nonce repeats under the same key, while the catalog's misuse-resistant alternatives may not satisfy the required validation profile.",
          category: "symmetric",
          nextSteps: [
            "Fix the nonce allocation and persistence design before choosing GCM.",
            "Confirm the exact FIPS module, approved mode, and protocol profile required by the deployment.",
            "Have the resulting key and nonce lifecycle reviewed before release.",
          ],
        },
      },
    ],
  },
  symmetric_nonce: {
    question: "Can the system guarantee a unique nonce for every message under a key?",
    options: [
      { label: "Yes — uniqueness is enforced by the protocol or state", next: "symmetric_hardware" },
      { label: "No — use random nonces or tolerate accidental repeats", next: "symmetric_misuse" },
    ],
  },
  symmetric_hardware: {
    question: "Does the target have well-supported hardware AES acceleration?",
    options: [
      { label: "Yes — hardware AES is available", answer: { algo: "AES-256-GCM", id: "aes256gcm", reason: "With enforced nonce uniqueness, AES-GCM offers mature interoperability and strong performance on platforms with hardware AES support. Use a vetted implementation and enforce usage limits.", category: "symmetric" } },
      { label: "No — prefer a software-oriented construction", answer: { algo: "ChaCha20-Poly1305", id: "chacha20poly", reason: "RFC 8439 specifies this AEAD and it is widely deployed in modern protocols. Its ARX design supports efficient constant-time implementations, but nonce uniqueness and implementation quality still matter.", category: "symmetric" } },
    ],
  },
  symmetric_misuse: {
    question: "Which nonce constraint best matches the system?",
    options: [
      { label: "A large random nonce can be generated and stored", answer: { algo: "XChaCha20-Poly1305", id: "xchacha20poly", reason: "Its 192-bit nonce makes collision-resistant random nonce generation practical at high volume. Use a vetted implementation such as libsodium and still treat nonce generation as part of the security design.", category: "symmetric" } },
      { label: "Application-supplied nonces might accidentally repeat", answer: { algo: "AES-256-GCM-SIV", id: "aes256gcmsiv", reason: "RFC 8452 provides nonce-misuse resistance that limits the damage of accidental nonce repetition. Repetition still leaks information, and this is not a substitute for a sound nonce design or a required FIPS profile.", category: "symmetric" } },
    ],
  },
  kem: {
    question: "What confidentiality horizon and compatibility constraint applies?",
    options: [
      { label: "Classical-only compatibility with existing peers", answer: { algo: "Curve25519 / X25519", id: "curve25519", reason: "RFC 7748 X25519 is a mature classical key-agreement choice with compact keys and broad deployment. It is not post-quantum secure and should not be used alone for long-lived confidentiality at quantum risk.", category: "curve" } },
      { label: "Protect long-lived data against future quantum attacks", next: "kem_pq" },
      {
        label: "The horizon is uncertain or I am designing a new handshake",
        answer: {
          kind: "review",
          algo: "Security review required",
          id: null,
          reason: "A KEM cannot be selected safely without a protocol profile, peer capabilities, downgrade behavior, authentication design, and a defined confidentiality horizon.",
          category: "kem",
          nextSteps: [
            "Define the data lifetime, peer compatibility, and compliance requirements.",
            "Use a published protocol-specific hybrid profile when both classical and post-quantum protection are required.",
            "Review the combiner, transcript binding, downgrade resistance, and key schedule before deployment.",
          ],
        },
      },
    ],
  },
  kem_pq: {
    question: "What matters most?",
    options: [
      { label: "Standardized general-purpose profile", answer: { algo: "ML-KEM-768 (Kyber)", id: "mlkem768", reason: "FIPS 203 standardizes ML-KEM-768 at NIST security category 3. Deploy it only through a reviewed protocol profile; transition deployments may require a specified classical/PQ hybrid.", category: "kem" } },
      { label: "NIST security category 5 is required", answer: { algo: "ML-KEM-1024 (Kyber)", id: "mlkem1024", reason: "FIPS 203 standardizes ML-KEM-1024 at NIST security category 5. Its larger keys and ciphertexts are justified only when the higher category is an explicit requirement.", category: "kem" } },
      { label: "Diversify away from module-lattice assumptions", answer: { algo: "HQC", id: "hqc", reason: "NIST selected the code-based HQC for standardization as a backup to ML-KEM, but the final standard is not yet published. Treat current deployments as experimental and track the final specification.", category: "kem" } },
    ],
  },
  sig: {
    question: "What verification horizon and compatibility constraint applies?",
    options: [
      { label: "Classical-only compatibility with broad library support", answer: { algo: "Ed25519", id: "ed25519", reason: "RFC 8032 Ed25519 is a mature classical signature scheme with compact keys and signatures. It is not post-quantum secure, so do not use it alone when signatures must remain trustworthy after a quantum transition.", category: "curve" } },
      { label: "Post-quantum verification is required", next: "sig_pq" },
      { label: "Prefer hash-based assumptions despite larger signatures", answer: { algo: "SLH-DSA (SPHINCS+)", id: "slh_dsa", reason: "FIPS 205 standardizes stateless hash-based signatures. The conservative assumption comes with much larger signatures and slower operations, so select a parameter set and implementation for the actual system constraints.", category: "signature" } },
      {
        label: "The horizon is uncertain or I need a hybrid signature format",
        answer: {
          kind: "review",
          algo: "Security review required",
          id: null,
          reason: "Hybrid signatures need an explicit format, verification policy, downgrade behavior, and lifecycle plan; concatenating signatures without a profile can create interoperability and policy failures.",
          category: "signature",
          nextSteps: [
            "Define how long signatures must remain verifiable and which verifiers must interoperate.",
            "Select a published application or protocol profile for composite or dual signatures.",
            "Review algorithm identifiers, verification policy, key rotation, and downgrade handling.",
          ],
        },
      },
    ],
  },
  sig_pq: {
    question: "What matters most?",
    options: [
      { label: "Standardized general-purpose profile", answer: { algo: "ML-DSA-65 (Dilithium)", id: "mldsa65", reason: "FIPS 204 standardizes ML-DSA-65 at NIST security category 3. It is a balanced default only when its key and signature sizes fit the protocol and a vetted implementation is available.", category: "signature" } },
      { label: "Compact signatures justify a not-yet-final standard", answer: { algo: "FALCON-512", id: "falcon512", reason: "FN-DSA/FALCON was selected by NIST for standardization and offers compact signatures, but the final NIST standard is not yet published and signing is difficult to implement safely. Treat it as an expert-reviewed, transition-sensitive choice.", category: "signature" } },
      { label: "Stateful (firmware/code signing)", answer: { algo: "XMSS", id: "xmss", reason: "IETF RFC 8391 / NIST SP 800-208. Hash-only assumptions. Stateful — reusing an index breaks security.", category: "signature" } },
    ],
  },
  hash: {
    question: "What's the primary use case?",
    options: [
      { label: "General purpose / interoperability", answer: { algo: "SHA-256", id: "sha256", reason: "NIST FIPS 180-4. Ubiquitous hardware acceleration. The universal default.", category: "hash" } },
      { label: "Diversity from SHA-2 (different design family)", answer: { algo: "SHA-3-256 (Keccak)", id: "sha3_256", reason: "NIST FIPS 202. Sponge construction. If SHA-2 breaks, SHA-3 is unaffected. Same team as AES.", category: "hash" } },
      { label: "Maximum software speed", answer: { algo: "BLAKE3", id: "blake3", reason: "Massively parallel SIMD. ~0.3 cycles/byte. Built-in KDF and MAC. Not NIST standardized.", category: "hash" } },
      { label: "High-speed + built into Argon2/libsodium", answer: { algo: "BLAKE2b", id: "blake2b", reason: "IETF RFC 7693. Faster than SHA-256 in software. Foundation of Argon2.", category: "hash" } },
    ],
  },
  kdf: {
    question: "What's the input quality?",
    options: [
      { label: "High-entropy (from a key exchange / random key)", answer: { algo: "HKDF", id: "hkdf", reason: "IETF RFC 5869. Extract-then-expand. Used in TLS 1.3, Signal, Noise Protocol. NOT for passwords.", category: "kdf" } },
      { label: "Low-entropy (human password → encryption key)", answer: { algo: "Argon2 (KDF mode)", id: "argon2_kdf", reason: "RFC 9106. Memory-hard. Tunable time/memory/parallelism. Use Argon2id variant.", category: "kdf" } },
    ],
  },
  mac: {
    question: "What crypto primitives are already available?",
    options: [
      { label: "A hash function (SHA-256, etc.)", answer: { algo: "HMAC-SHA-256", id: "hmac_sha256", reason: "NIST FIPS 198-1 / RFC 2104. Universal workhorse. PQ-safe. Works with any hash.", category: "mac" } },
      { label: "AES (block cipher) but no hash", answer: { algo: "CMAC-AES-256", id: "cmac_aes", reason: "NIST SP 800-38B. Deterministic — no nonce needed. Useful in embedded systems with only AES.", category: "mac" } },
      { label: "SHA-3 / Keccak ecosystem", answer: { algo: "KMAC256", id: "kmac256", reason: "NIST SP 800-185. Native Keccak MAC. Built-in domain separation. No HMAC wrapper needed.", category: "mac" } },
    ],
  },
  password: {
    question: "Can you use a modern library (not legacy constraints)?",
    options: [
      { label: "Yes (recommended)", answer: { algo: "Argon2id", id: "argon2id", reason: "RFC 9106. OWASP #1 recommendation. Memory-hard + GPU-resistant + side-channel resistant. Gold standard.", category: "password" } },
      { label: "Limited to older algorithms only", answer: { algo: "bcrypt", id: "bcrypt", reason: "OpenBSD. OWASP acceptable. 72-byte password limit. Not memory-hard but decent GPU resistance.", category: "password" } },
    ],
  },
  sharing: {
    question: "Do you need threshold recovery (t-of-n)?",
    options: [
      { label: "Yes — any t shares out of n reconstruct", answer: { algo: "Shamir's Secret Sharing", id: "shamir", reason: "Information-theoretically secure. t-1 shares reveal zero info. Used in Quantum Vault KPQC, crypto wallets, ICANN ceremonies.", category: "sharing" } },
      { label: "Yes + I need to verify shares are valid", answer: { algo: "Feldman VSS", id: "feldman_vss", reason: "Adds verifiability to Shamir. Each holder can verify their share. Note: verification is NOT PQ-safe (DL-based).", category: "sharing" } },
      { label: "Simple — all parties must be present", answer: { algo: "Additive Sharing", id: "additive_sharing", reason: "n-of-n only. secret = sum of shares. Trivial computation. Foundation of additive MPC.", category: "sharing" } },
    ],
  },
  he: {
    question: "What type of computation on encrypted data?",
    options: [
      { label: "Boolean/integer operations (fast bootstrapping)", answer: { algo: "TFHE", id: "tfhe", reason: "Fastest bootstrapping (~10ms/gate). Programmable. Zama builds production libraries. PQ-safe (LWE).", category: "he" } },
      { label: "Machine learning / floating-point on encrypted data", answer: { algo: "CKKS", id: "ckks", reason: "Only FHE scheme with native floating-point. Essential for ML on encrypted data. Korean origin.", category: "he" } },
      { label: "Exact integer arithmetic / batched operations", answer: { algo: "BGV", id: "bgv", reason: "SIMD-style batch integer operations. HElib (IBM). Good for statistics and aggregation.", category: "he" } },
    ],
  },
  zkp: {
    question: "What matters most?",
    options: [
      { label: "Smallest proofs + fastest verification", answer: { algo: "Groth16 (zk-SNARK)", id: "groth16", reason: "~200 bytes proofs. ~3ms verify. Per-circuit trusted setup. NOT PQ-safe.", category: "zkp" } },
      { label: "No trusted setup + PQ-safe", answer: { algo: "zk-STARK", id: "zk_stark", reason: "Transparent (no trusted setup). PQ-safe. Larger proofs (~50-200 KB). Only needs hash security.", category: "zkp" } },
      { label: "Universal setup (reusable across circuits)", answer: { algo: "PLONK (zk-SNARK)", id: "plonk", reason: "Universal and updatable trusted setup. Foundation for many L2 rollups. NOT PQ-safe.", category: "zkp" } },
    ],
  },
  mpc: {
    question: "What's the threat model?",
    options: [
      { label: "Malicious adversaries (strongest security)", answer: { algo: "SPDZ", id: "spdz", reason: "Active security against dishonest majority. Preprocessing-based. Used in production privacy-preserving analytics.", category: "mpc" } },
      { label: "Semi-honest (honest-but-curious parties)", next: "mpc_semi" },
    ],
  },
  mpc_semi: {
    question: "How many parties?",
    options: [
      { label: "Two parties", answer: { algo: "ABY", id: "aby", reason: "Two-party framework mixing Arithmetic, Boolean, and Yao sharing. TU Darmstadt. Efficient for ML inference.", category: "mpc" } },
      { label: "Three or more parties", answer: { algo: "Sharemind", id: "sharemind", reason: "Three-party additive sharing. Proven in production (Cybernetica). Good for statistics and aggregation.", category: "mpc" } },
      { label: "General-purpose / any number", answer: { algo: "Garbled Circuits", id: "garbled_circuits", reason: "Yao's protocol (1986). Foundation of two-party computation. Widely implemented. Constant-round.", category: "mpc" } },
    ],
  },
  ot_pir: {
    question: "What's the interaction model?",
    options: [
      { label: "Sender has items, receiver picks one secretly (OT)", next: "ot" },
      { label: "Server has a database, client queries privately (PIR)", next: "pir" },
    ],
  },
  ot: {
    question: "How many transfers?",
    options: [
      { label: "A few (base protocol)", answer: { algo: "Base OT", id: "ot_base", reason: "Foundation of all OT. Public-key based. ~1ms per transfer. Use when transfer count is small.", category: "ot_pir" } },
      { label: "Millions (bulk transfer)", answer: { algo: "OT Extension (IKNP)", id: "ot_extension", reason: "Extends a few base OTs into millions using only symmetric crypto. IKNP 2003. Essential for garbled circuits.", category: "ot_pir" } },
    ],
  },
  pir: {
    question: "What's the server trust model?",
    options: [
      { label: "Single server (computational PIR)", answer: { algo: "Computational PIR", id: "cpir", reason: "One server. Privacy based on computational hardness (lattice/LWE). Higher server cost but simpler deployment.", category: "ot_pir" } },
      { label: "Multiple non-colluding servers", answer: { algo: "Information-Theoretic PIR", id: "it_pir", reason: "Perfect privacy if servers don't collude. Lower per-query cost but requires trust in server separation.", category: "ot_pir" } },
    ],
  },
  asymmetric: {
    question: "Do you need legacy RSA compatibility, or can you use modern EC?",
    options: [
      { label: "Need RSA for legacy system compatibility", next: "asymmetric_rsa" },
      { label: "Modern elliptic curve (smaller keys, same security)", next: "asymmetric_ec" },
    ],
  },
  asymmetric_rsa: {
    question: "What's your minimum key size?",
    options: [
      { label: "2048-bit (legacy compat, acceptable until 2030)", answer: { algo: "RSA-OAEP-2048", id: "rsa_oaep_2048", reason: "NIST SP 800-56B / RFC 8017. 112-bit classical security. Acceptable until 2030 NIST deprecation. OAEP padding mandatory.", category: "asymmetric" } },
      { label: "4096-bit (higher classical security margin)", answer: { algo: "RSA-OAEP-4096", id: "rsa_oaep_4096", reason: "~140-bit classical security. Still 0 PQ security — Shor's algorithm breaks any RSA key size. Use ML-KEM for new designs.", category: "asymmetric" } },
    ],
  },
  asymmetric_ec: {
    question: "Which regional standard applies?",
    options: [
      { label: "International / NIST (P-256)", answer: { algo: "ECIES (P-256)", id: "ecies_p256", reason: "ANSI X9.63 / ISO 18033-2. 128-bit classical security. Smaller keys than RSA. Not PQ-safe.", category: "asymmetric" } },
      { label: "Chinese government compliance (SM2)", answer: { algo: "SM2 Encryption", id: "sm2_enc", reason: "GB/T 32918 / ISO 14888-3. Required for Chinese PKI. Equivalent security to P-256. Not PQ-safe.", category: "asymmetric" } },
    ],
  },
  steganography: {
    question: "What is the goal — covert communication or watermarking/ownership proof?",
    options: [
      { label: "Covert communication (hide the message)", next: "stego_covert" },
      { label: "Watermarking (prove ownership, survive modifications)", answer: { algo: "Spread Spectrum Watermarking", id: "spread_spectrum_stego", reason: "Cox et al. 1997. Robust to JPEG, cropping, filtering. Low capacity. Foundation of Adobe Content Credentials and commercial watermarking.", category: "steganography" } },
    ],
  },
  stego_covert: {
    question: "What's the carrier medium?",
    options: [
      { label: "Raw/PNG image (state-of-the-art steganalysis resistance)", answer: { algo: "Adaptive Steganography (WOW)", id: "wow_stego", reason: "Holub & Fridrich 2012. State of practice. Adaptive cost function concentrates bits in textured regions. Best steganalysis resistance for spatial-domain image steganography.", category: "steganography" } },
      { label: "JPEG image", answer: { algo: "DCT-Domain (JPEG F5)", id: "dct_f5", reason: "Westfeld 2001. Embeds in DCT coefficients with matrix encoding. Steganalysis-resistant for low payloads in JPEG.", category: "steganography" } },
    ],
  },
  threshold_sig: {
    question: "Which signature type do you need?",
    options: [
      { label: "Schnorr / EdDSA (IETF standard, most flexible)", answer: { algo: "FROST", id: "frost", reason: "RFC 9591. IETF standard. 2-round threshold Schnorr. Identifiable abort. First threshold sig scheme with an IETF RFC.", category: "threshold_sig" } },
      { label: "ECDSA (compatible with Ethereum / Bitcoin chains)", next: "threshold_ecdsa" },
      { label: "BLS (needs non-interactive aggregation for large sets)", answer: { algo: "BLS Threshold", id: "bls_threshold", reason: "Boneh et al. 2004. Non-interactive aggregation. O(1) verification for large validator sets. Ethereum 2.0 PoS uses this.", category: "threshold_sig" } },
    ],
  },
  threshold_ecdsa: {
    question: "Is this a new deployment or is cutting-edge round efficiency worth the research risk?",
    options: [
      { label: "Production deployment (use established scheme)", answer: { algo: "GG20", id: "gg20", reason: "Gennaro & Goldfeder 2020. Most widely deployed threshold ECDSA. Compatible with Ethereum/Bitcoin. Fireblocks, Coinbase, and major custody solutions use GG20 variants.", category: "threshold_sig" } },
      { label: "Research / next-generation (3 rounds, very recent)", answer: { algo: "DKLS23", id: "dkls23", reason: "Doerner et al. 2023. Three-round threshold ECDSA. Improves GG20 round complexity. IEEE S&P 2024. Too new for production.", category: "threshold_sig" } },
    ],
  },
  csprng: {
    question: "Do you need NIST FIPS 140-2/3 compliance?",
    options: [
      { label: "Yes — FIPS compliance required", next: "csprng_fips" },
      { label: "No — best software performance / Linux/BSD environments", next: "csprng_nonfips" },
    ],
  },
  csprng_fips: {
    question: "Is AES-NI hardware available?",
    options: [
      { label: "Yes — hardware AES available (fast throughput)", answer: { algo: "CTR-DRBG (AES-256)", id: "ctr_drbg", reason: "NIST SP 800-90A Rev 1. AES-NI accelerated. ~1-2 GB/s. Fastest NIST-approved DRBG. Used in Windows CNG and hardware HSMs.", category: "csprng" } },
      { label: "No — or prefer hash-based construction", answer: { algo: "HMAC-DRBG", id: "hmac_drbg", reason: "NIST SP 800-90A Rev 1. HMAC-SHA-256 backed. Proven under PRF assumption. No known weaknesses. The unbackdoored alternative to Dual_EC_DRBG in the same spec.", category: "csprng" } },
    ],
  },
  csprng_nonfips: {
    question: "OS-level CSPRNG design or general software randomness?",
    options: [
      { label: "OS entropy pool with catastrophic reseed recovery (macOS/BSD pattern)", answer: { algo: "Fortuna", id: "fortuna", reason: "Ferguson & Schneier 2003. 32 entropy pools guarantee recovery from full state compromise. FreeBSD and macOS use this design.", category: "csprng" } },
      { label: "Application-level or Linux kernel (constant-time, no AES-NI)", answer: { algo: "ChaCha20-DRBG", id: "chacha20_drbg", reason: "Linux ≥ 5.17 primary DRBG. Constant-time — no lookup tables, immune to timing attacks. Not FIPS-approved.", category: "csprng" } },
    ],
  },
};

type DecisionFlowchartProps = {
  onNavigate: (category: AlgorithmCategory, algoId: string) => void;
  algorithms?: Algorithm[];
  provenance?: Record<string, { sources: AlgorithmSource[]; lastReviewed: string }>;
};

const ADVISOR_BASE_URL = "https://crypto-compare.systemslibrarian.dev/";

export function buildAdvisorPermalink(choiceIds: string[]): string {
  const url = new URL(ADVISOR_BASE_URL);
  url.searchParams.set("advisor", choiceIds.join(","));
  return url.toString();
}

export function buildJustificationReport(
  result: AdvisorOutcome,
  history: AdvisorDecisionStep[],
  algorithms: Algorithm[],
  provenance: Record<string, { sources: AlgorithmSource[]; lastReviewed: string }>,
  tree: AdvisorRuleTree,
  choiceIds: string[] = [],
  generatedAt = new Date(),
): string {
  const algo = result.id ? algorithms.find((a) => a.id === result.id) : undefined;
  const prov = result.id ? provenance[result.id] : undefined;
  const lines: string[] = [];

  lines.push("# Cryptographic Algorithm Justification Report");
  lines.push("");
  lines.push(`**Generated (UTC)**: ${generatedAt.toISOString()}`);
  lines.push(`**Tool**: crypto::compare (${ADVISOR_BASE_URL})`);
  lines.push(`**Dataset**: ${DATASET_VERSION}`);
  lines.push(`**Ruleset**: ${ADVISOR_RULESET_VERSION}`);
  if (choiceIds.length > 0) {
    lines.push(`**Decision ID**: ${choiceIds.join("/")}`);
    lines.push(`**Permalink**: ${buildAdvisorPermalink(choiceIds)}`);
  }
  lines.push("");

  // Decision path
  lines.push("## Decision Path");
  lines.push("");
  for (const step of history) {
    const node = tree[step.nodeId];
    if (node) {
      lines.push(`- **Q**: ${node.question}`);
      lines.push(`  - **A** [${step.optionId}]: ${step.optionLabel}`);
    }
  }
  // Final node → answer
  const nodeId = history.at(-1)?.nextNodeId ?? "start";
  const finalNode = tree[nodeId];
  if (finalNode) {
    const finalChoiceId = choiceIds.at(-1);
    const finalChoiceIndex = finalChoiceId?.startsWith(`${nodeId}.`)
      ? Number.parseInt(finalChoiceId.slice(nodeId.length + 1), 10) - 1
      : -1;
    const chosen = finalChoiceIndex >= 0
      ? finalNode.options[finalChoiceIndex]
      : finalNode.options.find((o) => o.answer?.id === result.id);
    lines.push(`- **Q**: ${finalNode.question}`);
    lines.push(`  - **A**${finalChoiceId ? ` [${finalChoiceId}]` : ""}: ${chosen?.label ?? "—"}`);
  }
  lines.push("");

  lines.push(result.kind === "review" ? "## Review Required" : "## Recommendation");
  lines.push("");
  lines.push(`**${result.kind === "review" ? "Outcome" : "Algorithm"}**: ${result.algo}`);
  lines.push(`**Category**: ${result.category}`);
  lines.push(`**Wizard Reasoning**: ${result.reason}`);
  lines.push("");

  if (result.kind === "review") {
    lines.push("## Required Next Steps");
    lines.push("");
    for (const step of result.nextSteps) lines.push(`- ${step}`);
    lines.push("");
  }

  if (algo) {
    const assurance = getAssuranceProfile(algo);
    lines.push("## Algorithm Details");
    lines.push("");
    lines.push(`| Field | Value |`);
    lines.push(`| --- | --- |`);
    lines.push(`| Recommendation Level | ${algo.recommendation} |`);
    lines.push(`| Rationale | ${algo.recommendationRationale} |`);
    lines.push(`| Changes When | ${algo.recommendationChangesWhen} |`);
    lines.push(`| Why Not This? | ${algo.whyNotThis} |`);
    lines.push(`| Assurance Model | ${assurance.headline} |`);
    lines.push(`| Assurance Dimensions | ${assurance.metrics.map((metric) => `${metric.label}: ${metric.value}`).join("; ")} |`);
    lines.push(`| Assurance Caveat | ${assurance.caveat} |`);
    lines.push(`| Best Known Attack | ${algo.bestAttack} |`);
    lines.push(`| Performance | ${algo.performance} |`);
    lines.push(`| Status | ${algo.statusLabel} |`);
    lines.push("");

    lines.push("## Security Assumptions");
    lines.push("");
    lines.push(algo.assumptions);
    lines.push("");

    lines.push("## Estimation Methodology");
    lines.push("");
    lines.push(`- **Classical**: ${algo.estimationMethodology.classicalBasis} — ${algo.estimationMethodology.classicalNote}`);
    lines.push(`- **Quantum**: ${algo.estimationMethodology.quantumBasis} — ${algo.estimationMethodology.quantumNote}`);
    lines.push("");
  }

  if (prov) {
    lines.push("## Sources");
    lines.push("");
    for (const s of prov.sources) {
      lines.push(`- **${s.label}** (${s.kind}): ${s.note}`);
      lines.push(`  ${s.url}`);
    }
    lines.push("");
    lines.push(`**Last Reviewed**: ${formatReviewDate(prov.lastReviewed)}`);
    lines.push("");
  }

  lines.push("## Disclaimer");
  lines.push("");
  lines.push("This report is generated from static data and reflects published cryptanalysis as of the review date above. It is not a substitute for professional cryptographic engineering review. Security estimates are time-bound and may change with new research.");
  lines.push("");

  return lines.join("\n");
}

export default function DecisionFlowchart({ onNavigate, algorithms = [], provenance = {} }: DecisionFlowchartProps) {
  const [initialState] = useState(() => {
    if (typeof window === "undefined") return resolveAdvisorChoicePath(DECISION_TREE, []);
    const encodedPath = new URLSearchParams(window.location.search).get("advisor");
    if (!encodedPath) return resolveAdvisorChoicePath(DECISION_TREE, []);
    try {
      return resolveAdvisorChoicePath(DECISION_TREE, encodedPath.split(",").filter(Boolean));
    } catch {
      return resolveAdvisorChoicePath(DECISION_TREE, []);
    }
  });
  const [currentNode, setCurrentNode] = useState(initialState.currentNode);
  const [history, setHistory] = useState<AdvisorDecisionStep[]>(initialState.history);
  const [choiceIds, setChoiceIds] = useState<string[]>(initialState.choiceIds);
  const [result, setResult] = useState<AdvisorOutcome | null>(initialState.result);

  const node = DECISION_TREE[currentNode];
  const resultAlgo = result?.id ? algorithms.find((algo) => algo.id === result.id) : undefined;
  const resultProvenance = result?.id ? provenance[result.id] : undefined;

  const goBack = () => {
    if (result) {
      setResult(null);
      setChoiceIds((ids) => ids.slice(0, -1));
      return;
    }
    if (history.length > 0) {
      const prev = history[history.length - 1].nodeId;
      setHistory((h) => h.slice(0, -1));
      setChoiceIds((ids) => ids.slice(0, -1));
      setCurrentNode(prev);
    }
  };

  const reset = () => {
    setCurrentNode("start");
    setHistory([]);
    setChoiceIds([]);
    setResult(null);
  };

  const choose = (option: (typeof node)["options"][number]) => {
    const optionIndex = node.options.indexOf(option);
    const optionId = advisorOptionId(currentNode, optionIndex);
    if (option.answer) {
      setChoiceIds((ids) => [...ids, optionId]);
      setResult(option.answer);
    } else if (option.next) {
      setHistory((h) => [...h, {
        nodeId: currentNode,
        optionId,
        optionLabel: option.label,
        nextNodeId: option.next!,
      }]);
      setChoiceIds((ids) => [...ids, optionId]);
      setCurrentNode(option.next);
    }
  };

  const step = history.length + 1;

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "10px",
        padding: "20px 24px",
        background: "linear-gradient(135deg, var(--color-bg-panel-gradient-from) 0%, var(--color-bg-panel-gradient-to) 100%)",
        marginBottom: "18px",
      }}
      role="region"
      aria-label="Algorithm decision flowchart"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", gap: "10px", flexWrap: "wrap" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 700,
            fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
            color: "var(--color-text-heading)",
          }}
        >
          What should I use?
        </h2>
        <div style={{ display: "flex", gap: "8px" }}>
          {(history.length > 0 || result) && (
            <button
              onClick={goBack}
              aria-label={result ? "Back to previous question" : "Back to previous step"}
              style={{
                background: "var(--color-bg-control)",
                color: "var(--color-text-body)",
                border: "1px solid var(--color-border-muted)",
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              ← Back
            </button>
          )}
          {(history.length > 0 || result) && (
            <button
              onClick={reset}
              aria-label="Start the decision flowchart over from the beginning"
              style={{
                background: "var(--color-bg-control)",
                color: "var(--color-text-body)",
                border: "1px solid var(--color-border-muted)",
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              Start over
            </button>
          )}
        </div>
      </div>

      {!result && node && (
        <div role="group" aria-label={`Step ${step}: ${node.question}`}>
          <div style={{ fontSize: "13px", color: "var(--color-accent-blue-label)", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Step {step}
          </div>
          <div id="flowchart-question" style={{ fontSize: "17px", color: "var(--color-text)", fontWeight: 600, marginBottom: "14px", lineHeight: 1.6 }}>
            {node.question}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} role="list" aria-labelledby="flowchart-question">
            {node.options.map((option, optionIndex) => (
              <button
                key={advisorOptionId(currentNode, optionIndex)}
                onClick={() => choose(option)}
                style={{
                  background: "var(--color-bg-card)",
                  color: "var(--color-text-body)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "15px",
                  textAlign: "left",
                  cursor: "pointer",
                  lineHeight: 1.5,
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent-blue)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <ResultBlock
          result={result}
          resultAlgo={resultAlgo}
          resultProvenance={resultProvenance}
          history={history}
          choiceIds={choiceIds}
          algorithms={algorithms}
          provenance={provenance}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

function ResultBlock({
  result,
  resultAlgo,
  resultProvenance,
  history,
  choiceIds,
  algorithms,
  provenance,
  onNavigate,
}: {
  result: AdvisorOutcome;
  resultAlgo?: Algorithm;
  resultProvenance?: { sources: AlgorithmSource[]; lastReviewed: string };
  history: AdvisorDecisionStep[];
  choiceIds: string[];
  algorithms: Algorithm[];
  provenance: Record<string, { sources: AlgorithmSource[]; lastReviewed: string }>;
  onNavigate: (category: AlgorithmCategory, algoId: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const impls = result.id ? IMPLEMENTATIONS.filter((i) => i.algorithmId === result.id) : [];
  const ecosystems = Array.from(new Set(impls.map((i) => i.ecosystem)));

  const trustBadges: { label: string; color: string }[] = [];
  if (resultAlgo?.maturity) trustBadges.push({ label: resultAlgo.maturity, color: resultAlgo.maturity === "mature" ? "var(--color-badge-green-text, #5ce65c)" : resultAlgo.maturity === "established" ? "var(--color-badge-blue-text, #6cb6ff)" : "var(--color-badge-yellow-text, #e6c85c)" });
  if (resultAlgo?.catalogEvidence?.standardization.bodies.length) {
    trustBadges.push({
      label: `${resultAlgo.catalogEvidence.standardization.bodies.join("/")} · ${resultAlgo.catalogEvidence.standardization.stage}`,
      color: "var(--color-text-accent-bright, #a0d0ff)",
    });
  }
  if (resultAlgo?.pqRelevance) {
    const pqColors: Record<string, string> = { "pq-safe": "var(--color-badge-green-text, #5ce65c)", "pq-ready": "var(--color-badge-blue-text, #6cb6ff)", "pq-vulnerable": "var(--color-badge-red-text, #ff6b6b)", "pq-neutral": "var(--color-text-secondary, #aaa)" };
    trustBadges.push({ label: resultAlgo.pqRelevance, color: pqColors[resultAlgo.pqRelevance] ?? "var(--color-text-secondary)" });
  }

  function copyAsMarkdown() {
    const report = buildJustificationReport(result, history, algorithms, provenance, DECISION_TREE, choiceIds);
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }, () => {});
  }

  return (
    <div role="alert" aria-live="assertive">
      <div style={{ fontSize: "13px", color: "var(--color-badge-green-text)", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {result.kind === "review" ? "Security review required" : "Recommended profile"}
      </div>
      <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-badge-green-border)", borderRadius: "10px", padding: "18px 20px" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-badge-green-text)", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", marginBottom: "4px" }}>
          → {result.algo}
        </div>
        {trustBadges.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
            {trustBadges.map((b, i) => (
              <span key={i} style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", padding: "2px 8px", borderRadius: "4px", color: b.color, background: "var(--color-bg-control, #1a1a2e)", border: "1px solid var(--color-border-muted, #333)" }}>{b.label}</span>
            ))}
          </div>
        )}

        {/* JUSTIFICATION */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-accent-bright)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>Justification</div>
          <div style={{ fontSize: "15px", color: "var(--color-text-body)", lineHeight: 1.75 }}>{result.reason}</div>
        </div>

        {result.kind === "review" && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-badge-yellow-text)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>Required next steps</div>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--color-text-body)", lineHeight: 1.7 }}>
              {result.nextSteps.map((step) => <li key={step}>{step}</li>)}
            </ul>
          </div>
        )}

        {/* WHY NOT THIS */}
        {resultAlgo?.whyNotThis && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-badge-yellow-text)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>Why Not This?</div>
            <div style={{ fontSize: "13px", color: "var(--color-text-warning, var(--color-text-body))", lineHeight: 1.6 }}>{resultAlgo.whyNotThis}</div>
          </div>
        )}

        {/* RISK */}
        {resultAlgo?.recommendationChangesWhen && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-badge-orange-text, var(--color-text-accent-bright))", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>Risk / Changes When</div>
            <div style={{ fontSize: "13px", color: "var(--color-text-body)", lineHeight: 1.6 }}>{resultAlgo.recommendationChangesWhen}</div>
          </div>
        )}

        {/* Info grid */}
        {(resultAlgo || resultProvenance) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px", marginBottom: "14px" }}>
            {resultAlgo && (
              <div style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "10px 12px" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-accent-bright)", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 700, marginBottom: "6px" }}>Recommendation</div>
                <RecommendationBadge level={resultAlgo.recommendation} />
              </div>
            )}
            <div style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "10px 12px" }}>
              <div style={{ fontSize: "11px", color: "var(--color-text-accent-bright)", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 700, marginBottom: "6px" }}>Review freshness</div>
              <ReviewBadge iso={resultProvenance?.lastReviewed} />
            </div>
            <div style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "10px 12px" }}>
              <div style={{ fontSize: "11px", color: "var(--color-text-accent-bright)", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 700, marginBottom: "6px" }}>Source basis</div>
              <div style={{ fontSize: "14px", color: "var(--color-text)", fontWeight: 700 }}>{resultProvenance?.sources.length ?? 0} cited source{(resultProvenance?.sources.length ?? 0) !== 1 ? "s" : ""}</div>
              <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>{resultProvenance?.lastReviewed ? `Reviewed ${formatReviewDate(resultProvenance.lastReviewed)}` : "Review date pending"}</div>
            </div>
          </div>
        )}

        {/* IMPLEMENTATION PATH */}
        {impls.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-accent-bright)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Implementation Path</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {ecosystems.map((eco) => {
                const ecoImpls = impls.filter((i) => i.ecosystem === eco);
                const label = ECOSYSTEM_LABELS[eco];
                return (
                  <span key={eco} style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "6px", background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-body)" }}>
                    {label?.icon} {label?.label}: {ecoImpls.map((i) => i.library).join(", ")}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {result.id && (
            <button onClick={() => onNavigate(result.category, result.id!)} style={{ background: "var(--color-button-primary)", color: "var(--color-button-primary-text)", border: "none", padding: "12px 20px", borderRadius: "6px", fontSize: "14px", fontWeight: 700, cursor: "pointer", minHeight: "44px" }}>
              View {result.algo} details →
            </button>
          )}
          <button
            onClick={copyAsMarkdown}
            style={{ background: "var(--color-bg-control)", color: "var(--color-text-body)", border: "1px solid var(--color-border-muted)", padding: "12px 20px", borderRadius: "6px", fontSize: "14px", fontWeight: 700, cursor: "pointer", minHeight: "44px" }}
          >
            {copied ? "✓ Copied" : "📋 Copy as Markdown"}
          </button>
          <button
            onClick={() => {
              const report = buildJustificationReport(result, history, algorithms, provenance, DECISION_TREE, choiceIds);
              const blob = new Blob([report], { type: "text/markdown" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `justification-${result.id ?? "review-required"}.md`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            style={{ background: "var(--color-bg-control)", color: "var(--color-text-body)", border: "1px solid var(--color-border-muted)", padding: "12px 20px", borderRadius: "6px", fontSize: "14px", fontWeight: 700, cursor: "pointer", minHeight: "44px" }}
          >
            ↓ Download Report
          </button>
        </div>
        {resultAlgo && (
          <p style={{ margin: "14px 0 0", color: "var(--color-text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
            Treat this as a decision aid, not an automatic approval. The recommendation is strongest when the algorithm&apos;s recommendation level, cited sources, and review freshness all align with your operational constraints.
          </p>
        )}
      </div>
    </div>
  );
}
