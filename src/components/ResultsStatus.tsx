type ResultsStatusProps = {
  filteredCount: number;
};

/**
 * Live result count for assistive tech plus a visible empty state.
 * Visible status (counts, scope) lives in the catalog status row.
 */
export default function ResultsStatus({ filteredCount }: ResultsStatusProps) {
  return (
    <>
      {filteredCount === 0 ? (
        <p role="status" style={{ color: "var(--color-text-muted)", padding: "24px 0" }}>
          No algorithms match the current filters.
        </p>
      ) : null}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {filteredCount} algorithm{filteredCount !== 1 ? "s" : ""} shown
      </div>
    </>
  );
}
