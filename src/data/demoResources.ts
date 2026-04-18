export type DemoResource = {
  title: string;
  url: string;
  note: string;
};

export const ALGORITHM_DEMOS: Record<string, DemoResource[]> = {
  aes256gcm: [
    {
      title: "AES Modes",
      url: "https://github.com/systemslibrarian/crypto-lab-aes-modes",
      note: "Compares ECB, CBC, CTR, GCM, and CCM with attack demos and mode visualizations.",
    },
  ],
  xchacha20poly: [
    {
      title: "ChaCha20 Stream",
      url: "https://github.com/systemslibrarian/crypto-lab-chacha20-stream",
      note: "Quarter-round stepper, keystream visualizer, nonce-reuse demo, and encrypt/decrypt playground.",
    },
    {
      title: "Shadow Vault",
      url: "https://github.com/systemslibrarian/crypto-lab-shadow-vault",
      note: "Applies XChaCha20-Poly1305 in a deniable-encryption workflow.",
    },
  ],
  curve25519: [
    {
      title: "Curve Lens",
      url: "https://github.com/systemslibrarian/crypto-lab-curve-lens",
      note: "Interactive point addition, scalar multiplication, and ECDH exploration across major curves.",
    },
    {
      title: "X3DH Wire",
      url: "https://github.com/systemslibrarian/crypto-lab-x3dh-wire",
      note: "Signal-style asynchronous key agreement built on Curve25519.",
    },
  ],
  ed25519: [
    {
      title: "Ed25519 Forge",
      url: "https://github.com/systemslibrarian/crypto-lab-ed25519-forge",
      note: "Key generation, signing, verification, and deterministic nonce handling.",
    },
    {
      title: "FROST Threshold",
      url: "https://github.com/systemslibrarian/crypto-lab-frost-threshold",
      note: "Threshold signing workflow built on Ed25519.",
    },
  ],
  mlkem768: [
    {
      title: "Kyber Vault",
      url: "https://github.com/systemslibrarian/crypto-lab-kyber-vault",
      note: "Hands-on ML-KEM / Kyber encapsulation and decapsulation walkthrough.",
    },
    {
      title: "Hybrid Wire",
      url: "https://github.com/systemslibrarian/crypto-lab-hybrid-wire",
      note: "Shows X25519 plus ML-KEM hybrid key exchange as deployed in modern TLS experiments.",
    },
  ],
  mlkem1024: [
    {
      title: "Kyber Vault",
      url: "https://github.com/systemslibrarian/crypto-lab-kyber-vault",
      note: "Interactive ML-KEM demo useful for comparing higher-security parameter sets.",
    },
  ],
  mldsa44: [
    {
      title: "Dilithium Seal",
      url: "https://github.com/systemslibrarian/crypto-lab-dilithium-seal",
      note: "Demonstrates ML-DSA signing and verification flow with lattice-based signatures.",
    },
  ],
  mldsa65: [
    {
      title: "Dilithium Seal",
      url: "https://github.com/systemslibrarian/crypto-lab-dilithium-seal",
      note: "Hands-on ML-DSA demo for signature generation and verification.",
    },
  ],
  slh_dsa: [
    {
      title: "SPHINCS+ Ledger",
      url: "https://github.com/systemslibrarian/crypto-lab-sphincs-ledger",
      note: "Hash-based signature workflow with larger signatures and conservative assumptions.",
    },
  ],
  hmac_sha256: [
    {
      title: "MAC Race",
      url: "https://github.com/systemslibrarian/crypto-lab-mac-race",
      note: "Compares HMAC, CMAC, Poly1305, and GHASH with common failure modes.",
    },
  ],
  shamir: [],
  tfhe: [
    {
      title: "Blind Oracle",
      url: "https://github.com/systemslibrarian/crypto-lab-blind-oracle",
      note: "Browser-to-server demo for encrypted computation with TFHE-style operations.",
    },
  ],
  groth16: [
    {
      title: "SNARK Arena",
      url: "https://github.com/systemslibrarian/crypto-lab-snark-arena",
      note: "Groth16 and PLONK trusted-setup workflow, proof generation, and verification comparison.",
    },
  ],
  plonk: [
    {
      title: "SNARK Arena",
      url: "https://github.com/systemslibrarian/crypto-lab-snark-arena",
      note: "Universal setup and proof system comparison centered on PLONK and Groth16.",
    },
  ],
  zk_stark: [
    {
      title: "STARK Tower",
      url: "https://github.com/systemslibrarian/crypto-lab-stark-tower",
      note: "Transparent zk-STARK proving flow with AIR and FRI components explained.",
    },
  ],
};