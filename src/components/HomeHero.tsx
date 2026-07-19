import Link from "next/link";

type HomeHeroProps = {
  datasetSize: number;
  categoryCount: number;
  totalSources: number;
};

const USE_CASES: { label: string; href: string }[] = [
  { label: "Passwords & Auth", href: "/safe-defaults#password-storage" },
  { label: "File Encryption", href: "/safe-defaults#symmetric-encryption" },
  { label: "Messaging", href: "/safe-defaults#authenticated-messaging" },
  { label: "Web & API", href: "/safe-defaults#web-api-transport" },
  { label: "Signatures", href: "/safe-defaults#digital-signatures" },
  { label: "Post-Quantum", href: "/safe-defaults#key-exchange" },
];

/**
 * First viewport: what this is, how big it is, and where to go — while keeping
 * the catalog immediately visible below. An app screen, not a marketing page.
 */
export default function HomeHero({ datasetSize, categoryCount, totalSources }: HomeHeroProps) {
  return (
    <section className="homeHero" aria-label="Overview">
      <p className="homeHeroEyebrow">Cryptographic algorithm reference</p>
      <h2 className="homeHeroTitle">Choose the right cryptography, with confidence.</h2>
      <p className="homeHeroLede">
        Vetted recommendations with cited sources and safe defaults. Browse the catalog below, or{" "}
        <Link href="/advisor" className="homeHeroLink">
          answer a few questions in the advisor
        </Link>{" "}
        for a tailored pick.
      </p>

      <div className="heroStats" aria-label="Catalog scale">
        <span className="heroStat">
          <span className="heroStatValue">{datasetSize}</span>
          <span className="heroStatLabel">algorithms</span>
        </span>
        <span className="heroStat">
          <span className="heroStatValue">{categoryCount}</span>
          <span className="heroStatLabel">categories</span>
        </span>
        <span className="heroStat">
          <span className="heroStatValue">{totalSources}</span>
          <span className="heroStatLabel">sources cited</span>
        </span>
      </div>

      <nav className="homeHeroTasks" aria-label="Jump to a use case">
        <span className="homeHeroTasksLabel">Safe defaults for</span>
        {USE_CASES.map((task) => (
          <Link key={task.label} href={task.href} className="homeHeroTask">
            {task.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
