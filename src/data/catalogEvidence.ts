import type { CatalogEvidence, DeploymentLevel, StandardizationStage } from "@/types/crypto";

const evidence = (
  stage: StandardizationStage,
  formalPublication: boolean,
  bodies: string[],
  level: DeploymentLevel,
): CatalogEvidence => ({
  standardization: { stage, formalPublication, bodies },
  deployment: { level },
});

/**
 * Explicit filter evidence. Nothing in this table is inferred from prose,
 * recommendation labels, or status-label keywords. New catalog entries must
 * add a row here before the dataset coverage test will pass.
 */
export const CATALOG_EVIDENCE: Record<string, CatalogEvidence> = {
  aes256gcm: evidence("final", true, ["NIST"], "ubiquitous"),
  chacha20poly: evidence("final", true, ["IRTF", "RFC Editor"], "widespread"),
  xchacha20poly: evidence("draft", false, ["IRTF"], "widespread"),
  ascon_aead128: evidence("final", true, ["NIST"], "documented"),
  camellia256: evidence("final", true, ["ISO", "CRYPTREC", "RFC Editor"], "documented"),
  aria256: evidence("final", true, ["KATS"], "documented"),
  sm4: evidence("final", true, ["SAC", "ISO"], "widespread"),
  kuznyechik: evidence("final", true, ["Rosstandart"], "documented"),
  snow_v: evidence("final", true, ["3GPP"], "documented"),
  aes256gcmsiv: evidence("final", true, ["IRTF", "RFC Editor"], "documented"),

  curve25519: evidence("final", true, ["IRTF", "RFC Editor"], "ubiquitous"),
  ed25519: evidence("final", true, ["IRTF", "RFC Editor"], "ubiquitous"),
  p256: evidence("final", true, ["NIST"], "ubiquitous"),
  p384: evidence("final", true, ["NIST"], "widespread"),
  p521: evidence("final", true, ["NIST"], "documented"),
  secp256k1: evidence("final", true, ["SECG"], "widespread"),
  curve448_ed448: evidence("final", true, ["IRTF", "RFC Editor"], "documented"),
  bls12_381_curve: evidence("draft", false, ["IETF"], "widespread"),
  bn254: evidence("research", false, [], "widespread"),
  brainpool_p256r1: evidence("final", true, ["BSI", "RFC Editor"], "limited"),

  mlkem512: evidence("final", true, ["NIST"], "limited"),
  mlkem768: evidence("final", true, ["NIST"], "widespread"),
  mlkem1024: evidence("final", true, ["NIST"], "documented"),
  smaug_t: evidence("selected", false, ["KpqC"], "limited"),
  hqc: evidence("selected", false, ["NIST"], "limited"),
  classic_mceliece: evidence("draft", false, ["ISO"], "limited"),
  frodokem: evidence("final", false, ["BSI"], "documented"),
  bike: evidence("research", false, ["NIST"], "research"),

  mldsa44: evidence("final", true, ["NIST"], "documented"),
  mldsa65: evidence("final", true, ["NIST"], "documented"),
  haetae: evidence("selected", false, ["KpqC"], "limited"),
  falcon512: evidence("selected", false, ["NIST"], "documented"),
  slh_dsa: evidence("final", true, ["NIST"], "documented"),
  xmss: evidence("final", true, ["NIST", "IRTF", "RFC Editor"], "documented"),
  lms_hss: evidence("final", true, ["NIST", "IRTF", "RFC Editor"], "documented"),

  sha256: evidence("final", true, ["NIST"], "ubiquitous"),
  sha512: evidence("final", true, ["NIST"], "ubiquitous"),
  sha3_256: evidence("final", true, ["NIST"], "widespread"),
  blake2b: evidence("final", true, ["IRTF", "RFC Editor"], "widespread"),
  blake3: evidence("none", false, [], "widespread"),
  sm3: evidence("final", true, ["SAC", "ISO"], "widespread"),
  streebog: evidence("final", true, ["Rosstandart"], "documented"),
  kupyna: evidence("final", true, ["DSTU"], "limited"),

  hkdf: evidence("final", true, ["IRTF", "RFC Editor"], "ubiquitous"),
  argon2_kdf: evidence("final", true, ["IRTF", "RFC Editor"], "widespread"),
  scrypt_kdf: evidence("final", true, ["IETF", "RFC Editor"], "widespread"),
  pbkdf2: evidence("final", true, ["NIST"], "ubiquitous"),
  balloon: evidence("research", false, [], "limited"),

  hmac_sha256: evidence("final", true, ["NIST", "IETF", "RFC Editor"], "ubiquitous"),
  cmac_aes: evidence("final", true, ["NIST"], "widespread"),
  kmac256: evidence("final", true, ["NIST"], "documented"),
  poly1305: evidence("final", true, ["IRTF", "RFC Editor"], "widespread"),
  siphash: evidence("none", false, [], "widespread"),

  argon2id: evidence("final", true, ["IRTF", "RFC Editor"], "widespread"),
  bcrypt: evidence("none", false, ["OpenBSD"], "ubiquitous"),
  scrypt_pw: evidence("final", true, ["IETF", "RFC Editor"], "widespread"),
  pbkdf2_pw: evidence("final", true, ["NIST"], "ubiquitous"),
  balloon_pw: evidence("research", false, [], "limited"),

  shamir: evidence("none", false, [], "widespread"),
  blakley: evidence("none", false, [], "limited"),
  feldman_vss: evidence("none", false, [], "documented"),
  pedersen_vss: evidence("none", false, [], "documented"),
  additive_sharing: evidence("none", false, [], "widespread"),

  tfhe: evidence("research", false, [], "documented"),
  bgv: evidence("research", false, [], "documented"),
  bfv: evidence("research", false, [], "documented"),
  ckks: evidence("research", false, [], "documented"),

  groth16: evidence("research", false, [], "widespread"),
  plonk: evidence("research", false, [], "widespread"),
  zk_stark: evidence("research", false, [], "documented"),
  bulletproofs: evidence("research", false, [], "widespread"),

  spdz: evidence("research", false, [], "documented"),
  aby: evidence("research", false, [], "documented"),
  garbled_circuits: evidence("none", false, [], "widespread"),
  sharemind: evidence("none", false, [], "documented"),

  ot_base: evidence("none", false, [], "widespread"),
  ot_extension: evidence("none", false, [], "widespread"),
  cpir: evidence("research", false, [], "research"),
  it_pir: evidence("none", false, [], "documented"),

  rsa_oaep_2048: evidence("final", true, ["NIST", "IETF", "RFC Editor"], "widespread"),
  rsa_oaep_4096: evidence("final", true, ["NIST", "IETF", "RFC Editor"], "documented"),
  elgamal: evidence("none", false, [], "documented"),
  ecies_p256: evidence("final", true, ["ANSI", "ISO"], "documented"),
  sm2_enc: evidence("final", true, ["SAC", "ISO"], "widespread"),

  lsb_stego: evidence("research", false, [], "widespread"),
  dct_f5: evidence("research", false, [], "documented"),
  bpcs: evidence("research", false, [], "limited"),
  spread_spectrum_stego: evidence("research", false, [], "documented"),
  wow_stego: evidence("research", false, [], "limited"),

  frost: evidence("final", true, ["IRTF", "RFC Editor"], "documented"),
  gg20: evidence("research", false, [], "widespread"),
  bls_threshold: evidence("draft", false, ["IRTF"], "documented"),
  shamir_schnorr: evidence("research", false, [], "limited"),
  dkls23: evidence("research", false, [], "limited"),

  hmac_drbg: evidence("final", true, ["NIST"], "widespread"),
  ctr_drbg: evidence("final", true, ["NIST"], "widespread"),
  hash_drbg: evidence("final", true, ["NIST"], "documented"),
  chacha20_drbg: evidence("none", false, [], "widespread"),
  fortuna: evidence("none", false, [], "widespread"),
};
