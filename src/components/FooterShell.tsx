import Link from "next/link";
import { formatReviewDate } from "@/components/ui";
import type { TrustSnapshot } from "@/lib/trust";
import { CHANGELOG_URL, DATASET_VERSION } from "@/lib/datasetVersion";

type FooterShellProps = {
  trustSnapshot: TrustSnapshot;
};

export default function FooterShell({ trustSnapshot }: FooterShellProps) {
  return (
    <>
      <footer className="site-footer">
        <div className="footerMeta">
          <span>Reviewed <time dateTime={trustSnapshot.latest}>{formatReviewDate(trustSnapshot.latest)}</time></span>
          <span aria-hidden="true">·</span>
          <a href={CHANGELOG_URL} target="_blank" rel="noopener noreferrer">dataset v{DATASET_VERSION}</a>
        </div>
        <nav className="footerLinks" aria-label="Site links">
          <Link href="/about">About &amp; methodology</Link>
          <Link href="/labs">Interactive labs</Link>
          <a href="https://github.com/systemslibrarian/crypto-compare" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </footer>
    </>
  );
}