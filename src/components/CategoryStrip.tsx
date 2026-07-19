import type { AlgorithmCategory, CategoryDefinition } from "@/types/crypto";

type CategoryStripProps = {
  categories: CategoryDefinition[];
  counts: Record<string, number>;
  selectedCategory: AlgorithmCategory;
  globalSearch: boolean;
  datasetSize: number;
  onSelectCategory: (category: AlgorithmCategory) => void;
  onSelectAll: () => void;
};

/**
 * Always-visible, inspectable category navigation for the catalog — a compact
 * chip strip with per-category counts. The slide-out menu mirrors this, but a
 * catalog this large should not hide its primary axis behind a hamburger.
 */
export default function CategoryStrip({
  categories,
  counts,
  selectedCategory,
  globalSearch,
  datasetSize,
  onSelectCategory,
  onSelectAll,
}: CategoryStripProps) {
  return (
    <nav className="catStrip" role="tablist" aria-label="Cryptography categories">
      <button
        type="button"
        role="tab"
        aria-selected={globalSearch}
        className="focusRing catChip"
        onClick={onSelectAll}
      >
        All
        <span className="catChipCount">{datasetSize}</span>
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={!globalSearch && selectedCategory === category.id}
          className="focusRing catChip"
          onClick={() => onSelectCategory(category.id)}
        >
          {category.label}
          <span className="catChipCount">{counts[category.id] ?? 0}</span>
        </button>
      ))}
    </nav>
  );
}
