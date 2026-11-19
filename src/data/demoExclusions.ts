/**
 * Live crypto-lab demos that deliberately have NO entry in ALGORITHM_DEMOS,
 * each with the reason.
 *
 * This dataset attaches a demo to an ALGORITHM, and every algorithm key is a
 * full record whose content has to be correct. These five demonstrate
 * constructions this dataset holds no algorithm record for, and inventing one
 * to hang a demo on would mean publishing an algorithm record nobody has
 * reviewed. So they are excluded, by name, with a reason that can be read and
 * argued with.
 *
 * An exclusion is not a silence: `check:demos:strict` still fails on a live
 * slug that is neither listed here nor present in ALGORITHM_DEMOS, fails on a
 * slug listed here that is no longer live, and fails on a slug that is both
 * excluded and attached. Adding a key later is the way to clear an entry --
 * deleting the line without attaching the demo puts it straight back into
 * "missing from local".
 */
export const DEMO_EXCLUSIONS: Record<string, string> = {
  "crypto-lab-lightweight-bench":
    "SIMON, SPECK, GIFT, SKINNY and PRINCE — none of the five has an algorithm entry in this dataset.",
  "crypto-lab-noisy-parity":
    "LPN with HB and HB+ tag authentication — no LPN algorithm entry in this dataset.",
  "crypto-lab-passport-key":
    "ICAO 9303 Basic Access Control over Triple-DES — no 3DES algorithm entry in this dataset.",
  "crypto-lab-pseudorandom-code":
    "LDPC pseudorandom codes — no coding-theory algorithm entry in this dataset.",
  "crypto-lab-tropical-exchange":
    "Key exchange over tropical algebra — no tropical-algebra algorithm entry in this dataset.",
};
