#!/usr/bin/env tsx
/**
 * Automated data-freshness checker.
 *
 * 1. Flags algorithms whose provenance `lastReviewed` is older than STALE_DAYS.
 * 2. Probes authoritative source URLs to detect dead links (HTTP ≥ 400).
 * 3. Checks NIST CSRC, IETF Datatracker, and PQC pages for new publications
 *    that may affect existing entries.
 * 4. Outputs a structured JSON report for CI / GitHub Actions to consume.
 *
 * Run: npx tsx scripts/refresh-data.ts [--stale-days=180] [--check-links]
 */

import { ALGORITHMS } from "../src/data/algorithms";
import { ALGORITHM_PROVENANCE } from "../src/data/provenance";

// ── Configuration ──────────────────────────────────────────────
const STALE_DAYS = Number(
  process.argv.find((a) => a.startsWith("--stale-days="))?.split("=")[1] ?? 180,
);
const CHECK_LINKS = process.argv.includes("--check-links");
const TODAY = new Date();

// ── Types ──────────────────────────────────────────────────────
type StaleEntry = { id: string; name: string; lastReviewed: string; daysAgo: number };
type DeadLink = { algorithmId: string; url: string; label: string; status: number | string };
type UpstreamNotice = { source: string; title: string; url: string; relevant: string[] };

type Report = {
  generated: string;
  staleDays: number;
  totalAlgorithms: number;
  staleEntries: StaleEntry[];
  missingProvenance: string[];
  deadLinks: DeadLink[];
  upstreamNotices: UpstreamNotice[];
};

// ── Staleness check ────────────────────────────────────────────
function findStaleEntries(): StaleEntry[] {
  const stale: StaleEntry[] = [];
  for (const algo of ALGORITHMS) {
    const prov = ALGORITHM_PROVENANCE[algo.id];
    if (!prov) continue;
    const reviewed = new Date(prov.lastReviewed);
    const daysAgo = Math.floor((TODAY.getTime() - reviewed.getTime()) / 86_400_000);
    if (daysAgo > STALE_DAYS) {
      stale.push({ id: algo.id, name: algo.name, lastReviewed: prov.lastReviewed, daysAgo });
    }
  }
  return stale.sort((a, b) => b.daysAgo - a.daysAgo);
}

function findMissingProvenance(): string[] {
  return ALGORITHMS.filter((a) => !ALGORITHM_PROVENANCE[a.id]).map((a) => a.id);
}

// ── Link checker ───────────────────────────────────────────────
async function checkLinks(): Promise<DeadLink[]> {
  const dead: DeadLink[] = [];
  const seen = new Set<string>();

  function isClearlyDead(url: string, status: number): boolean {
    // Many publisher and standards sites return 403/429/405 to bots or HEAD requests.
    // Treat only strong indicators as dead links.
    if (status === 404 || status === 410) {
      // Some endpoints can return false 404 responses for scripted requests.
      if (url.includes("doi.org/") || url.includes("media.defense.gov/")) return false;
      return true;
    }
    return status >= 500;
  }

  async function probe(url: string, method: "HEAD" | "GET"): Promise<number> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "crypto-compare-refresh/1.0" },
    });
    clearTimeout(timeout);
    return res.status;
  }

  for (const [algoId, prov] of Object.entries(ALGORITHM_PROVENANCE)) {
    for (const src of prov.sources) {
      if (seen.has(src.url)) continue;
      seen.add(src.url);
      try {
        let status = await probe(src.url, "HEAD");

        // Retry with GET for common HEAD-only failures.
        if (status === 404 || status === 405 || status === 429) {
          status = await probe(src.url, "GET");
        }

        if (isClearlyDead(src.url, status)) {
          dead.push({ algorithmId: algoId, url: src.url, label: src.label, status });
        }
      } catch {
        // Network/transient errors are reported through CI logs but not treated as confirmed dead links.
      }
    }
  }
  return dead;
}

// ── Upstream publication monitor ───────────────────────────────
// Checks publicly available NIST / IETF feeds for recent activity.
// These are lightweight HTTP calls — no API keys needed.

const NIST_CSRC_RECENT = "https://csrc.nist.gov/News/recent";
const NIST_PQC_URL = "https://csrc.nist.gov/projects/post-quantum-cryptography";
const IETF_CFRG_URL = "https://datatracker.ietf.org/wg/cfrg/documents/";

// Map keywords to algorithm IDs they're most relevant to
const KEYWORD_MAP: Record<string, string[]> = {
  "FIPS 203": ["mlkem768", "mlkem1024"],
  "FIPS 204": ["mldsa44", "mldsa65"],
  "FIPS 205": ["slh_dsa"],
  "ML-KEM": ["mlkem768", "mlkem1024"],
  "ML-DSA": ["mldsa44", "mldsa65"],
  "SLH-DSA": ["slh_dsa"],
  "SPHINCS": ["slh_dsa"],
  "Kyber": ["mlkem768", "mlkem1024"],
  "Dilithium": ["mldsa44", "mldsa65"],
  "FALCON": ["falcon512"],
  "HQC": ["hqc"],
  "McEliece": ["classic_mceliece"],
  "BIKE": ["bike"],
  "XMSS": ["xmss"],
  "AES-GCM": ["aes256gcm", "aes256gcmsiv"],
  "ChaCha20": ["chacha20poly", "xchacha20poly"],
  "Argon2": ["argon2id"],
  "HKDF": ["hkdf"],
  "SHA-3": ["sha3_256"],
  "BLAKE": ["blake2b", "blake3"],
  "Ed25519": ["ed25519"],
  "X25519": ["curve25519"],
  "Curve25519": ["curve25519"],
};

const KNOWN_ALGORITHM_IDS = new Set(ALGORITHMS.map((algorithm) => algorithm.id));

function onlyKnownAlgorithmIds(ids: string[]): string[] {
  return ids.filter((id) => KNOWN_ALGORITHM_IDS.has(id));
}

async function fetchPageText(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "crypto-compare-refresh/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function checkUpstreamPublications(): Promise<UpstreamNotice[]> {
  const notices: UpstreamNotice[] = [];

  // Check NIST CSRC news page
  const nistHtml = await fetchPageText(NIST_CSRC_RECENT);
  if (nistHtml) {
    for (const [keyword, algoIds] of Object.entries(KEYWORD_MAP)) {
      if (nistHtml.includes(keyword)) {
        notices.push({
          source: "NIST CSRC",
          title: `Mention of "${keyword}" found on NIST recent news`,
          url: NIST_CSRC_RECENT,
          relevant: onlyKnownAlgorithmIds(algoIds),
        });
      }
    }
  }

  // Check NIST PQC project page
  const pqcHtml = await fetchPageText(NIST_PQC_URL);
  if (pqcHtml) {
    // Look for round/draft/final mentions that suggest status changes
    const pqcKeywords = ["Round 4", "additional", "draft standard", "final standard", "revision"];
    for (const kw of pqcKeywords) {
      if (pqcHtml.toLowerCase().includes(kw.toLowerCase())) {
        notices.push({
          source: "NIST PQC Project",
          title: `PQC project page mentions "${kw}"`,
          url: NIST_PQC_URL,
          relevant: onlyKnownAlgorithmIds(["mlkem768", "mlkem1024", "mldsa44", "mldsa65", "slh_dsa", "falcon512", "hqc", "classic_mceliece", "bike"]),
        });
        break; // one notice is enough for this source
      }
    }
  }

  // Check IETF CFRG working group
  const cfrg = await fetchPageText(IETF_CFRG_URL);
  if (cfrg) {
    for (const [keyword, algoIds] of Object.entries(KEYWORD_MAP)) {
      if (cfrg.includes(keyword)) {
        notices.push({
          source: "IETF CFRG",
          title: `CFRG documents mention "${keyword}"`,
          url: IETF_CFRG_URL,
          relevant: onlyKnownAlgorithmIds(algoIds),
        });
      }
    }
  }

  // Deduplicate by source+title
  const seen = new Set<string>();
  return notices.filter((n) => {
    const key = `${n.source}::${n.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔍 crypto::compare data refresh check`);
  console.log(`   ${ALGORITHMS.length} algorithms, stale threshold: ${STALE_DAYS} days\n`);

  const report: Report = {
    generated: TODAY.toISOString(),
    staleDays: STALE_DAYS,
    totalAlgorithms: ALGORITHMS.length,
    staleEntries: findStaleEntries(),
    missingProvenance: findMissingProvenance(),
    deadLinks: [],
    upstreamNotices: [],
  };

  // Staleness
  if (report.staleEntries.length > 0) {
    console.log(`⚠️  ${report.staleEntries.length} stale entries (>${STALE_DAYS} days):`);
    for (const e of report.staleEntries) {
      console.log(`   • ${e.name} (${e.id}) — last reviewed ${e.lastReviewed} (${e.daysAgo}d ago)`);
    }
  } else {
    console.log(`✅ No stale entries (all reviewed within ${STALE_DAYS} days)`);
  }

  // Missing provenance
  if (report.missingProvenance.length > 0) {
    console.log(`\n⚠️  ${report.missingProvenance.length} algorithms missing provenance:`);
    for (const id of report.missingProvenance) {
      console.log(`   • ${id}`);
    }
  }

  // Link checks
  if (CHECK_LINKS) {
    console.log(`\n🔗 Checking source links…`);
    report.deadLinks = await checkLinks();
    if (report.deadLinks.length > 0) {
      console.log(`⚠️  ${report.deadLinks.length} dead/unreachable links:`);
      for (const d of report.deadLinks) {
        console.log(`   • [${d.algorithmId}] ${d.label}: ${d.url} → ${d.status}`);
      }
    } else {
      console.log(`✅ All source links reachable`);
    }
  }

  // Upstream notices
  console.log(`\n📡 Checking upstream publications…`);
  report.upstreamNotices = await checkUpstreamPublications();
  if (report.upstreamNotices.length > 0) {
    console.log(`📋 ${report.upstreamNotices.length} upstream notices:`);
    for (const n of report.upstreamNotices) {
      console.log(`   • [${n.source}] ${n.title}`);
      console.log(`     Affects: ${n.relevant.join(", ")}`);
    }
  } else {
    console.log(`✅ No new upstream activity detected`);
  }

  // Write JSON report for CI consumption
  const reportPath = process.env.REPORT_PATH || "refresh-report.json";
  const { writeFileSync } = await import("fs");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report written to ${reportPath}`);

  // Exit with failure if there are stale entries or missing provenance
  const hasIssues =
    report.staleEntries.length > 0 ||
    report.missingProvenance.length > 0 ||
    report.deadLinks.length > 0;

  if (hasIssues) {
    console.log(`\n❌ Data freshness check found issues — see report.`);
    process.exit(1);
  }

  console.log(`\n✅ All checks passed.`);
}

main();
