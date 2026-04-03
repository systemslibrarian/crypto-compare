import { formatReviewDate } from "@/components/ui";
import type { TrustSnapshot } from "@/lib/trust";

type MethodologyPanelProps = {
  trustSnapshot: TrustSnapshot;
};

export default function MethodologyPanel({ trustSnapshot }: MethodologyPanelProps) {
  return (
    <section className="panel-inner" style={{ marginBottom: "14px" }}>
      <h2 className="panel-heading">Methodology &amp; Trust Model</h2>

      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "12px 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
          Reading Security Values
        </h3>
        <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
          <li><strong>Classical security (C):</strong> Approximate attack cost in bits against known public cryptanalysis. 128-bit = infeasible with classical compute. 256-bit = maximum conventional strength.</li>
          <li><strong>Post-quantum security (PQ):</strong> Expected security under quantum algorithms (Grover, Shor). 0 = fully broken by Shor&apos;s. Lattice/hash schemes retain estimated PQ security levels.</li>
          <li><strong>Best attack:</strong> Strongest published attack path. These are continuously updated as cryptanalysis evolves, not guarantees but current best knowledge.</li>
          <li><strong>Performance:</strong> Approximate throughput/latency values. Highly implementation- and platform-dependent; treat as relative ordering, not absolute benchmarks.</li>
        </ul>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
          Data Sourcing
        </h3>
        <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
          <li>Primary sources: NIST FIPS/SP publications, IETF RFCs, ISO standards, national cryptographic standards (KPQC, CRYPTREC, GB/T, GOST, DSTU).</li>
          <li>Analysis sources: Eurocrypt, CRYPTO, and ASIACRYPT proceedings; ePrint archive; peer-reviewed security proofs and cryptanalysis papers.</li>
          <li>Deployment sources: Official implementation documentation, adoption reports, real-world usage telemetry where public.</li>
          <li>Each algorithm entry cites its specific sources in the source citations panel.</li>
        </ul>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
          Recommendation Labels
        </h3>
        <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
          <li><strong>Recommended:</strong> The default choice for new systems. Well-analyzed, widely deployed, strong security margins.</li>
          <li><strong>Acceptable:</strong> Safe for use in constrained environments or where a specific property is needed. Not the default pick.</li>
          <li><strong>Legacy:</strong> Should only be used for backward compatibility with existing systems. Plan migration.</li>
          <li><strong>Research:</strong> Promising but not yet sufficiently analyzed or deployed for production. Watch and evaluate.</li>
          <li><strong>Avoid:</strong> Known weaknesses or obsolete. Do not use in new systems.</li>
        </ul>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
          Review Process
        </h3>
        <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
          <li>All entries undergo Zod schema validation at build time, ensuring type correctness, range bounds, and cross-field consistency.</li>
          <li>Provenance coverage is verified: every algorithm must have at least one cited source and a review date.</li>
          <li>Security estimates are checked for internal consistency, for example PQ-safe algorithms must have non-zero PQ security bits.</li>
          <li>The dataset undergoes periodic review. Current provenance window: <strong>{trustSnapshot.earliest ? `${formatReviewDate(trustSnapshot.earliest)} to ${formatReviewDate(trustSnapshot.latest)}` : "review dates pending"}</strong>.</li>
        </ul>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
          Reasonable Expert Disagreement
        </h3>
        <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
          <li>Post-quantum migration timing depends on your risk horizon, interoperability constraints, and regulatory context.</li>
          <li>Ed25519, ECDSA P-256, ML-DSA, and hash-based signatures each win under different operational and assurance goals.</li>
          <li>Transparent ZK systems and trusted-setup SNARKs make different tradeoffs in proof size, prover cost, and trust assumptions.</li>
        </ul>
      </div>

      <div>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#60a5fa", margin: "0 0 6px", fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" }}>
          Limitations
        </h3>
        <ul style={{ margin: 0, paddingLeft: "18px", color: "#c4d1e3", lineHeight: 1.8 }}>
          <li>This is a reference tool, not a certification. Security guidance should be validated against your specific threat model and compliance requirements.</li>
          <li>Implementation quality, side-channel resistance, and key management matter more than primitive selection alone.</li>
          <li>Cryptanalysis is an active field. Security estimates reflect current public knowledge and may change as new attacks are discovered.</li>
          <li>Performance data is approximate. Production decisions should rely on application-specific benchmarks.</li>
        </ul>
      </div>
    </section>
  );
}