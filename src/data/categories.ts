import type { CategoryDefinition, CategoryInfoMap } from "@/types/crypto";

export const CATEGORIES: CategoryDefinition[] = [
  { id:"symmetric", label:"Symmetric", icon:"🔐" },
  { id:"kem", label:"KEM", icon:"🤝" },
  { id:"signature", label:"Signatures", icon:"✍️" },
  { id:"hash", label:"Hash", icon:"#️⃣" },
  { id:"kdf", label:"KDF", icon:"🔑" },
  { id:"mac", label:"MAC", icon:"🏷️" },
  { id:"password", label:"Password", icon:"🔒" },
  { id:"sharing", label:"Sharing", icon:"🧩" },
  { id:"he", label:"HE", icon:"🔮" },
  { id:"zkp", label:"ZKP", icon:"🎭" },
  { id:"mpc", label:"MPC", icon:"🤖" },
  { id:"ot_pir", label:"OT / PIR", icon:"👁️" },
];

export const CATEGORY_INFO: CategoryInfoMap = {
  symmetric:{
    title:"Symmetric Encryption",
    oneLiner:"The padlock on your data. One key locks it, same key unlocks it.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"AES-256-GCM for payload encryption", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
      { name:"Sealed in the Word", tech:"AES-256-GCM with per-member key wrapping", url:null, public:false, app:"PrayerWarriors.Mobi" },
      { name:"meow-decoder", tech:"AES-256-GCM encrypted QR file transfer", url:"https://github.com/systemslibrarian/meow-decoder", public:true },
    ],
    explanation:"Every time you open a website, send a message, or save an encrypted file, symmetric encryption is doing the actual work. It takes your data and a secret key and scrambles the data so thoroughly that without the key, a supercomputer running until the heat death of the universe couldn't unscramble it. The \"symmetric\" part means both sides use the same key — which is blazing fast but creates a chicken-and-egg problem: how do you safely share that key in the first place? That's where KEM and key exchange come in.",
    realWorld:"When your browser shows a padlock icon, symmetric encryption (AES or ChaCha20) is encrypting every byte between you and the server. When you encrypt a hard drive with BitLocker or FileVault, that's AES. When WireGuard VPN tunnels your traffic, that's ChaCha20. When a government stamps a document TOP SECRET and encrypts it, that's AES-256. Every single HTTPS connection, every encrypted chat message, every secure file transfer — symmetric encryption is the workhorse doing the heavy lifting at the center of all of it.",
    whyItMatters:"This is the foundation everything else builds on. Key exchange negotiates a key, signatures verify who you're talking to, but symmetric encryption is what actually protects the data. Get this wrong and nothing else matters."
  },
  kem:{
    title:"Key Encapsulation / Key Exchange",
    oneLiner:"The secret handshake. Two strangers agree on a shared secret that nobody else can figure out — even if they're being watched.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"SMAUG-T post-quantum KEM", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
      { name:"Sealed in the Word", tech:"RSA-OAEP / ECIES key wrapping + Cloud KMS envelope encryption", url:null, public:false, app:"PrayerWarriors.Mobi" },
    ],
    explanation:"Here's the fundamental problem of cryptography: you need a shared secret key to encrypt data, but how do two people who've never met agree on a secret while an attacker listens to every word they say? Key exchange solves this impossible-sounding problem using math so elegant it's almost magic. One side creates a \"puzzle\" that's easy to solve if you know the secret but impossibly hard otherwise, sends it across a public channel, and both sides end up with the same key. In the post-quantum world, this uses lattice-based math that even quantum computers can't break. KEM (Key Encapsulation Mechanism) is the modern version — instead of an interactive back-and-forth, one side wraps a secret in a mathematical puzzle that only the recipient's private key can unwrap.",
    realWorld:"Every time you open a new HTTPS connection, a key exchange happens in the first fraction of a second. Your browser and the server agree on a fresh, unique encryption key — and even if someone recorded every byte of that exchange, they can't figure out what key was agreed on. Chrome and Firefox are already using ML-KEM (Kyber) hybrid key exchange to protect against future quantum computers recording today's traffic to crack later. Signal, WhatsApp, and iMessage all use key exchange to set up encrypted chats. SSH uses it every time you connect to a server.",
    whyItMatters:"This is the first thing that breaks in a quantum world. Classical key exchange (ECDH, RSA) is completely destroyed by Shor's algorithm. The entire internet's security depends on replacing these with post-quantum KEMs before large quantum computers arrive. This is why ML-KEM adoption is moving so fast — it's an emergency in slow motion."
  },
  signature:{
    title:"Digital Signatures",
    oneLiner:"A tamper-evident seal that proves who wrote something and that nobody changed it — mathematically unforgeable.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"HAETAE post-quantum signature scheme", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
    ],
    explanation:"When you sign a physical document, anyone can copy your signature. Digital signatures are fundamentally different — they're mathematically impossible to forge. The signer uses a private key (that only they know) to produce a signature, and anyone can verify it using the public key (which is freely shared). If even a single bit of the signed data changes, the signature fails. This gives you two guarantees simultaneously: authenticity (this really came from who it claims) and integrity (it hasn't been altered since signing). In the post-quantum era, these must be built on math that quantum computers can't crack — lattice problems or hash functions.",
    realWorld:"Every software update your phone installs was digitally signed — that's how your device knows it's a real update from Apple or Google and not malware. Every HTTPS certificate that proves \"this is really google.com\" is digitally signed by a Certificate Authority. Git commits are signed. Government documents are signed. Court filings are signed. Code libraries are signed. Every time your computer trusts that software is legitimate or a website is who it claims to be, digital signatures are the reason.",
    whyItMatters:"If an attacker could forge digital signatures, they could push malicious software updates to every phone on earth, impersonate any website, and forge legal documents. The entire trust infrastructure of the internet — certificates, code signing, secure boot — collapses without unforgeable signatures."
  },
  hash:{
    title:"Hash Functions",
    oneLiner:"A digital fingerprint machine. Feed in any amount of data, get back a unique fixed-size fingerprint that's impossible to reverse.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"SHA-256 for container integrity, HKDF foundation", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
      { name:"meow-decoder", tech:"Hash-based integrity verification for QR frames", url:"https://github.com/systemslibrarian/meow-decoder", public:true },
      { name:"LCPL Registration Platform", tech:"HMAC-based webhook signatures, integrity checks", url:null, public:false, app:"Enterprise" },
    ],
    explanation:"A hash function takes any input — a single character, a 4K movie, an entire database — and produces a fixed-size output (say, 256 bits) called a digest. Three properties make this powerful: it's one-way (you can't reverse the hash to get the input), it's collision-resistant (no two different inputs should produce the same hash), and it's avalanche-sensitive (changing one bit of input changes roughly half the output bits). This means you can use a hash as a unique fingerprint for any piece of data. Same input always gives the same hash. Different inputs always give different hashes. And knowing the hash tells you nothing about the original data.",
    realWorld:"When you log into a website, the server doesn't store your password — it stores a hash of your password, then hashes what you type and compares. Git uses SHA-1 hashes to track every change to every file (and is migrating to SHA-256). Bitcoin mining is literally a competition to find hash inputs that produce outputs with enough leading zeros. When you download software and check a \"SHA-256 checksum,\" you're verifying the download matches the original. Blockchain, password storage, file integrity, data deduplication, digital forensics, and certificate transparency all run on hash functions.",
    whyItMatters:"Hash functions are the quiet workhorses behind almost everything else on this list. HMAC needs them. Digital signatures hash the data before signing. Key derivation functions are built on them. Password hashing is built on them. If hash functions broke, the cascading failure would take down virtually every security system in existence."
  },
  kdf:{
    title:"Key Derivation Functions",
    oneLiner:"The key factory. Takes one piece of secret material and produces as many unique, independent cryptographic keys as you need.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"HKDF with domain separation labels (HKDF_LABEL_SHARE_KEY, HKDF_LABEL_SHARE_NONCE)", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
    ],
    explanation:"After a key exchange, you have a shared secret — but you often need multiple keys from it: one for encrypting, one for authenticating, one for each direction of communication. You can't just reuse the same key for different purposes (that's catastrophic). A KDF takes your original secret and, using domain separation labels, derives as many independent keys as you need — each one cryptographically unrelated to the others even though they came from the same source. The critical distinction: some KDFs (like HKDF) expect high-quality input material from a key exchange. Others (like Argon2) are designed for low-quality input like human-chosen passwords. Using the wrong one is a serious mistake.",
    realWorld:"TLS 1.3 uses HKDF to derive all its session keys — handshake keys, application keys, resumption keys — all from a single shared secret. Signal Protocol derives new message keys for every single message (forward secrecy) using KDF chains. When Quantum Vault KPQC takes the shared secret from SMAUG-T and derives separate encryption and authentication keys with distinct labels, that's HKDF doing the work. Every VPN, every encrypted messaging app, and every secure protocol uses KDFs to turn one secret into the many keys it needs.",
    whyItMatters:"Reusing a key for two different purposes can destroy the security of both. KDFs solve this by cleanly separating key material. They're also the bridge between the \"we agreed on a secret\" step and the \"now let's actually encrypt things\" step. Get the KDF wrong and everything downstream is compromised — even if every other component is perfect."
  },
  mac:{
    title:"Message Authentication Codes",
    oneLiner:"A tamper detector with a secret. Proves a message hasn't been altered — and that it came from someone who knows the key.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"GMAC via AES-256-GCM authenticated encryption", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
      { name:"SwipeWatcher", tech:"HMAC-signed webhooks for access control events", url:null, public:false, app:"LCPL Enterprise" },
    ],
    explanation:"A MAC is like a hash, but with a secret key mixed in. The sender computes a short tag over the message using a shared secret, and attaches it. The receiver recomputes the tag with the same key and checks it matches. If even one bit of the message changed, the tag won't match. If someone without the key tries to forge a tag, they can't — it's computationally impossible. Unlike digital signatures, MACs are symmetric: both sides need the same key, so they prove \"someone with the key sent this\" but not which specific person. The tradeoff is that MACs are dramatically faster than signatures.",
    realWorld:"Every HTTPS connection uses a MAC on every single packet to ensure nothing was tampered with in transit. AEAD ciphers (AES-GCM, ChaCha20-Poly1305) have a MAC built in — the \"A\" in AEAD is \"Authenticated\" and that authentication is a MAC. API authentication tokens (HMAC-SHA256) are MACs. JWT tokens signed with HS256 use HMAC. When your operating system verifies that a kernel module hasn't been tampered with before loading it, that's often a MAC. Every authenticated encryption operation in every browser, every server, every VPN — MACs are embedded in all of it.",
    whyItMatters:"Encryption without authentication is dangerous. An attacker might not be able to read your encrypted data, but they could flip bits and corrupt it in useful ways. MACs prevent this — they ensure that if anything was altered, you'll know. This is why modern cryptography insists on authenticated encryption (AEAD), not just encryption alone."
  },
  password:{
    title:"Password Hashing",
    oneLiner:"The vault door for credentials. Makes cracking stolen password databases so expensive that attackers give up.",
    projects:[
      { name:"PrayerWarriors.Mobi", tech:"Firebase Auth (handles bcrypt/scrypt internally)", url:null, public:false, app:"PrayerWarriors.Mobi", note:"Indirect — Firebase handles the hashing. No standalone demo yet." },
    ],
    explanation:"Regular hash functions are designed to be fast. That's exactly wrong for passwords. If hashing is fast, an attacker who steals a database of password hashes can try billions of guesses per second using GPUs. Password hashing algorithms are intentionally slow and expensive — they force every guess to consume significant CPU time, memory, or both. The key insight: legitimate users only hash their password once (at login), so a half-second delay is fine. But an attacker trying millions of passwords now needs millions of half-seconds. Memory-hard functions go further: they require large amounts of RAM per guess, which makes GPU and ASIC cracking rigs either impossible or prohibitively expensive to build. This turns a million-dollar cracking rig into an expensive paperweight.",
    realWorld:"Every competent web application stores passwords using one of these algorithms. When LinkedIn was breached in 2012, passwords were stored as plain SHA-1 hashes — millions were cracked in hours. When Dropbox was breached in 2016, passwords were bcrypt-hashed — cracking was impractically slow. That's the difference. Major password managers (1Password, Bitstrike) use Argon2 or PBKDF2 to derive encryption keys from your master password. Cryptocurrency wallets use scrypt or Argon2 to protect wallet keys. Every time you create an account on a well-built website, your password goes through one of these before storage.",
    whyItMatters:"Data breaches happen constantly. The question isn't whether a password database will be stolen — it's what happens when it is. With proper password hashing, the stolen hashes are nearly useless. With bad hashing (MD5, SHA-1, unsalted anything), every password is cracked within hours. This single choice — which password hash to use — determines whether a breach is a nuisance or a catastrophe."
  },
  sharing:{
    title:"Secret Sharing",
    oneLiner:"The master key that's split into pieces. No single person holds enough to unlock anything — but bring enough pieces together and the secret reassembles.",
    projects:[
      { name:"Quantum Vault KPQC", tech:"Shamir secret sharing over GF(256) for threshold key recovery", url:"https://github.com/systemslibrarian/quantum-vault-kpqc", public:true },
    ],
    explanation:"Secret sharing solves a fundamental trust problem: how do you protect a critical secret (a master key, a nuclear launch code, a cryptocurrency wallet seed) so that no single person can abuse it, but it's still recoverable when legitimately needed? The answer: split the secret into shares distributed to different people or locations. Threshold secret sharing (like Shamir's) lets you set a policy — for example, any 3-out-of-5 shares can reconstruct the secret, but 2 shares reveal absolutely nothing. Not \"a little bit\" of information — literally zero. This is mathematically provable and information-theoretically secure, meaning no amount of computing power helps an attacker with fewer than the threshold number of shares.",
    realWorld:"Cryptocurrency exchanges store wallet keys using Shamir secret sharing — split across multiple secure locations so that no single breach compromises funds. Corporate root certificate authorities split their signing keys so that multiple officers must be present to sign a certificate. The ICANN root DNS key ceremony uses threshold sharing — multiple trusted community members each hold a share, and a quorum must physically gather to perform critical DNS operations. Nuclear launch authorization uses a two-person rule that's conceptually identical. Quantum Vault KPQC uses Shamir sharing to split the payload encryption key across multiple recipients.",
    whyItMatters:"Single points of failure destroy security. If one person holds the master key, they can be coerced, bribed, compromised, or hit by a bus. Secret sharing eliminates single points of failure while maintaining the ability to recover the secret when legitimately needed. It's the mathematical backbone of every \"requires multiple approvals\" security system."
  },
  he:{
    title:"Homomorphic Encryption",
    oneLiner:"Encrypted computation. Send your data encrypted, the server processes it encrypted, you get encrypted results back — and the server never sees your data.",
    projects:[],
    projectIdea:"Private Prayer Analytics — aggregate prayer statistics computed on fully encrypted prayer data. Churches see trends without seeing individual prayers. Pairs with PrayerWarriors.Mobi.",
    explanation:"This is the holy grail of privacy technology. Normal encryption requires you to decrypt data before you can do anything with it — which means whoever processes your data sees your data. Homomorphic encryption breaks this barrier: you can add, multiply, and run computations on encrypted data and get encrypted results that, when you decrypt them, are exactly what you would have gotten by computing on the plaintext. The server doing the computation never sees anything unencrypted. Fully Homomorphic Encryption (FHE) supports arbitrary computations. This was considered theoretically impossible until Craig Gentry's breakthrough in 2009, and it's been getting exponentially more practical since. Current FHE is still 1,000-10,000x slower than plaintext computation, but for many applications the privacy gain is worth the cost.",
    realWorld:"Banks are using FHE to run anti-money-laundering checks across institutions without sharing customer data. Healthcare researchers are running genomic analyses on encrypted patient data — the patients' actual genetic information is never exposed to the computing infrastructure. Apple uses a form of homomorphic encryption in its Private Cloud Compute system. Machine learning models can be trained on encrypted data, so a hospital can contribute to an AI model without ever exposing patient records. Zama (France) and Microsoft SEAL are building production FHE libraries that real companies are deploying today. CKKS (Korean-designed) is specifically built for ML workloads on encrypted data.",
    whyItMatters:"The current paradigm requires you to trust whoever processes your data. Cloud computing means trusting Amazon, Google, or Microsoft with your raw data. FHE eliminates that trust requirement entirely. If FHE becomes fast enough for general use, it fundamentally changes the privacy equation of cloud computing — you get the benefits of cloud processing without giving up the data. This is arguably the most transformative cryptographic technology under active development."
  },
  zkp:{
    title:"Zero-Knowledge Proofs",
    oneLiner:"Mathematical proof without revelation. Prove you know a secret, prove a statement is true, prove you qualify — without revealing anything beyond the truth of the claim itself.",
    projects:[],
    projectIdea:"Scripture Knowledge Proof — prove completion of a Scripture Journey lesson path without revealing which lessons or quiz scores. Or: church membership credential verification without revealing identity.",
    explanation:"Imagine proving you're over 21 without showing your ID. Proving you have enough money for a transaction without revealing your balance. Proving a computation was done correctly without showing the inputs. Zero-knowledge proofs make all of this possible. The prover convinces the verifier that a statement is true while revealing absolutely nothing else. There are two main families: SNARKs produce tiny proofs (a few hundred bytes) that verify in milliseconds but often require a trusted setup ceremony. STARKs produce larger proofs but need no trusted setup and are quantum-resistant. Both are enabling a revolution in blockchain scalability and privacy.",
    realWorld:"Zcash uses zk-SNARKs so you can make transactions on a public blockchain where the sender, receiver, and amount are all hidden — but the network can still verify no money was created from thin air. Ethereum Layer 2 rollups (zkSync, StarkNet, Polygon zkEVM) use ZK proofs to bundle thousands of transactions into a single proof, verified on-chain in milliseconds — this is how Ethereum plans to scale. Digital identity systems use ZK proofs for selective disclosure: prove your age without revealing your birthday, prove citizenship without revealing your passport number. ZK proofs are also used in verifiable computation — outsource computation to a cloud server and get a proof that the result is correct without re-running the computation.",
    whyItMatters:"ZKPs solve the fundamental tension between privacy and verification. Until now, verification required revelation — to prove something, you had to show the evidence. ZKPs break this coupling. The implications ripple through every system that currently requires you to over-share personal information to prove a claim. Finance, identity, healthcare, voting — any domain where \"trust but verify\" currently forces unwanted disclosure."
  },
  mpc:{
    title:"Secure Multi-Party Computation",
    oneLiner:"Joint computation, zero shared data. Multiple parties compute a result together — but nobody learns anything about anyone else's input.",
    projects:[],
    projectIdea:"Church Budget Consensus — elders privately submit budget priorities, system computes consensus allocation without revealing individual submissions. Or: multi-branch library acquisition planning without sharing circulation data.",
    explanation:"Picture three companies that want to know their combined average salary without any company revealing their individual salary data. Or two hospitals that want to train an AI model together without sharing patient records. MPC makes this possible: each party keeps their private data locally, they interact through a cryptographic protocol, and at the end everyone learns the agreed-upon output — and nothing else. Not a single bit of anyone else's input leaks. This isn't just encryption — the computation itself is distributed so that no single point ever holds the combined data. Different MPC protocols handle different trust models: some protect against honest-but-curious parties, others protect even against actively malicious participants trying to cheat.",
    realWorld:"The Boston Women's Workforce Council used MPC to compute gender pay gap statistics across multiple companies — no company revealed their salary data to each other or to the council, but the aggregate statistics were accurately computed. Estonian government uses Sharemind (MPC platform) for tax fraud detection across databases that legally cannot be combined. Sugar beet auctions in Denmark were conducted via MPC so bidders couldn't learn each other's bids. Private Set Intersection (a specialized MPC) is used by Apple and Google for contact tracing, password breach detection, and ad measurement — checking if two lists overlap without revealing the lists themselves. Cryptocurrency wallets use MPC-based threshold signing so no single device ever holds the complete private key.",
    whyItMatters:"MPC solves the \"data silo\" problem without creating privacy risk. Today, combining datasets for analysis means someone sees all the data — creating legal liability, privacy violations, and security risk. MPC lets organizations collaborate on data analysis without centralizing the data. As data regulation tightens globally (GDPR, CCPA, HIPAA), MPC becomes the only way to get the analytical benefits of data sharing without the legal and ethical costs."
  },
  ot_pir:{
    title:"Oblivious Transfer & Private Information Retrieval",
    oneLiner:"Invisible access. Retrieve exactly what you need from a database — and the database never learns what you looked at.",
    projects:[],
    projectIdea:"Private Scripture Lookup — query a Bible verse database without the server learning which verse was requested. Protects people searching for verses about grief, addiction, or abuse from revealing their situation.",
    explanation:"Oblivious Transfer (OT) is a two-party protocol where a sender holds multiple messages and a receiver picks one to receive — but the sender doesn't learn which one was chosen, and the receiver only gets the one they picked. It sounds simple but it's the fundamental building block of virtually all MPC protocols. Private Information Retrieval (PIR) scales this idea to databases: a user queries a database and gets back their result, but the database server has no idea which record was accessed. Current PIR schemes are based on lattice cryptography (making them quantum-resistant) or use multiple non-colluding servers for information-theoretic guarantees. The practical challenge is efficiency — truly private database access is expensive compared to just asking openly.",
    realWorld:"Apple's iCloud Private Relay uses PIR-like techniques so Apple's servers help route your traffic without knowing which websites you visit. Signal uses Private Contact Discovery — you can check which of your phone contacts are on Signal without Signal learning your contact list. Certificate Transparency systems are exploring PIR so browsers can check if a certificate has been revoked without telling the CA which sites they're visiting (which would leak browsing history). Password breach checking services (like Have I Been Pwned's k-anonymity API and 1Password's implementation) use PIR-adjacent techniques so you can check if your password was breached without sending the password. Chrome's SafeBrowsing is exploring PIR to check URLs against malware databases without Google learning which URLs you visit.",
    whyItMatters:"The metadata problem: even when data is encrypted, the access pattern reveals information. If a medical database can see you looked up \"oncology treatment protocols,\" the query itself leaks your health situation. OT and PIR protect the access pattern — not just the data, but the fact that you accessed it. As surveillance concerns grow and privacy regulations tighten, hiding what you access becomes as important as encrypting what you send."
  },
};
