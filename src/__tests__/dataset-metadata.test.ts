import { describe, expect, it } from "vitest";
import { ALGORITHM_PROVENANCE } from "@/data/provenance";
import { DATASET_TRUST_SNAPSHOT } from "@/lib/datasetMetadata";

describe("dataset metadata", () => {
  it("derives the displayed review window from provenance", () => {
    const reviewDates = Object.values(ALGORITHM_PROVENANCE).map((entry) => entry.lastReviewed);

    expect(DATASET_TRUST_SNAPSHOT.earliest).toBe(reviewDates.sort()[0]);
    expect(DATASET_TRUST_SNAPSHOT.latest).toBe(reviewDates.sort().at(-1));
    expect(DATASET_TRUST_SNAPSHOT.coverage).toBe(Object.keys(ALGORITHM_PROVENANCE).length);
  });
});
