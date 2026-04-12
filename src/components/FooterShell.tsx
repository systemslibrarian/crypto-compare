import { formatReviewDate } from "@/components/ui";
import type { TrustSnapshot } from "@/lib/trust";

type FooterShellProps = {
  trustSnapshot: TrustSnapshot;
};

export default function FooterShell({ trustSnapshot }: FooterShellProps) {
  return (
    <>
      <div className="footerGradientBar" aria-hidden="true" />
      <footer className="site-footer">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "12px",
            fontSize: "12px",
            color: "var(--color-text-sublabel)",
          }}
          aria-label="Keyboard shortcuts"
        >
          <span><kbd className="kbd">/</kbd> Search</span>
          <span><kbd className="kbd">← →</kbd> Switch Category</span>
          <span><kbd className="kbd">?</kbd> Methodology</span>
          <span><kbd className="kbd">Esc</kbd> Close</span>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <span className="text-accent" style={{ fontWeight: 700 }}>Latest dataset review:</span>{" "}
          <time dateTime={trustSnapshot.latest}>{formatReviewDate(trustSnapshot.latest)}</time>
          {trustSnapshot.earliest && trustSnapshot.latest && trustSnapshot.earliest !== trustSnapshot.latest ? (
            <span style={{ color: "var(--color-text-muted)" }}> · window starts {formatReviewDate(trustSnapshot.earliest)}</span>
          ) : null}
        </div>
        Sources: NIST FIPS, IETF RFCs, KPQC, CRYPTREC, GB/T, GOST, DSTU, ISO, Eurocrypt/CRYPTO proceedings. Security estimates reflect known attacks and public literature, and should be treated as continuously updated guidance, not certification.
        <div style={{ marginTop: "10px" }}>
          <span className="text-accent" style={{ fontWeight: 700 }}>Related:</span>{" "}
          <a href="https://github.com/systemslibrarian/crypto-compare" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-accent-bright)" }}>crypto-compare</a>{" · "}
          <a href="https://github.com/systemslibrarian/crypto-lab-blind-oracle" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-accent-bright)" }}>blind-oracle</a>
        </div>
      </footer>
    </>
  );
}