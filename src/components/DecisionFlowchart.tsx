"use client";

import { useState } from "react";
import { RecommendationBadge, ReviewBadge, formatReviewDate } from "@/components/ui";
import type { Algorithm, AlgorithmCategory, AlgorithmSource } from "@/types/crypto";

type DecisionNode = {
  question: string;
  options: { label: string; next?: string; answer?: { algo: string; id: string; reason: string; category: AlgorithmCategory } }[];
};

const DECISION_TREE: Record<string, DecisionNode> = {
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
    question: "Does your target hardware have AES-NI (most modern x86/ARM)?",
    options: [
      { label: "Yes — hardware AES available", answer: { algo: "AES-256-GCM", id: "aes256gcm", reason: "Hardware-accelerated, NIST standard, ~1 cycle/byte. The universal default when AES-NI is present.", category: "symmetric" } },
      { label: "No — or I want software-only / side-channel safety", next: "symmetric_sw" },
    ],
  },
  symmetric_sw: {
    question: "Do you need random nonces (e.g. at-rest / file encryption)?",
    options: [
      { label: "Yes — I want safe random nonces", answer: { algo: "XChaCha20-Poly1305", id: "xchacha20poly", reason: "192-bit nonce makes random generation safe. libsodium default. Constant-time by construction.", category: "symmetric" } },
      { label: "No — sequential / protocol nonces are fine", answer: { algo: "ChaCha20-Poly1305", id: "chacha20poly", reason: "IETF standard (RFC 8439). Used in TLS 1.3, WireGuard. No lookup tables = immune to cache-timing.", category: "symmetric" } },
    ],
  },
  kem: {
    question: "Do you need post-quantum resistance?",
    options: [
      { label: "Yes — protect against future quantum computers", next: "kem_pq" },
      { label: "I need maximum conservatism (oldest assumptions)", answer: { algo: "Classic McEliece", id: "classic_mceliece", reason: "45+ years of cryptanalysis. Code-based. Enormous keys (~261 KB) but maximum confidence.", category: "kem" } },
    ],
  },
  kem_pq: {
    question: "What matters most?",
    options: [
      { label: "Balance of speed and security (recommended)", answer: { algo: "ML-KEM-768 (Kyber)", id: "mlkem768", reason: "NIST FIPS 203.Primary PQ KEM standard. Already deployed in Chrome/Firefox hybrid TLS. 192-bit PQ security, fast.", category: "kem" } },
      { label: "Maximum security margin", answer: { algo: "ML-KEM-1024 (Kyber)", id: "mlkem1024", reason: "256-bit PQ security. Conservative choice for government / long-term secrets.", category: "kem" } },
      { label: "Diversify away from lattice assumptions", answer: { algo: "HQC", id: "hqc", reason: "Code-based alternative. If lattice problems (ML-KEM) break, HQC is unaffected. NIST selected.", category: "kem" } },
    ],
  },
  sig: {
    question: "Do you need post-quantum resistance?",
    options: [
      { label: "Yes — PQ signatures", next: "sig_pq" },
      { label: "I need ultra-conservative (hash-only assumptions)", answer: { algo: "SLH-DSA (SPHINCS+)", id: "slh_dsa", reason: "Only needs hash security — most conservative PQ assumption possible. NIST FIPS 205. Large sigs, slow signing.", category: "signature" } },
    ],
  },
  sig_pq: {
    question: "What matters most?",
    options: [
      { label: "Balance of size and speed (recommended)", answer: { algo: "ML-DSA-65 (Dilithium)", id: "mldsa65", reason: "NIST FIPS 204. 192-bit PQ security. Good balance of signature size and performance.", category: "signature" } },
      { label: "Smallest possible signatures", answer: { algo: "FALCON-512", id: "falcon512", reason: "Smallest PQ signatures (~666 bytes). But: constant-time signing is very hard to implement safely.", category: "signature" } },
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
  algorithms: Algorithm[];
  provenance: Record<string, { sources: AlgorithmSource[]; lastReviewed: string }>;
};

function buildJustificationReport(
  result: { algo: string; id: string; reason: string; category: AlgorithmCategory },
  history: string[],
  algorithms: Algorithm[],
  provenance: Record<string, { sources: AlgorithmSource[]; lastReviewed: string }>,
  tree: Record<string, DecisionNode>,
): string {
  const algo = algorithms.find((a) => a.id === result.id);
  const prov = provenance[result.id];
  const lines: string[] = [];

  lines.push("# Cryptographic Algorithm Justification Report");
  lines.push("");
  lines.push(`**Generated**: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
  lines.push(`**Tool**: crypto::compare (https://systemslibrarian.github.io/crypto-compare/)`);
  lines.push("");

  // Decision path
  lines.push("## Decision Path");
  lines.push("");
  let nodeId = "start";
  for (const nextId of history) {
    const node = tree[nodeId];
    if (node) {
      const chosen = node.options.find((o) => o.next === nextId);
      lines.push(`- **Q**: ${node.question}`);
      lines.push(`  - **A**: ${chosen?.label ?? "—"}`);
    }
    nodeId = nextId;
  }
  // Final node → answer
  const finalNode = tree[nodeId];
  if (finalNode) {
    const chosen = finalNode.options.find((o) => o.answer?.id === result.id);
    lines.push(`- **Q**: ${finalNode.question}`);
    lines.push(`  - **A**: ${chosen?.label ?? "—"}`);
  }
  lines.push("");

  lines.push("## Recommendation");
  lines.push("");
  lines.push(`**Algorithm**: ${result.algo}`);
  lines.push(`**Category**: ${result.category}`);
  lines.push(`**Wizard Reasoning**: ${result.reason}`);
  lines.push("");

  if (algo) {
    lines.push("## Algorithm Details");
    lines.push("");
    lines.push(`| Field | Value |`);
    lines.push(`| --- | --- |`);
    lines.push(`| Recommendation Level | ${algo.recommendation} |`);
    lines.push(`| Rationale | ${algo.recommendationRationale} |`);
    lines.push(`| Changes When | ${algo.recommendationChangesWhen} |`);
    lines.push(`| Why Not This? | ${algo.whyNotThis} |`);
    lines.push(`| Classical Security | ${algo.securityBits} bits |`);
    lines.push(`| PQ Security | ${algo.pqSecurityBits} bits |`);
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

export default function DecisionFlowchart({ onNavigate, algorithms, provenance }: DecisionFlowchartProps) {
  const [currentNode, setCurrentNode] = useState("start");
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<{
    algo: string;
    id: string;
    reason: string;
    category: AlgorithmCategory;
  } | null>(null);

  const node = DECISION_TREE[currentNode];
  const resultAlgo = result ? algorithms.find((algo) => algo.id === result.id) : undefined;
  const resultProvenance = result ? provenance[result.id] : undefined;

  const goBack = () => {
    if (result) {
      setResult(null);
      return;
    }
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setCurrentNode(prev);
    }
  };

  const reset = () => {
    setCurrentNode("start");
    setHistory([]);
    setResult(null);
  };

  const choose = (option: (typeof node)["options"][number]) => {
    if (option.answer) {
      setResult(option.answer);
    } else if (option.next) {
      setHistory((h) => [...h, currentNode]);
      setCurrentNode(option.next);
    }
  };

  const step = history.length + 1;

  return (
    <div
      style={{
        border: "1px solid #1e293b",
        borderRadius: "10px",
        padding: "20px 24px",
        background: "linear-gradient(135deg, #0c1222 0%, #0e1628 100%)",
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
            color: "#f8fafc",
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
                background: "#0e1420",
                color: "#d4deea",
                border: "1px solid #334155",
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
                background: "#0e1420",
                color: "#d4deea",
                border: "1px solid #334155",
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
          <div style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Step {step}
          </div>
          <div id="flowchart-question" style={{ fontSize: "17px", color: "#e2e8f0", fontWeight: 600, marginBottom: "14px", lineHeight: 1.6 }}>
            {node.question}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} role="list" aria-labelledby="flowchart-question">
            {node.options.map((option) => (
              <button
                key={option.label}
                onClick={() => choose(option)}
                style={{
                  background: "#0a1018",
                  color: "#d4deea",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "15px",
                  textAlign: "left",
                  cursor: "pointer",
                  lineHeight: 1.5,
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1e293b";
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div role="alert" aria-live="assertive">
          <div style={{ fontSize: "13px", color: "#34d399", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Recommendation
          </div>
          <div
            style={{
              background: "#0a1018",
              border: "1px solid #065f46",
              borderRadius: "10px",
              padding: "18px 20px",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#34d399",
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                marginBottom: "8px",
              }}
            >
              → {result.algo}
            </div>
            <div style={{ fontSize: "15px", color: "#d4deea", lineHeight: 1.75, marginBottom: "14px" }}>
              {result.reason}
            </div>
            {(resultAlgo || resultProvenance) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "8px",
                  marginBottom: "14px",
                }}
              >
                {resultAlgo && (
                  <div style={{ background: "#0d1626", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 12px" }}>
                    <div style={{ fontSize: "11px", color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 700, marginBottom: "6px" }}>
                      Recommendation
                    </div>
                    <RecommendationBadge level={resultAlgo.recommendation} />
                  </div>
                )}
                <div style={{ background: "#0d1626", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 12px" }}>
                  <div style={{ fontSize: "11px", color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 700, marginBottom: "6px" }}>
                    Review freshness
                  </div>
                  <ReviewBadge iso={resultProvenance?.lastReviewed} />
                </div>
                <div style={{ background: "#0d1626", border: "1px solid #1e293b", borderRadius: "8px", padding: "10px 12px" }}>
                  <div style={{ fontSize: "11px", color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 700, marginBottom: "6px" }}>
                    Source basis
                  </div>
                  <div style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 700 }}>
                    {resultProvenance?.sources.length ?? 0} cited source{(resultProvenance?.sources.length ?? 0) !== 1 ? "s" : ""}
                  </div>
                  <div style={{ fontSize: "12px", color: "#93a4bb", marginTop: "4px" }}>
                    {resultProvenance?.lastReviewed ? `Reviewed ${formatReviewDate(resultProvenance.lastReviewed)}` : "Review date pending"}
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => onNavigate(result.category, result.id)}
                style={{
                  background: "#1d4ed8",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  minHeight: "44px",
                }}
              >
                View {result.algo} details →
              </button>
              <button
                onClick={() => {
                  const report = buildJustificationReport(result, history, algorithms, provenance, DECISION_TREE);
                  const blob = new Blob([report], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `justification-${result.id}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                  background: "#0e1420",
                  color: "#d4deea",
                  border: "1px solid #334155",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  minHeight: "44px",
                }}
              >
                ↓ Download Justification Report
              </button>
            </div>
            {resultAlgo && (
              <p style={{ margin: "14px 0 0", color: "#93a4bb", fontSize: "13px", lineHeight: 1.7 }}>
                Treat this as a decision aid, not an automatic approval. The recommendation is strongest when the algorithm's recommendation level, cited sources, and review freshness all align with your operational constraints.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
