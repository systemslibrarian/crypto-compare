import { fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { describe, expect, it } from "vitest";
import { useCryptoCompareController } from "@/lib/useCryptoCompareController";

function TestController() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [cat, setCat] = useState<"symmetric" | "hash">("hash");
  const [sel, setSel] = useState<string[]>(["aes256gcm"]);
  const [cmp, setCmp] = useState(true);
  const [globalSearch, setGlobalSearch] = useState(false);
  const [favOnly, setFavOnly] = useState(true);
  const [showDefaults, setShowDefaults] = useState(false);
  const [, setAdv] = useState(true);
  const [, setExplainerOpen] = useState(false);
  const [, setSearch] = useState("hash");
  const [, setPqOnly] = useState(true);
  const [, setStandardOnly] = useState(true);
  const [, setNistOnly] = useState(true);
  const [, setDeployedOnly] = useState(true);
  const [, setCountry] = useState<"all" | "Japan">("Japan");
  const [, setSortBy] = useState<"name" | "security">("security");
  const [, setShowMethodology] = useState(true);
  const [, setShowHybrid] = useState(true);
  const [, setShowGuide] = useState(true);
  const [, setShowSafeUsage] = useState(true);
  const [, setShowArchitectures] = useState(true);
  const [, setShowPhilosophy] = useState(true);
  const [, setShowLibraries] = useState(true);
  const [, setShowFilters] = useState(true);
  const [, setMobileNavOpen] = useState(true);

  const controller = useCryptoCompareController({
    searchRef,
    setCat,
    setAdv,
    setSel,
    setCmp,
    setExplainerOpen,
    setSearch,
    setPqOnly,
    setStandardOnly,
    setNistOnly,
    setDeployedOnly,
    setCountry: setCountry as never,
    setSortBy: setSortBy as never,
    setShowMethodology,
    setShowHybrid,
    setShowDefaults,
    setShowGuide,
    setShowSafeUsage,
    setShowArchitectures,
    setShowPhilosophy,
    setShowLibraries,
    setShowFilters,
    setGlobalSearch,
    setFavOnly,
    setMobileNavOpen,
  });

  return (
    <div>
      <input ref={searchRef} aria-label="search" />
      <div>{cat}</div>
      <div>{sel.join(",") || "empty"}</div>
      <div>{cmp ? "compare-on" : "compare-off"}</div>
      <div>{globalSearch ? "global-on" : "global-off"}</div>
      <div>{favOnly ? "favorites-on" : "favorites-off"}</div>
      <div>{showDefaults ? "defaults-on" : "defaults-off"}</div>
      <button onClick={() => controller.switchCategory("symmetric")}>switch</button>
      <button onClick={() => controller.toggleSelection("xchacha20poly")}>toggle</button>
      <button onClick={controller.showRecommendedDefaults}>defaults</button>
    </div>
  );
}

describe("useCryptoCompareController", () => {
  it("coordinates selection, category switching, and defaults flow", () => {
    render(<TestController />);

    fireEvent.click(screen.getByRole("button", { name: /switch/i }));
    expect(screen.getByText("symmetric")).toBeInTheDocument();
    expect(screen.getByText("empty")).toBeInTheDocument();
    expect(screen.getByText("compare-off")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByText("xchacha20poly")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /defaults/i }));
    expect(screen.getByText("defaults-on")).toBeInTheDocument();
    expect(screen.getByText("favorites-off")).toBeInTheDocument();
    expect(screen.getByText("global-off")).toBeInTheDocument();
  });
});