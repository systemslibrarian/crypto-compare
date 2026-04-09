import type { AlgorithmCategory, CategoryDefinition, CategoryInfoMap } from "@/types/crypto";

export const CATEGORIES: CategoryDefinition[] = [
  { id:"csprng", label:"CSPRNG", icon:"🎲" },
  { id:"symmetric", label:"Symmetric", icon:"🔐" },
  { id:"curve", label:"Elliptic Curves", icon:"🌀" },
  { id:"hash", label:"Hash", icon:"#️⃣" },
  { id:"mac", label:"MAC", icon:"🏷️" },
  { id:"kdf", label:"KDF", icon:"🔑" },
  { id:"password", label:"Password", icon:"🔒" },
  { id:"asymmetric", label:"Asymmetric", icon:"🔓" },
  { id:"kem", label:"KEM", icon:"🤝" },
  { id:"signature", label:"Signatures", icon:"✍️" },
  { id:"threshold_sig", label:"Threshold Sigs", icon:"⚖️" },
  { id:"sharing", label:"Sharing", icon:"🧩" },
  { id:"he", label:"HE", icon:"🔮" },
  { id:"zkp", label:"ZKP", icon:"🎭" },
  { id:"mpc", label:"MPC", icon:"🤖" },
  { id:"ot_pir", label:"OT / PIR", icon:"👁️" },
  { id:"steganography", label:"Stego", icon:"🖼️" },
];

/** Each category has a unique accent color used for card borders, tab highlights, and glows. */
export const CATEGORY_ACCENT: Record<AlgorithmCategory, string> = {
  symmetric: "#3b82f6",   // blue
  curve: "#eab308",       // gold
  kem: "#06b6d4",         // cyan
  signature: "#8b5cf6",   // violet
  hash: "#f59e0b",        // amber
  kdf: "#10b981",         // emerald
  mac: "#ec4899",         // pink
  password: "#ef4444",    // red
  sharing: "#14b8a6",     // teal
  he: "#a78bfa",          // purple
  zkp: "#f97316",         // orange
  mpc: "#6366f1",         // indigo
  ot_pir: "#84cc16",      // lime
  asymmetric: "#0ea5e9",  // sky
  steganography: "#c026d3", // fuchsia
  threshold_sig: "#f43f5e", // rose
  csprng: "#4ade80",      // green
};

export const CATEGORY_INFO: CategoryInfoMap = {
  curve:{
    title:"Elliptic Curves",
    oneLiner:"The mathematical substrate beneath modern public-key systems. The curve is the primitive; signatures, key agreement, and many proof systems are the protocols built on top of it.",
    projects:[
      { name:"Iron Letter", tech:"ECIES on NIST P-256 — classical elliptic-curve encryption in a practical sealed-message demo", url:"https://github.com/systemslibrarian/crypto-lab-iron-letter", public:true },
      { name:"Corrupted Oracle", tech:"P-256-adjacent cautionary material around ECC-era randomness failures and Dual_EC_DRBG backdoor history", url:"https://github.com/systemslibrarian/crypto-lab-corrupted-oracle", public:true },
      { name:"Ratchet Wire", tech:"X25519 key agreement inside a Signal-style Double Ratchet message transport", url:"https://github.com/systemslibrarian/crypto-lab-ratchet-wire", public:true },
      { name:"FROST Threshold", tech:"Ed25519-based threshold signatures showing how a curve becomes a signing system", url:"https://github.com/systemslibrarian/crypto-lab-frost-threshold", public:true },
      { name:"Curve Lens", tech:"Interactive elliptic curve explorer — point addition, scalar multiplication, and live ECDH across P-256, Curve25519, and secp256k1", url:"https://github.com/systemslibrarian/crypto-lab-curve-lens", public:true },
      { name:"X3DH Wire", tech:"X3DH asynchronous key agreement — the handshake behind Signal, with four DH operations on Curve25519", url:"https://github.com/systemslibrarian/crypto-lab-x3dh-wire", public:true },
      { name:"Ed25519 Forge", tech:"Ed25519 digital signatures — keypair generation, signing, verification, deterministic nonces, tamper detection, and ZIP215 cofactor handling", url:"https://github.com/systemslibrarian/crypto-lab-ed25519-forge", public:true },
      { name:"Pairing Gate", tech:"BLS12-381 bilinear pairing — BLS signature sign/verify, signature aggregation up to 100 signers, and rogue key attack demo", url:"https://github.com/systemslibrarian/crypto-lab-pairing-gate", public:true },
    ],
    explanation:"Elliptic curves are not protocols by themselves; they are the algebraic groups that protocols live on top of. X25519 turns a curve into key agreement, Ed25519 and ECDSA turn curves into signatures, and BLS12-381 or BN254 turn pairing-friendly curves into zk-SNARK and aggregation machinery. This is also where the post-quantum contrast matters: ML-KEM lives in the KEM tab, but it is lattice-based rather than curve-based.",
    realWorld:"Curve25519 and P-256 drive secure messaging and TLS. Ed25519 drives SSH keys, package signing, and threshold-signature systems like FROST. BLS12-381 and BN254 appear in zk systems and Ethereum infrastructure, where the curve choice determines proving cost, interoperability, and long-term security margin.",
    whyItMatters:"Curves matter because they are the foundation layer, not the finished tool. If you need an applied recommendation, move next to KEM for key establishment, Signatures for Ed25519 and ECDSA, and ZKP for BN254/BLS12-381 proof systems — but the security, rigidity, and implementation risk begin here."
  },
  symmetric:{
    title:"Symmetric Encryption",
    oneLiner:"The padlock on your data. One key locks it, same key unlocks it.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"AES-256-GCM for payload encryption", url:"https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc", public:true },
      { name:"Shadow Vault", tech:"ChaCha20-Poly1305 deniable encryption — one container, two passphrases, two messages", url:"https://github.com/systemslibrarian/crypto-lab-shadow-vault", public:true },
      { name:"Dad Mode Morse", tech:"AES-256-GCM encrypted Morse code transmissions", url:"https://github.com/systemslibrarian/dad-mode-morse2", public:true },
      { name:"Sealed in the Word", tech:"AES-256-GCM with per-member key wrapping", url:null, public:false, app:"PrayerWarriors.Mobi" },
      { name:"Iron Serpent", tech:"Serpent-256 block cipher — the AES finalist with the largest security margin", url:"https://github.com/systemslibrarian/crypto-lab-iron-serpent", public:true },
      { name:"Dead Sea Cipher", tech:"Crypto history from Atbash (600 BCE) to AES-256-GCM (2001 CE)", url:"https://github.com/systemslibrarian/crypto-lab-dead-sea-cipher", public:true },
      { name:"Hybrid Wire", tech:"AES-GCM payload encryption in hybrid post-quantum key exchange", url:"https://github.com/systemslibrarian/crypto-lab-hybrid-wire", public:true },
      { name:"Ratchet Wire", tech:"AES-GCM message encryption in Double Ratchet protocol", url:"https://github.com/systemslibrarian/crypto-lab-ratchet-wire", public:true },
      { name:"Biham Lens", tech:"Differential cryptanalysis demo — the attack by Biham & Shamir that broke DES", url:"https://github.com/systemslibrarian/crypto-lab-biham-lens", public:true },
      { name:"AES Modes", tech:"AES modes compared — ECB, CBC, CTR, GCM, CCM with live padding oracle attack and ECB penguin visualization", url:"https://github.com/systemslibrarian/crypto-lab-aes-modes", public:true },
      { name:"Format Ward", tech:"Format-preserving encryption — FF1 and FF3-1 live tokenization of credit cards, SSNs, and phone numbers with real AES-256 Feistel rounds", url:"https://github.com/systemslibrarian/crypto-lab-format-ward", public:true },
      { name:"Padding Oracle", tech:"CBC padding oracle attack — full Vaudenay 2002 chosen-ciphertext attack with byte-by-byte plaintext recovery", url:"https://github.com/systemslibrarian/crypto-lab-padding-oracle", public:true },
      { name:"Timing Oracle", tech:"Timing side-channel attacks — string comparison leakage, HMAC verification timing, RSA key bit leakage, and constant-time defenses", url:"https://github.com/systemslibrarian/crypto-lab-timing-oracle", public:true },
      { name:"ChaCha20 Stream", tech:"ChaCha20 stream cipher — quarter-round stepper, keystream visualizer, nonce reuse attack demo, and encrypt/decrypt playground", url:"https://github.com/systemslibrarian/crypto-lab-chacha20-stream", public:true },
      { name:"Nonce Guard", tech:"AES-GCM vs AES-GCM-SIV — live nonce reuse attack showing keystream XOR recovery and GHASH key extraction, synthetic IV construction, and misuse-resistance comparison", url:"https://github.com/systemslibrarian/crypto-lab-nonce-guard", public:true },
    ],
    explanation:"Every time you open a website, send a message, or save an encrypted file, symmetric encryption is doing the actual work. It takes your data and a secret key and scrambles the data so thoroughly that without the key, a supercomputer running until the heat death of the universe couldn't unscramble it. The \"symmetric\" part means both sides use the same key — which is blazing fast but creates a chicken-and-egg problem: how do you safely share that key in the first place? That's where KEM and key exchange come in.",
    realWorld:"When your browser shows a padlock icon, symmetric encryption (AES or ChaCha20) is encrypting every byte between you and the server. When you encrypt a hard drive with BitLocker or FileVault, that's AES. When WireGuard VPN tunnels your traffic, that's ChaCha20. When a government stamps a document TOP SECRET and encrypts it, that's AES-256. Every single HTTPS connection, every encrypted chat message, every secure file transfer — symmetric encryption is the workhorse doing the heavy lifting at the center of all of it.",
    whyItMatters:"This is the foundation everything else builds on. Key exchange negotiates a key, signatures verify who you're talking to, but symmetric encryption is what actually protects the data. Get this wrong and nothing else matters."
  },
  kem:{
    title:"Key Encapsulation / Key Exchange",
    oneLiner:"The secret handshake. Two strangers agree on a shared secret that nobody else can figure out — even if they're being watched.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"SMAUG-T post-quantum KEM", url:"https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc", public:true },
      { name:"Sealed in the Word", tech:"RSA-OAEP / ECIES key wrapping + Cloud KMS envelope encryption", url:null, public:false, app:"PrayerWarriors.Mobi" },
      { name:"Kyber Vault", tech:"ML-KEM (CRYSTALS-Kyber) post-quantum key encapsulation — NIST FIPS 203", url:"https://github.com/systemslibrarian/crypto-lab-kyber-vault", public:true },
      { name:"Hybrid Wire", tech:"X25519 + ML-KEM-768 hybrid post-quantum key exchange as deployed in Chrome 124+", url:"https://github.com/systemslibrarian/crypto-lab-hybrid-wire", public:true },
      { name:"Ratchet Wire", tech:"X25519 Diffie-Hellman ratchet for continuous key agreement in Signal-style messaging", url:"https://github.com/systemslibrarian/crypto-lab-ratchet-wire", public:true },
      { name:"BIKE Vault", tech:"BIKE code-based post-quantum KEM — QC-MDPC codes, Black-Gray-Flip decoding, side-by-side comparison against ML-KEM", url:"https://github.com/systemslibrarian/crypto-lab-bike-vault", public:true },
      { name:"McEliece Gate", tech:"Classic McEliece — the oldest post-quantum KEM (1978), binary Goppa codes, 261KB public key visualization", url:"https://github.com/systemslibrarian/crypto-lab-mceliece-gate", public:true },
      { name:"HQC Vault", tech:"HQC Hamming Quasi-Cyclic post-quantum KEM — Reed-Muller/Reed-Solomon decoding, comparison against BIKE and ML-KEM", url:"https://github.com/systemslibrarian/crypto-lab-hqc-vault", public:true },
      { name:"Noise Pipe", tech:"Noise Protocol Framework — NN, XX, IK, IKpsk2 handshake patterns with real X25519, live transport encryption, and WireGuard deep dive", url:"https://github.com/systemslibrarian/crypto-lab-noise-pipe", public:true },
      { name:"X3DH Wire", tech:"X3DH asynchronous key agreement — the Signal handshake with four DH operations and HKDF-SHA-256", url:"https://github.com/systemslibrarian/crypto-lab-x3dh-wire", public:true },
    ],
    explanation:"Here's the fundamental problem of cryptography: you need a shared secret key to encrypt data, but how do two people who've never met agree on a secret while an attacker listens to every word they say? Key exchange solves this impossible-sounding problem using math so elegant it's almost magic. One side creates a \"puzzle\" that's easy to solve if you know the secret but impossibly hard otherwise, sends it across a public channel, and both sides end up with the same key. In the post-quantum world, this uses lattice-based math that even quantum computers can't break. KEM (Key Encapsulation Mechanism) is the modern version — instead of an interactive back-and-forth, one side wraps a secret in a mathematical puzzle that only the recipient's private key can unwrap.",
    realWorld:"Every time you open a new HTTPS connection, a key exchange happens in the first fraction of a second. Your browser and the server agree on a fresh, unique encryption key — and even if someone recorded every byte of that exchange, they can't figure out what key was agreed on. Chrome and Firefox are already using ML-KEM (Kyber) hybrid key exchange to protect against future quantum computers recording today's traffic to crack later. Signal, WhatsApp, and iMessage all use key exchange to set up encrypted chats. SSH uses it every time you connect to a server.",
    whyItMatters:"This is the first thing that breaks in a quantum world. Classical key exchange (ECDH, RSA) is completely destroyed by Shor's algorithm. The entire internet's security depends on replacing these with post-quantum KEMs before large quantum computers arrive. This is why ML-KEM adoption is moving so fast — it's an emergency in slow motion."
  },
  signature:{
    title:"Digital Signatures",
    oneLiner:"A tamper-evident seal that proves who wrote something and that nobody changed it — mathematically unforgeable.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"HAETAE post-quantum signature scheme", url:"https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc", public:true },
      { name:"Dad Mode Morse", tech:"Ed25519 digital signature verification for authenticated messages", url:"https://github.com/systemslibrarian/dad-mode-morse2", public:true },
      { name:"Dilithium Seal", tech:"ML-DSA (CRYSTALS-Dilithium) lattice-based post-quantum digital signatures — NIST FIPS 204", url:"https://github.com/systemslibrarian/crypto-lab-dilithium-seal", public:true },
      { name:"SPHINCS+ Ledger", tech:"SLH-DSA (SPHINCS+) hash-based post-quantum digital signatures — NIST FIPS 205", url:"https://github.com/systemslibrarian/crypto-lab-sphincs-ledger", public:true },
      { name:"FROST Threshold", tech:"FROST threshold signatures with Ed25519 — RFC 9591", url:"https://github.com/systemslibrarian/crypto-lab-frost-threshold", public:true },
      { name:"Falcon Seal", tech:"Falcon compact NTRU lattice signatures — Fast Fourier Sampling, comparison against ML-DSA and SLH-DSA", url:"https://github.com/systemslibrarian/crypto-lab-falcon-seal", public:true },
      { name:"Ed25519 Forge", tech:"Ed25519 keypair generation, signing, and verification — deterministic nonces, tamper detection, ZIP215 cofactor handling, and 64-byte compact signatures", url:"https://github.com/systemslibrarian/crypto-lab-ed25519-forge", public:true },
      { name:"LMS Ledger", tech:"LMS/HSS stateful hash-based signatures (NIST SP 800-208) — W-OTS+ key state grid, one-time key reuse attack with real forgery demo, and HSS hierarchical tree explainer", url:"https://github.com/systemslibrarian/crypto-lab-lms-ledger", public:true },
    ],
    explanation:"When you sign a physical document, anyone can copy your signature. Digital signatures are fundamentally different — they're mathematically impossible to forge. The signer uses a private key (that only they know) to produce a signature, and anyone can verify it using the public key (which is freely shared). If even a single bit of the signed data changes, the signature fails. This gives you two guarantees simultaneously: authenticity (this really came from who it claims) and integrity (it hasn't been altered since signing). In the post-quantum era, these must be built on math that quantum computers can't crack — lattice problems or hash functions.",
    realWorld:"Every software update your phone installs was digitally signed — that's how your device knows it's a real update from Apple or Google and not malware. Every HTTPS certificate that proves \"this is really google.com\" is digitally signed by a Certificate Authority. Git commits are signed. Government documents are signed. Court filings are signed. Code libraries are signed. Every time your computer trusts that software is legitimate or a website is who it claims to be, digital signatures are the reason.",
    whyItMatters:"If an attacker could forge digital signatures, they could push malicious software updates to every phone on earth, impersonate any website, and forge legal documents. The entire trust infrastructure of the internet — certificates, code signing, secure boot — collapses without unforgeable signatures."
  },
  hash:{
    title:"Hash Functions",
    oneLiner:"A digital fingerprint machine. Feed in any amount of data, get back a unique fixed-size fingerprint that's impossible to reverse.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"SHA-256 for container integrity, HKDF foundation", url:"https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc", public:true },
      { name:"Shadow Vault", tech:"SHA-256 key commitment and container integrity verification", url:"https://github.com/systemslibrarian/crypto-lab-shadow-vault", public:true },
      { name:"LCPL Registration Platform", tech:"HMAC-based webhook signatures, integrity checks", url:null, public:false, app:"Enterprise" },
      { name:"ZK Proof Lab", tech:"SHA-256 commitments in zero-knowledge proof demonstrations", url:"https://github.com/systemslibrarian/crypto-lab-zk-proof-lab", public:true },
      { name:"Babel Hash", tech:"SHA-256, SHA3-256, and BLAKE3 — live avalanche effect visualizer, length extension attack, and why HMAC exists", url:"https://github.com/systemslibrarian/crypto-lab-babel-hash", public:true },
      { name:"Hash Zoo", tech:"SHA-256 vs SHA3-256 vs BLAKE3 internals — live avalanche analysis, Merkle-Damgård/sponge/tree construction diagrams, and timing benchmarks", url:"https://github.com/systemslibrarian/crypto-lab-hash-zoo", public:true },
      { name:"Merkle Vault", tech:"Merkle tree and inclusion proof demo — build trees up to 16 leaves with real SHA-256, generate O(log n) membership proofs, tamper any leaf and watch the root change", url:"https://github.com/systemslibrarian/crypto-lab-merkle-vault", public:true },
    ],
    explanation:"A hash function takes any input — a single character, a 4K movie, an entire database — and produces a fixed-size output (say, 256 bits) called a digest. Three properties make this powerful: it's one-way (you can't reverse the hash to get the input), it's collision-resistant (no two different inputs should produce the same hash), and it's avalanche-sensitive (changing one bit of input changes roughly half the output bits). This means you can use a hash as a unique fingerprint for any piece of data. Same input always gives the same hash. Different inputs always give different hashes. And knowing the hash tells you nothing about the original data.",
    realWorld:"When you log into a website, the server doesn't store your password — it stores a hash of your password, then hashes what you type and compares. Git uses SHA-1 hashes to track every change to every file (and is migrating to SHA-256). Bitcoin mining is literally a competition to find hash inputs that produce outputs with enough leading zeros. When you download software and check a \"SHA-256 checksum,\" you're verifying the download matches the original. Blockchain, password storage, file integrity, data deduplication, digital forensics, and certificate transparency all run on hash functions.",
    whyItMatters:"Hash functions are the quiet workhorses behind almost everything else on this list. HMAC needs them. Digital signatures hash the data before signing. Key derivation functions are built on them. Password hashing is built on them. If hash functions broke, the cascading failure would take down virtually every security system in existence."
  },
  kdf:{
    title:"Key Derivation Functions",
    oneLiner:"The key factory. Takes one piece of secret material and produces as many unique, independent cryptographic keys as you need.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"HKDF with domain separation labels (HKDF_LABEL_SHARE_KEY, HKDF_LABEL_SHARE_NONCE)", url:"https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc", public:true },
      { name:"snow2", tech:"HKDF-SHA-256 for key derivation from passphrase-derived material", url:"https://github.com/systemslibrarian/snow2", public:true },
      { name:"Dad Mode Morse", tech:"HKDF-SHA-256 key derivation for message encryption keys", url:"https://github.com/systemslibrarian/dad-mode-morse2", public:true },
      { name:"Hybrid Wire", tech:"HKDF for deriving session keys from hybrid X25519 + ML-KEM shared secrets", url:"https://github.com/systemslibrarian/crypto-lab-hybrid-wire", public:true },
      { name:"Ratchet Wire", tech:"HKDF-based KDF chains for forward-secrecy ratcheting in Double Ratchet protocol", url:"https://github.com/systemslibrarian/crypto-lab-ratchet-wire", public:true },
      { name:"KDF Chain", tech:"KDF comparison — HKDF, PBKDF2, scrypt, and Argon2id side by side with live parameter tuning and real timing measurements", url:"https://github.com/systemslibrarian/crypto-lab-kdf-chain", public:true },
      { name:"KDF Arena", tech:"KDF benchmarks — live timing and memory comparison of HKDF, PBKDF2, scrypt, and Argon2id with adjustable cost parameters and bar chart visualization", url:"https://github.com/systemslibrarian/crypto-lab-kdf-arena", public:true },
    ],
    explanation:"After a key exchange, you have a shared secret — but you often need multiple keys from it: one for encrypting, one for authenticating, one for each direction of communication. You can't just reuse the same key for different purposes (that's catastrophic). A KDF takes your original secret and, using domain separation labels, derives as many independent keys as you need — each one cryptographically unrelated to the others even though they came from the same source. The critical distinction: some KDFs (like HKDF) expect high-quality input material from a key exchange. Others (like Argon2) are designed for low-quality input like human-chosen passwords. Using the wrong one is a serious mistake.",
    realWorld:"TLS 1.3 uses HKDF to derive all its session keys — handshake keys, application keys, resumption keys — all from a single shared secret. Signal Protocol derives new message keys for every single message (forward secrecy) using KDF chains. When Quantum Vault KPQC takes the shared secret from SMAUG-T and derives separate encryption and authentication keys with distinct labels, that's HKDF doing the work. Every VPN, every encrypted messaging app, and every secure protocol uses KDFs to turn one secret into the many keys it needs.",
    whyItMatters:"Reusing a key for two different purposes can destroy the security of both. KDFs solve this by cleanly separating key material. They're also the bridge between the \"we agreed on a secret\" step and the \"now let's actually encrypt things\" step. Get the KDF wrong and everything downstream is compromised — even if every other component is perfect."
  },
  mac:{
    title:"Message Authentication Codes",
    oneLiner:"A tamper detector with a secret. Proves a message hasn't been altered — and that it came from someone who knows the key.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"GMAC via AES-256-GCM authenticated encryption", url:"https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc", public:true },
      { name:"SwipeWatcher", tech:"HMAC-signed webhooks for access control events", url:null, public:false, app:"LCPL Enterprise" },
      { name:"Iron Serpent", tech:"HMAC for Serpent-256 authenticated encryption", url:"https://github.com/systemslibrarian/crypto-lab-iron-serpent", public:true },
      { name:"MAC Race", tech:"MAC comparison — HMAC, CMAC, Poly1305, and GHASH with live length extension, timing attack, and nonce reuse demonstrations", url:"https://github.com/systemslibrarian/crypto-lab-mac-race", public:true },
      { name:"Poly1305 MAC", tech:"Poly1305 polynomial evaluation over GF(2¹³⁰−5) — constant-time tag verification, key-reuse attack visualizer, and Polynomial Stepper", url:"https://github.com/systemslibrarian/crypto-lab-poly1305-mac", public:true },
    ],
    explanation:"A MAC is like a hash, but with a secret key mixed in. The sender computes a short tag over the message using a shared secret, and attaches it. The receiver recomputes the tag with the same key and checks it matches. If even one bit of the message changed, the tag won't match. If someone without the key tries to forge a tag, they can't — it's computationally impossible. Unlike digital signatures, MACs are symmetric: both sides need the same key, so they prove \"someone with the key sent this\" but not which specific person. The tradeoff is that MACs are dramatically faster than signatures.",
    realWorld:"Every HTTPS connection uses a MAC on every single packet to ensure nothing was tampered with in transit. AEAD ciphers (AES-GCM, ChaCha20-Poly1305) have a MAC built in — the \"A\" in AEAD is \"Authenticated\" and that authentication is a MAC. API authentication tokens (HMAC-SHA256) are MACs. JWT tokens signed with HS256 use HMAC. When your operating system verifies that a kernel module hasn't been tampered with before loading it, that's often a MAC. Every authenticated encryption operation in every browser, every server, every VPN — MACs are embedded in all of it.",
    whyItMatters:"Encryption without authentication is dangerous. An attacker might not be able to read your encrypted data, but they could flip bits and corrupt it in useful ways. MACs prevent this — they ensure that if anything was altered, you'll know. This is why modern cryptography insists on authenticated encryption (AEAD), not just encryption alone."
  },
  password:{
    title:"Password Hashing",
    oneLiner:"The vault door for credentials. Makes cracking stolen password databases so expensive that attackers give up.",
    projects:[
      { name:"Phantom Vault", tech:"PBKDF2-SHA-256 + HMAC-DRBG stateless password derivation — nothing stored, nothing synced, nothing to breach", url:"https://github.com/systemslibrarian/crypto-lab-phantom-vault", public:true },
      { name:"Shadow Vault", tech:"Argon2id key stretching for deniable encryption passphrases", url:"https://github.com/systemslibrarian/crypto-lab-shadow-vault", public:true },
      { name:"PrayerWarriors.Mobi", tech:"Firebase Auth (handles bcrypt/scrypt internally)", url:null, public:false, app:"PrayerWarriors.Mobi" },
      { name:"Iron Serpent", tech:"Argon2id key stretching for Serpent-256 encryption passphrases", url:"https://github.com/systemslibrarian/crypto-lab-iron-serpent", public:true },
    ],
    explanation:"Regular hash functions are designed to be fast. That's exactly wrong for passwords. If hashing is fast, an attacker who steals a database of password hashes can try billions of guesses per second using GPUs. Password hashing algorithms are intentionally slow and expensive — they force every guess to consume significant CPU time, memory, or both. The key insight: legitimate users only hash their password once (at login), so a half-second delay is fine. But an attacker trying millions of passwords now needs millions of half-seconds. Memory-hard functions go further: they require large amounts of RAM per guess, which makes GPU and ASIC cracking rigs either impossible or prohibitively expensive to build. This turns a million-dollar cracking rig into an expensive paperweight.",
    realWorld:"Every competent web application stores passwords using one of these algorithms. When LinkedIn was breached in 2012, passwords were stored as plain SHA-1 hashes — millions were cracked in hours. When Dropbox was breached in 2016, passwords were bcrypt-hashed — cracking was impractically slow. That's the difference. Major password managers (1Password, Bitstrike) use Argon2 or PBKDF2 to derive encryption keys from your master password. Cryptocurrency wallets use scrypt or Argon2 to protect wallet keys. Every time you create an account on a well-built website, your password goes through one of these before storage.",
    whyItMatters:"Data breaches happen constantly. The question isn't whether a password database will be stolen — it's what happens when it is. With proper password hashing, the stolen hashes are nearly useless. With bad hashing (MD5, SHA-1, unsalted anything), every password is cracked within hours. This single choice — which password hash to use — determines whether a breach is a nuisance or a catastrophe."
  },
  sharing:{
    title:"Secret Sharing",
    oneLiner:"The master key that's split into pieces. No single person holds enough to unlock anything — but bring enough pieces together and the secret reassembles.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"Shamir secret sharing over GF(256) for threshold key recovery", url:"https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc", public:true },
      { name:"Shamir Gate", tech:"Interactive Shamir's Secret Sharing — split a secret into n shares, reconstruct from any k", url:"https://github.com/systemslibrarian/crypto-lab-shamir-gate", public:true },
      { name:"Shamir Visual", tech:"Interactive polynomial graph, live Lagrange interpolation stepper, share checkboxes, and wrong-polynomial demo for the under-threshold case", url:"https://github.com/systemslibrarian/crypto-lab-shamir-visual", public:true },
    ],
    explanation:"Secret sharing solves a fundamental trust problem: how do you protect a critical secret (a master key, a nuclear launch code, a cryptocurrency wallet seed) so that no single person can abuse it, but it's still recoverable when legitimately needed? The answer: split the secret into shares distributed to different people or locations. Threshold secret sharing (like Shamir's) lets you set a policy — for example, any 3-out-of-5 shares can reconstruct the secret, but 2 shares reveal absolutely nothing. Not \"a little bit\" of information — literally zero. This is mathematically provable and information-theoretically secure, meaning no amount of computing power helps an attacker with fewer than the threshold number of shares.",
    realWorld:"Cryptocurrency exchanges store wallet keys using Shamir secret sharing — split across multiple secure locations so that no single breach compromises funds. Corporate root certificate authorities split their signing keys so that multiple officers must be present to sign a certificate. The ICANN root DNS key ceremony uses threshold sharing — multiple trusted community members each hold a share, and a quorum must physically gather to perform critical DNS operations. Nuclear launch authorization uses a two-person rule that's conceptually identical. Quantum Vault KPQC uses Shamir sharing to split the payload encryption key across multiple recipients.",
    whyItMatters:"Single points of failure destroy security. If one person holds the master key, they can be coerced, bribed, compromised, or hit by a bus. Secret sharing eliminates single points of failure while maintaining the ability to recover the secret when legitimately needed. It's the mathematical backbone of every \"requires multiple approvals\" security system."
  },
  he:{
    title:"Homomorphic Encryption",
    oneLiner:"Encrypted computation. Send your data encrypted, the server processes it encrypted, you get encrypted results back — and the server never sees your data.",
    projects:[
      { name:"Blind Oracle", tech:"TFHE-rs FHE demo — browser encrypts two numbers, Rust server adds them homomorphically, returns encrypted result. The server mathematically cannot see the data it computed.", url:"https://github.com/systemslibrarian/crypto-lab-blind-oracle", public:true },
    ],
    projectIdea:"Private Prayer Analytics — aggregate prayer statistics computed on fully encrypted prayer data. Churches see trends without seeing individual prayers. Pairs with PrayerWarriors.Mobi.",
    explanation:"This is the holy grail of privacy technology. Normal encryption requires you to decrypt data before you can do anything with it — which means whoever processes your data sees your data. Homomorphic encryption breaks this barrier: you can add, multiply, and run computations on encrypted data and get encrypted results that, when you decrypt them, are exactly what you would have gotten by computing on the plaintext. The server doing the computation never sees anything unencrypted. Fully Homomorphic Encryption (FHE) supports arbitrary computations. This was considered theoretically impossible until Craig Gentry's breakthrough in 2009, and it's been getting exponentially more practical since. Current FHE is still 1,000-10,000x slower than plaintext computation, but for many applications the privacy gain is worth the cost.",
    realWorld:"Banks are using FHE to run anti-money-laundering checks across institutions without sharing customer data. Healthcare researchers are running genomic analyses on encrypted patient data — the patients' actual genetic information is never exposed to the computing infrastructure. Apple uses a form of homomorphic encryption in its Private Cloud Compute system. Machine learning models can be trained on encrypted data, so a hospital can contribute to an AI model without ever exposing patient records. Zama (France) and Microsoft SEAL are building production FHE libraries that real companies are deploying today. CKKS (Korean-designed) is specifically built for ML workloads on encrypted data.",
    whyItMatters:"The current paradigm requires you to trust whoever processes your data. Cloud computing means trusting Amazon, Google, or Microsoft with your raw data. FHE eliminates that trust requirement entirely. If FHE becomes fast enough for general use, it fundamentally changes the privacy equation of cloud computing — you get the benefits of cloud processing without giving up the data. This is arguably the most transformative cryptographic technology under active development."
  },
  zkp:{
    title:"Zero-Knowledge Proofs",
    oneLiner:"Mathematical proof without revelation. Prove you know a secret, prove a statement is true, prove you qualify — without revealing anything beyond the truth of the claim itself.",
    projects:[
      { name:"ZK Proof Lab", tech:"Interactive ZKP playground — Groth16, PLONK, Bulletproofs with step-by-step visualization", url:"https://github.com/systemslibrarian/crypto-lab-zk-proof-lab", public:true },
    ],
    projectIdea:"Scripture Knowledge Proof — prove completion of a Scripture Journey lesson path without revealing which lessons or quiz scores. Or: church membership credential verification without revealing identity.",
    explanation:"Imagine proving you're over 21 without showing your ID. Proving you have enough money for a transaction without revealing your balance. Proving a computation was done correctly without showing the inputs. Zero-knowledge proofs make all of this possible. The prover convinces the verifier that a statement is true while revealing absolutely nothing else. There are two main families: SNARKs produce tiny proofs (a few hundred bytes) that verify in milliseconds but often require a trusted setup ceremony. STARKs produce larger proofs but need no trusted setup and are quantum-resistant. Both are enabling a revolution in blockchain scalability and privacy.",
    realWorld:"Zcash uses zk-SNARKs so you can make transactions on a public blockchain where the sender, receiver, and amount are all hidden — but the network can still verify no money was created from thin air. Ethereum Layer 2 rollups (zkSync, StarkNet, Polygon zkEVM) use ZK proofs to bundle thousands of transactions into a single proof, verified on-chain in milliseconds — this is how Ethereum plans to scale. Digital identity systems use ZK proofs for selective disclosure: prove your age without revealing your birthday, prove citizenship without revealing your passport number. ZK proofs are also used in verifiable computation — outsource computation to a cloud server and get a proof that the result is correct without re-running the computation.",
    whyItMatters:"ZKPs solve the fundamental tension between privacy and verification. Until now, verification required revelation — to prove something, you had to show the evidence. ZKPs break this coupling. The implications ripple through every system that currently requires you to over-share personal information to prove a claim. Finance, identity, healthcare, voting — any domain where \"trust but verify\" currently forces unwanted disclosure."
  },
  mpc:{
    title:"Secure Multi-Party Computation",
    oneLiner:"Joint computation, zero shared data. Multiple parties compute a result together — but nobody learns anything about anyone else's input.",
    projects:[
      { name:"Silent Tally", tech:"Secure multi-party computation for private collective decision-making", url:"https://github.com/systemslibrarian/crypto-lab-silent-tally", public:true },
    ],
    projectIdea:"Church Budget Consensus — elders privately submit budget priorities, system computes consensus allocation without revealing individual submissions. Or: multi-branch library acquisition planning without sharing circulation data.",
    explanation:"Picture three companies that want to know their combined average salary without any company revealing their individual salary data. Or two hospitals that want to train an AI model together without sharing patient records. MPC makes this possible: each party keeps their private data locally, they interact through a cryptographic protocol, and at the end everyone learns the agreed-upon output — and nothing else. Not a single bit of anyone else's input leaks. This isn't just encryption — the computation itself is distributed so that no single point ever holds the combined data. Different MPC protocols handle different trust models: some protect against honest-but-curious parties, others protect even against actively malicious participants trying to cheat.",
    realWorld:"The Boston Women's Workforce Council used MPC to compute gender pay gap statistics across multiple companies — no company revealed their salary data to each other or to the council, but the aggregate statistics were accurately computed. Estonian government uses Sharemind (MPC platform) for tax fraud detection across databases that legally cannot be combined. Sugar beet auctions in Denmark were conducted via MPC so bidders couldn't learn each other's bids. Private Set Intersection (a specialized MPC) is used by Apple and Google for contact tracing, password breach detection, and ad measurement — checking if two lists overlap without revealing the lists themselves. Cryptocurrency wallets use MPC-based threshold signing so no single device ever holds the complete private key.",
    whyItMatters:"MPC solves the \"data silo\" problem without creating privacy risk. Today, combining datasets for analysis means someone sees all the data — creating legal liability, privacy violations, and security risk. MPC lets organizations collaborate on data analysis without centralizing the data. As data regulation tightens globally (GDPR, CCPA, HIPAA), MPC becomes the only way to get the analytical benefits of data sharing without the legal and ethical costs."
  },
  ot_pir:{
    title:"Oblivious Transfer & Private Information Retrieval",
    oneLiner:"Invisible access. Retrieve exactly what you need from a database — and the database never learns what you looked at.",
    projects:[
      { name:"Patron Shield", tech:"Two-server Information-Theoretic PIR for library catalog privacy", url:"https://github.com/systemslibrarian/crypto-lab-patron-shield", public:true },
      { name:"OT Gate", tech:"1-of-2 Oblivious Transfer — Simplest OT protocol (Chou-Orlandi 2015) over Curve25519 with real X25519 arithmetic and AES-256-GCM encryption", url:"https://github.com/systemslibrarian/crypto-lab-ot-gate", public:true },
      { name:"Oblivious Shelf", tech:"2-server XOR Private Information Retrieval (Chor et al. 1995) — retrieve any item from a 16-item catalog without the server learning which one", url:"https://github.com/systemslibrarian/crypto-lab-oblivious-shelf", public:true },
    ],
    projectIdea:"Private Scripture Lookup — query a Bible verse database without the server learning which verse was requested. Protects people searching for verses about grief, addiction, or abuse from revealing their situation.",
    explanation:"Oblivious Transfer (OT) is a two-party protocol where a sender holds multiple messages and a receiver picks one to receive — but the sender doesn't learn which one was chosen, and the receiver only gets the one they picked. It sounds simple but it's the fundamental building block of virtually all MPC protocols. Private Information Retrieval (PIR) scales this idea to databases: a user queries a database and gets back their result, but the database server has no idea which record was accessed. Current PIR schemes are based on lattice cryptography (making them quantum-resistant) or use multiple non-colluding servers for information-theoretic guarantees. The practical challenge is efficiency — truly private database access is expensive compared to just asking openly.",
    realWorld:"Apple's iCloud Private Relay uses PIR-like techniques so Apple's servers help route your traffic without knowing which websites you visit. Signal uses Private Contact Discovery — you can check which of your phone contacts are on Signal without Signal learning your contact list. Certificate Transparency systems are exploring PIR so browsers can check if a certificate has been revoked without telling the CA which sites they're visiting (which would leak browsing history). Password breach checking services (like Have I Been Pwned's k-anonymity API and 1Password's implementation) use PIR-adjacent techniques so you can check if your password was breached without sending the password. Chrome's SafeBrowsing is exploring PIR to check URLs against malware databases without Google learning which URLs you visit.",
    whyItMatters:"The metadata problem: even when data is encrypted, the access pattern reveals information. If a medical database can see you looked up \"oncology treatment protocols,\" the query itself leaks your health situation. OT and PIR protect the access pattern — not just the data, but the fact that you accessed it. As surveillance concerns grow and privacy regulations tighten, hiding what you access becomes as important as encrypting what you send."
  },
  asymmetric:{
    title:"Asymmetric / Public-Key Encryption",
    oneLiner:"Two keys, one public, one private — the foundation of how strangers on the internet trust each other.",
    projects:[
      { name:"Iron Letter", tech:"ECIES P-256 vs RSA-OAEP side-by-side — seal a letter that only one key can open", url:"https://github.com/systemslibrarian/crypto-lab-iron-letter", public:true },
      { name:"Sealed in the Word", tech:"RSA-OAEP / ECIES key wrapping + Cloud KMS envelope encryption", url:null, public:false, app:"PrayerWarriors.Mobi" },
      { name:"RSA Forge", tech:"Textbook RSA, OAEP, PSS signatures, and live attacks — small exponent, Bleichenbacher PKCS#1 v1.5 oracle, and padding oracle", url:"https://github.com/systemslibrarian/crypto-lab-rsa-forge", public:true },
    ],
    explanation:"Public-key encryption lets anyone encrypt a message that only the private key holder can decrypt. Unlike symmetric crypto, no shared secret needs to be established in advance. The sender uses the recipient's public key (which can be posted on a website) to lock the message, and only the recipient's private key can unlock it. This breaks the chicken-and-egg problem of 'how do you securely share a key with someone you've never talked to?' The mathematical trapdoor properties of RSA (integer factorization) and elliptic curves (discrete log) make this possible — easy to compute one direction, computationally infeasible to reverse. Critically, this predates the modern era of quantum computers: all classical asymmetric schemes are vulnerable to Shor's algorithm. Post-quantum key encapsulation (KEM) is replacing these for key exchange purposes.",
    realWorld:"PGP email encryption, S/MIME (email signing/encryption in Outlook and iOS Mail), SSH key-based authentication (your ~/.ssh/id_rsa.pub is a public key), legacy TLS handshakes (pre-TLS 1.3), certificate authorities signing server certificates, Java JAR signing, code signing certificates, mobile app stores verifying app authenticity, and every HTTPS certificate you've ever clicked on.",
    whyItMatters:"Without asymmetric encryption, every secure connection would require a prior out-of-band secret exchange. You'd have to meet your bank in person to set up a password before ever banking online. It's what makes cold-contact secure communication possible — a stranger can securely send you a message using nothing but your public key, which you could post on a billboard. The loss of confidence in classical asymmetric crypto due to quantum computers is why the post-quantum transition is an emergency: the entire PKI trust model needs rebuilding."
  },
  steganography:{
    title:"Steganography",
    oneLiner:"Hide the message so no one knows a message exists.",
    projects:[
      { name:"snow2", tech:"Modern Rust tool named for the SNOW stream cipher family; references steganographic covert channels", url:"https://github.com/systemslibrarian/snow2", public:true },
      { name:"Meow Decoder", tech:"Secure optical air-gap file transfer via QR-code GIFs — fountain codes for camera loss and fail-closed crypto", url:"https://github.com/systemslibrarian/meow-decoder", public:true },
    ],
    projectIdea:"Scripture Cloak — embed annotated Bible verse encoding inside an innocuous image, demonstrating how the steganography/ZKP/hash chain proves a verse's integrity without revealing which study was being done.",
    explanation:"Steganography conceals data inside innocent-looking carrier files — images, audio, video, text — so that an observer doesn't know communication is happening at all. Distinct from encryption, which hides content but not the fact of communication. A steganographic image looks exactly like an ordinary photo; a steganalyst must actively examine statistical properties of the file to detect that a hidden message exists. The hiding technique ranges from naive (replacing the least significant bit of each pixel — easily detected) to sophisticated adaptive methods (WOW, HUGO) that concentrate hidden bits in regions of natural images that are statistically hardest to analyze. Modern steganalysis uses machine learning classifiers trained on millions of cover and stego images, making this an arms race between embedders and detectors.",
    realWorld:"Digital watermarking (Adobe Content Credentials, camera manufacturer fingerprinting), covert channel research, law enforcement forensics (detecting hidden contraband in images), printer steganography (yellow dot tracking used by Xerox and HP — every color laser printer secretly embeds a unique device ID in every printed page using near-invisible yellow dots), broadcast monitoring systems, newspaper photo authentication. Related project: SNOW2.",
    whyItMatters:"Encryption reveals that secrets exist. Steganography hides that they do. For adversarial environments — authoritarian surveillance states, whistleblower communication, covert journalism — deniability matters as much as confidentiality. If carrying an encrypted file gets you detained and compelled to reveal the key, steganography's 'there is no hidden file' defense is the only option. It's also the foundation of digital watermarking, which is how media companies prove ownership of images and how camera manufacturers build forensic provenance into every photo."
  },
  threshold_sig:{
    title:"Threshold Signatures",
    oneLiner:"No single key controls everything — signing requires agreement from a quorum.",
    projects:[
      { name:"FROST Threshold", tech:"FROST threshold signature scheme for distributed signing authority", url:"https://github.com/systemslibrarian/crypto-lab-frost-threshold", public:true },
    ],
    projectIdea:"Distributed Church Document Signing — pastoral board decisions require signatures from 3-of-5 elders before a document is signed and published. No single elder can act unilaterally.",
    explanation:"Threshold signature schemes distribute signing authority across N parties such that any T of them must cooperate to produce a valid signature. The critical distinction from secret sharing: no single party ever holds or reconstructs the full private key — the signing happens via a distributed protocol that never assembles the key in one place. This is architecturally different from Shamir's secret sharing, which splits a secret that is eventually reassembled. In threshold signatures, the private key is mathematically divided such that T parties can jointly produce a valid signature for any message without any of them learning the full key. The result looks exactly like a signature from a single key.",
    realWorld:"Cryptocurrency custody (Fireblocks, Coinbase Vault — institutional crypto custody where a single compromised server can't steal funds), ICANN DNSSEC root key ceremonies (multiple trusted community members each hold a share; a quorum must physically gather to sign the root), multi-org certificate authorities, blockchain validator sets (Ethereum 2.0 validators use BLS threshold signatures), enterprise HSM clusters for code signing where a single HSM compromise shouldn't enable malicious signing.",
    whyItMatters:"A single compromised key ends security. Threshold schemes mean an attacker must compromise T parties simultaneously — raising the cost of a signing key theft from 'hack one server' to 'hack T independent organizations.' For critical infrastructure like DNS root keys or billion-dollar custody wallets, this distinction is the difference between a security incident and a catastrophic failure. Unlike secret sharing (which splits a stored secret), threshold signing ensures the key is never reassembled anywhere, eliminating the window of vulnerability during reconstruction."
  },
  csprng:{
    title:"CSPRNG — Cryptographic Randomness",
    oneLiner:"Everything in cryptography starts here — the randomness that makes secrets unguessable.",
    projects:[
      { name:"Corrupted Oracle", tech:"Dual_EC_DRBG backdoor demonstration — shows what a compromised CSPRNG looks like vs. HMAC-DRBG and ChaCha20-DRBG", url:"https://github.com/systemslibrarian/crypto-lab-corrupted-oracle", public:true },
      { name:"Quantum Vault KPQC", tech:"CSPRNG for nonce generation and key randomness foundations", url:"https://github.com/systemslibrarian/crypto-lab-quantum-vault-kpqc", public:true },
    ],
    explanation:"Cryptographically Secure Pseudo-Random Number Generators (CSPRNGs) produce output that is computationally indistinguishable from true randomness. They are seeded by entropy sources — hardware noise (thermal, quantum), OS entropy pools, timing jitter — and expanded into the key material every other primitive in this museum depends on. Every AES key, every RSA prime, every ECDH nonce, every TLS session key — all start with a CSPRNG. A broken CSPRNG breaks everything built on top of it, regardless of the mathematical strength of the algorithms that use its output. The 2008 Debian OpenSSL vulnerability (a patch accidentally zeroed the entropy pool) produced predictable keys from a 'broken' CSPRNG seeded with only the process ID — thousands of SSH and TLS keys remained compromised for years after the fix. CSPRNGs are only as good as their entropy input: a CSPRNG seeded with weak entropy (low-entropy VM boot, predictable seed) produces predictable output regardless of algorithm quality.",
    realWorld:"/dev/urandom (Linux), /dev/random (macOS/BSD), CryptGenRandom / BCryptGenRandom (Windows), SecureRandom (Java), crypto.getRandomValues() (browsers), every TLS session key generation, every private key generated by any tool, every nonce in every AEAD encryption operation ever performed.",
    whyItMatters:"A broken CSPRNG breaks everything. The 2008 Debian OpenSSL incident. The 2012 Android Bitcoin wallet vulnerability (predictable SecureRandom led to private key theft). The NIST Dual_EC_DRBG backdoor (an NSA-influenced constant that allowed state-level prediction of CSPRNG output). These didn't break AES or RSA — they broke the randomness that feeds them. Every other algorithm in this museum is rendered worthless if the keys and nonces that feed into it are predictable."
  },
};
