type ResultsStatusProps = {
  explainerOpen: boolean;
  filteredCount: number;
};

export default function ResultsStatus({ explainerOpen, filteredCount }: ResultsStatusProps) {
  return (
    <>
      {!explainerOpen ? (
        <p className="text-body" style={{ fontSize: "15px", margin: "0 0 18px" }}>
          Select cards to compare algorithms side by side.
        </p>
      ) : null}

      {filteredCount === 0 ? (
        <p role="status" style={{ color: "var(--color-text-muted)" }}>
          No algorithms match the current filters.
        </p>
      ) : null}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {filteredCount} algorithm{filteredCount !== 1 ? "s" : ""} shown
      </div>
    </>
  );
}