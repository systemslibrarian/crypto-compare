import { ALGORITHMS } from "@/data/algorithms";
import { withProvenance } from "@/lib/dataset";
import { summarizeReviewWindow } from "@/lib/trust";

export const DATASET_TRUST_SNAPSHOT = summarizeReviewWindow(withProvenance(ALGORITHMS));
