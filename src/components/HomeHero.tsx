import Link from "next/link";
import IntentCards from "@/components/IntentCards";

/**
 * Single guided entry point for the homepage. Replaces the previous stack of
 * competing calls-to-action (advisor banner + quick-start bar + intent grid)
 * with one clear headline and one primary path: pick what you're protecting.
 * The decision advisor remains the secondary "not sure?" route.
 */
export default function HomeHero() {
  return (
    <section className="homeHero" aria-label="Get started">
      <p className="homeHeroEyebrow">Cryptographic algorithm reference</p>
      <h2 className="homeHeroTitle">Choose the right cryptography, with confidence.</h2>
      <p className="homeHeroLede">
        Vetted algorithm recommendations across 17 categories, each backed by cited sources.
        Start from what you&apos;re protecting below, or{" "}
        <Link href="/advisor" className="homeHeroLink">
          answer a few questions in the advisor
        </Link>{" "}
        for a tailored pick.
      </p>

      <IntentCards />
    </section>
  );
}
