import Link from "next/link";

/**
 * Minimal guided entry for the homepage: a short headline, one sentence, and a
 * compact row of use-case links. No card grid — the first screen stays light,
 * and the full algorithm grid only loads once the visitor picks a category.
 */
const USE_CASES: { icon: string; label: string; href: string }[] = [
  { icon: "🔒", label: "Passwords & Auth", href: "/safe-defaults#password-storage" },
  { icon: "📁", label: "File Encryption", href: "/safe-defaults#symmetric-encryption" },
  { icon: "💬", label: "Messaging", href: "/safe-defaults#authenticated-messaging" },
  { icon: "🌐", label: "Web & API", href: "/safe-defaults#web-api-transport" },
  { icon: "✍️", label: "Signatures", href: "/safe-defaults#digital-signatures" },
  { icon: "🛡️", label: "Post-Quantum", href: "/safe-defaults#key-exchange" },
];

export default function HomeHero() {
  return (
    <section className="homeHero" aria-label="Get started">
      <p className="homeHeroEyebrow">Cryptographic algorithm reference</p>
      <h2 className="homeHeroTitle">Choose the right cryptography, with confidence.</h2>
      <p className="homeHeroLede">
        Vetted recommendations across 17 categories, each backed by cited sources. Pick a category
        below to compare, or{" "}
        <Link href="/advisor" className="homeHeroLink">
          answer a few questions in the advisor
        </Link>{" "}
        for a tailored pick.
      </p>

      <nav className="homeHeroTasks" aria-label="Jump to a use case">
        <span className="homeHeroTasksLabel">Common tasks:</span>
        {USE_CASES.map((task) => (
          <Link key={task.label} href={task.href} className="homeHeroTask">
            <span aria-hidden="true">{task.icon}</span> {task.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
