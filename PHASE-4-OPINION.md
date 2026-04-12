# Phase 4 — Honest Opinion

---

## What This Collection Does Well

**It takes the "which algorithm should I use?" question seriously.** Most cryptography references
either give you a textbook (too theoretical) or a blog post (too superficial). This project
occupies the narrow, valuable space in between: principled guidance for a working engineer
who needs to make a defensible choice and move on. That space is underserved and the project
fills it with unusual discipline.

**The recommendation model is the best feature.** Five levels (recommended → avoid), each with
a rationale, a "when this changes" condition, a "why not this?" section, and explicit assumptions.
This is how engineering guidance should work. It doesn't pretend algorithm choice is binary or
permanent. The `recommendationChangesWhen` field alone is worth the entire project — it teaches
the reader that recommendations have shelf lives and trigger conditions, which is a lesson most
engineers never learn about cryptography.

**The international standards coverage is genuinely rare.** SM4, SM3, SM2 (China), ARIA (Korea),
Camellia (Japan), Kuznyechik and Streebog (Russia), Kupyna (Ukraine), Brainpool (Germany) — with
honest notes about S-box transparency concerns for Russian standards and limited international
cryptanalysis for Chinese standards. Most Western-authored references ignore these entirely.
Including them acknowledges that cryptographic standards are geopolitically fragmented and that
compliance contexts differ by jurisdiction.

**The post-quantum coverage is current and actionable.** ML-KEM, ML-DSA, SLH-DSA, FALCON,
HQC, Classic McEliece, FrodoKEM, BIKE — plus KPQC candidates (SMAUG-T, HAETAE). The hybrid
patterns section shows real deployment paths (Chrome 124+, Firefox 132+, Cloudflare). The
"harvest now, decrypt later" threat is explained in the Use Case Guide. This isn't hand-waving
about quantum computers; it's concrete migration guidance.

**The provenance system is unusually honest.** Per-algorithm review dates, cited sources with
kind labels (standard, analysis, deployment, benchmark), Zod-validated data integrity. The
Trust Snapshot panel shows the review window age and warns when confidence should drop. Most
reference projects present their data as timeless truth; this one builds in its own expiration
signal.

**The demo project portfolio is extraordinary.** 56+ linked labs covering everything from
padding oracle attacks to FROST threshold signatures to FHE with TFHE-rs. Each category
links to working code that demonstrates the concept in practice. This transforms the project
from a reference card into a curriculum.

---

## What a Student Would Still NOT Understand

After reading everything in this repository — every algorithm entry, every component, every
guide, every architecture — a diligent student would still not understand:

1. **How the internet actually establishes trust.** They would know what signatures are, what
   certificates are for (vaguely), and what TLS does (abstractly). But they wouldn't understand
   the certificate chain from leaf to intermediate to root CA, why browsers ship a trust store,
   what Certificate Transparency is, or what happens when a CA is compromised (DigiNotar). The
   Reference Architecture says "certificate validation" as a box in a flow diagram but never
   opens that box. This is the single biggest gap: the *system* that makes all these primitives
   useful on the internet is unexplained.

2. **Why Diffie-Hellman was revolutionary.** They'd see X25519 as a curve entry and ML-KEM as
   a KEM entry but wouldn't experience the conceptual breakthrough of "two strangers agreeing
   on a secret over a public channel." The KEM category explanation gestures at this ("easy to
   solve if you know the secret but impossibly hard otherwise") but never walks through the
   protocol. The moment of "wait, the attacker saw everything and still doesn't know the
   key?" is one of the most powerful teaching moments in all of cryptography, and it's absent.

3. **What "provably secure" actually means.** Every entry uses the vocabulary of security
   reductions ("reduces to Module-LWE," "proven under PRP assumption," "random oracle model")
   but the reader is never taught what a reduction is, what the random oracle model assumes,
   or why tight reductions matter more than loose ones. They would parrot the terminology
   without understanding what it guarantees or where it breaks down.

4. **What happens when you compose secure primitives incorrectly.** The Padding Oracle lab
   shows an attack. SafeUsage warns about "bad protocol composition." But the general principle
   — that two individually secure components can produce an insecure system depending on their
   composition order — is never stated. A student could read everything here and still build
   MAC-then-Encrypt because nothing taught them why the order matters.

5. **ECDSA.** The most widely deployed signature scheme on the internet today has no entry.
   Ed25519 is explained beautifully. But a student who leaves without understanding ECDSA's
   nonce vulnerability, why Sony's PS3 key was extracted, why RFC 6979 was necessary, and
   why EdDSA's deterministic design is the answer — that student has a dangerous blind spot
   about the signature scheme they'll encounter most often in practice.

---

## The One Addition With the Highest Educational Impact

**Add a "How the Internet Trusts" section — PKI, certificate chains, and the CA system.**

Not as an algorithm entry. As a conceptual section on the level of the existing Reference
Architectures or Use Case Guide. It would:

- Explain what a digital certificate is (public key + identity + CA signature)
- Walk through a certificate chain: leaf → intermediate → root
- Show why browsers ship a trust store and what happens when a root CA is compromised
- Connect digital signatures (already well-covered) to the system that makes them meaningful
- Explain Certificate Transparency as a real-world integrity mechanism
- Connect to the post-quantum transition: what happens when CA signatures need to be PQ-safe?

**Why this, above all the other gaps?**

Because every other primitive in this collection — encryption, KEM, signatures, AEAD, KDF —
exists *inside* a protocol, and protocols exist *inside* a trust infrastructure. The collection
does an excellent job going from "what is AES?" to "how does TLS use AES?" but stops short of
"how does your browser decide to trust the server presenting that TLS connection?" That last
step is where all the cryptographic primitives become a system that actually protects people.

A student who finishes this collection can choose the right cipher, the right signature
scheme, and the right KEM. But they cannot yet explain why clicking the padlock icon in their
browser means anything. That is the gap worth closing.

---

> *So whether you eat or drink or whatever you do,*
> *do it all for the glory of God.* — 1 Corinthians 10:31
