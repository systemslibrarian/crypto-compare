import CollapsibleSection from "@/components/CollapsibleSection";
import CryptoResources from "@/components/CryptoResources";
import DesignPhilosophy from "@/components/DesignPhilosophy";
import HybridPatternsSection from "@/components/HybridPatternsSection";
import RecommendedLibraries from "@/components/RecommendedLibraries";
import ReferenceArchitectures from "@/components/ReferenceArchitectures";
import SafeUsage from "@/components/SafeUsage";
import UseCaseGuide from "@/components/UseCaseGuide";

type KnowledgeSectionsProps = {
  showHybrid: boolean;
  showGuide: boolean;
  showSafeUsage: boolean;
  showArchitectures: boolean;
  showLibraries: boolean;
  showPhilosophy: boolean;
  showResources: boolean;
  onToggleHybrid: () => void;
  onToggleGuide: () => void;
  onToggleSafeUsage: () => void;
  onToggleArchitectures: () => void;
  onToggleLibraries: () => void;
  onTogglePhilosophy: () => void;
  onToggleResources: () => void;
};

export default function KnowledgeSections({
  showHybrid,
  showGuide,
  showSafeUsage,
  showArchitectures,
  showLibraries,
  showPhilosophy,
  showResources,
  onToggleHybrid,
  onToggleGuide,
  onToggleSafeUsage,
  onToggleArchitectures,
  onToggleLibraries,
  onTogglePhilosophy,
  onToggleResources,
}: KnowledgeSectionsProps) {
  return (
    <>
      <HybridPatternsSection isOpen={showHybrid} onToggle={onToggleHybrid} />

      <CollapsibleSection
        isOpen={showGuide}
        onToggle={onToggleGuide}
        buttonLabel="If You&apos;re Building X → Use This"
        sectionLabel="Use case guidance"
        title="If You&apos;re Building X → Use This"
        description="Practical, real-world algorithm recommendations for common system architectures. Click any algorithm tag to view its full entry."
      >
        <UseCaseGuide />
      </CollapsibleSection>

      <CollapsibleSection
        isOpen={showSafeUsage}
        onToggle={onToggleSafeUsage}
        buttonLabel="Common Pitfalls &amp; Safe Usage"
        sectionLabel="Safe usage guidelines"
        title="Common Pitfalls &amp; Safe Usage Guidelines"
        description="Choosing the right algorithm is 10% of the battle. These guidelines prevent the mistakes that cause real-world crypto failures."
      >
        <SafeUsage />
      </CollapsibleSection>

      <CollapsibleSection
        isOpen={showArchitectures}
        onToggle={onToggleArchitectures}
        buttonLabel="Reference Architectures"
        sectionLabel="Reference architectures"
        title="Reference Architectures"
        description="How cryptographic primitives combine into real systems. Each architecture shows the data flow, stack, and security properties."
      >
        <ReferenceArchitectures />
      </CollapsibleSection>

      <CollapsibleSection
        isOpen={showLibraries}
        onToggle={onToggleLibraries}
        buttonLabel="Recommended Libraries (Real-World Implementation Guidance)"
        sectionLabel="Recommended libraries"
        title="Recommended Libraries (Real-World Implementation Guidance)"
      >
        <RecommendedLibraries />
      </CollapsibleSection>

      <CollapsibleSection
        isOpen={showPhilosophy}
        onToggle={onTogglePhilosophy}
        buttonLabel="Design Philosophy &amp; Trust Model"
        sectionLabel="Design philosophy"
        title="Design Philosophy &amp; Trust Model"
        description="Why this tool exists, how recommendations are derived, and what it intentionally does not do."
      >
        <DesignPhilosophy />
      </CollapsibleSection>

      <CollapsibleSection
        isOpen={showResources}
        onToggle={onToggleResources}
        buttonLabel="Cryptography Resources &amp; Further Reading"
        sectionLabel="Cryptography resources"
        title="Cryptography Resources &amp; Further Reading"
        description="Primary sources, communities, newsletters, and tools for staying current with cryptographic developments. Go straight to the source."
      >
        <CryptoResources />
      </CollapsibleSection>
    </>
  );
}