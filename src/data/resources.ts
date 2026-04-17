export type ResourceCategory =
  | "primary"
  | "community"
  | "newsletter"
  | "conference"
  | "tool";

export type Resource = {
  title: string;
  url: string;
  description: string;
  category: ResourceCategory;
  /** Short tag shown in the UI */
  tag?: string;
};

export const RESOURCE_CATEGORIES: { id: ResourceCategory; label: string; icon: string }[] = [
  { id: "primary", label: "Primary Sources", icon: "📄" },
  { id: "community", label: "Community", icon: "💬" },
  { id: "newsletter", label: "Newsletters & Blogs", icon: "📬" },
  { id: "conference", label: "Conferences & Talks", icon: "🎤" },
  { id: "tool", label: "Tools & Playgrounds", icon: "🛠" },
];

export const RESOURCES: Resource[] = [
  // ─── Primary Sources ─────────────────────────────────────────
  {
    title: "IACR ePrint Archive",
    url: "https://eprint.iacr.org/",
    description:
      "Every serious cryptography paper lands here before journals. The daily digest is the closest thing to a cryptography newspaper. If an attack matters, it appears here first.",
    category: "primary",
    tag: "Papers",
  },
  {
    title: "NIST Computer Security Resource Center",
    url: "https://csrc.nist.gov/",
    description:
      "The authority on US federal standards — FIPS publications, PQC updates, SP 800-series guidance. Where FIPS 203/204/205 (ML-KEM, ML-DSA, SLH-DSA) are published and maintained.",
    category: "primary",
    tag: "Standards",
  },
  {
    title: "IETF Datatracker",
    url: "https://datatracker.ietf.org/",
    description:
      "Protocol-level cryptography work: TLS, QUIC, MLS, Messaging Layer Security, RFC drafts. The CFRG working group is where algorithm choices for internet protocols are debated.",
    category: "primary",
    tag: "Protocols",
  },
  {
    title: "IETF CFRG Working Group",
    url: "https://datatracker.ietf.org/wg/cfrg/documents/",
    description:
      "Crypto Forum Research Group — the specific IETF group that evaluates cryptographic algorithms for protocol adoption. Tracks curve selections, AEAD recommendations, and PQ transitions.",
    category: "primary",
    tag: "CFRG",
  },
  {
    title: "NIST Post-Quantum Cryptography Project",
    url: "https://csrc.nist.gov/projects/post-quantum-cryptography",
    description:
      "Tracks the PQC standardization process — selected algorithms, additional rounds, transition guidance. The single most important page for PQ migration planning.",
    category: "primary",
    tag: "PQC",
  },
  {
    title: "ENISA Cryptographic Algorithms Recommendations",
    url: "https://www.enisa.europa.eu/topics/cryptography",
    description:
      "European Union Agency for Cybersecurity recommendations. Useful for EU compliance and cross-referencing with NIST guidance.",
    category: "primary",
    tag: "EU",
  },
  {
    title: "BSI Technical Guidelines (Germany)",
    url: "https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Standards-und-Zulassung/Technische-Richtlinien/technische-richtlinien_node.html",
    description:
      "German Federal Office for Information Security. TR-02102 series covers recommended algorithms and key lengths — often more conservative than NIST.",
    category: "primary",
    tag: "BSI",
  },
  {
    title: "CRYPTREC (Japan)",
    url: "https://www.cryptrec.go.jp/en/method.html",
    description:
      "Japanese government cryptographic evaluation. Maintains recommended, candidate, and monitored cipher lists. The authority behind Camellia and Japanese deployments.",
    category: "primary",
    tag: "Japan",
  },

  // ─── Community ───────────────────────────────────────────────
  {
    title: "Cryptography Stack Exchange",
    url: "https://crypto.stackexchange.com/",
    description:
      "High signal-to-noise Q&A. Experts self-correct each other. Best for specific technical questions — \"Is X secure for Y?\" gets rigorous answers with citations.",
    category: "community",
    tag: "Q&A",
  },
  {
    title: "r/crypto (Reddit)",
    url: "https://www.reddit.com/r/crypto/",
    description:
      "Lower signal but catches mainstream news fast. Good for early discussion of new papers and standards developments. Sort by top/week for best results.",
    category: "community",
    tag: "Reddit",
  },
  {
    title: "@RealWorldCrypto on Twitter/X",
    url: "https://twitter.com/RealWorldCrypto",
    description:
      "Practitioners, not academics. Follows the intersection of cryptography and deployed systems. Good for awareness of what's actually being implemented.",
    category: "community",
    tag: "Twitter",
  },
  {
    title: "Cryptography & Security on Hacker News",
    url: "https://hn.algolia.com/?q=cryptography&type=story",
    description:
      "Aggregated cryptography discussion on HN. Useful for catching new paper analysis, library announcements, and vulnerability disclosures as they happen.",
    category: "community",
    tag: "HN",
  },

  // ─── Newsletters & Blogs ────────────────────────────────────
  {
    title: "Cryptography Dispatches — Filippo Valsorda",
    url: "https://words.filippo.io/dispatches/",
    description:
      "Short, practitioner-focused, excellent. Valsorda maintains Go's crypto libraries and writes about real-world implementation decisions. The best crypto newsletter for engineers.",
    category: "newsletter",
    tag: "Essential",
  },
  {
    title: "Schneier on Security",
    url: "https://www.schneier.com/blog/",
    description:
      "Bruce Schneier — opinionated and accessible. Covers cryptography, security policy, and privacy. Long-running, widely trusted, good context for why algorithms get deprecated.",
    category: "newsletter",
    tag: "Essential",
  },
  {
    title: "This Week in Security (tl;dr sec)",
    url: "https://tldrsec.com/",
    description:
      "Broad security newsletter with strong crypto coverage. Curated weekly links — catches papers, CVEs, and tooling updates you'd otherwise miss.",
    category: "newsletter",
    tag: "Weekly",
  },
  {
    title: "A Few Thoughts on Cryptographic Engineering — Matthew Green",
    url: "https://blog.cryptographyengineering.com/",
    description:
      "Johns Hopkins professor. Deep dives on protocol failures, backdoor debates, and why things break. His Let's Encrypt and iMessage analyses are canonical.",
    category: "newsletter",
    tag: "Deep dives",
  },
  {
    title: "Latacora's Cryptographic Right Answers",
    url: "https://www.latacora.com/blog/2018/04/03/cryptographic-right-answers/",
    description:
      "Opinionated \"just tell me what to use\" guide. Updated periodically. Influential in shaping the safe-defaults approach used by this site.",
    category: "newsletter",
    tag: "Guide",
  },
  {
    title: "Trail of Bits Blog",
    url: "https://blog.trailofbits.com/",
    description:
      "Security research firm with frequent crypto posts. Known for deep audits of cryptographic libraries and protocols. Their \"Building Secure Smart Contracts\" series covers applied ZKP.",
    category: "newsletter",
    tag: "Research",
  },

  // ─── Conferences & Talks ────────────────────────────────────
  {
    title: "Real World Crypto (RWC)",
    url: "https://rwc.iacr.org/",
    description:
      "The conference where deployed crypto gets scrutinized. Talks posted publicly. Where TLS 1.3, Signal Protocol, and PQ transitions get practical review. Highly recommended.",
    category: "conference",
    tag: "Essential",
  },
  {
    title: "IACR Conferences (CRYPTO, EUROCRYPT, ASIACRYPT)",
    url: "https://iacr.org/conferences/",
    description:
      "The flagship academic conferences. Papers here define the field. Proceedings are available via ePrint. Focus on theoretical foundations and new constructions.",
    category: "conference",
    tag: "Academic",
  },
  {
    title: "USENIX Security Symposium",
    url: "https://www.usenix.org/conferences",
    description:
      "Systems security with strong applied crypto content. Where practical attacks (ROBOT, DROWN, Raccoon) get presented and real-world impact is measured.",
    category: "conference",
    tag: "Applied",
  },
  {
    title: "CCC (Chaos Communication Congress)",
    url: "https://events.ccc.de/",
    description:
      "Europe's largest hacker conference. Crypto talks lean practical and political. Good for understanding how cryptography intersects with privacy and civil liberties.",
    category: "conference",
    tag: "Community",
  },

  // ─── Tools & Playgrounds ────────────────────────────────────
  {
    title: "CyberChef",
    url: "https://gchq.github.io/CyberChef/",
    description:
      "\"The Cyber Swiss Army Knife\" — browser-based tool for encoding, encryption, hashing, and analysis. Made by GCHQ. Excellent for quick experiments and understanding algorithm I/O.",
    category: "tool",
    tag: "Interactive",
  },
  {
    title: "KeyTool.dev",
    url: "https://keytool.dev/",
    description:
      "Visualize and generate cryptographic key material in the browser. Supports JWK, PEM, and various key types. Useful for understanding key formats.",
    category: "tool",
    tag: "Keys",
  },
  {
    title: "SafeCurves",
    url: "https://safecurves.cr.yp.to/",
    description:
      "Daniel J. Bernstein's evaluation criteria for elliptic curves. Compares curves on rigidity, twist security, and implementation safety. The reference for why Curve25519 is preferred.",
    category: "tool",
    tag: "Curves",
  },
  {
    title: "PQC Benchmarks (SUPERCOP)",
    url: "https://bench.cr.yp.to/",
    description:
      "Comprehensive cryptographic benchmarking system. Performance data for hundreds of implementations across different platforms. Where \"how fast is it?\" gets answered with data.",
    category: "tool",
    tag: "Benchmarks",
  },
];
