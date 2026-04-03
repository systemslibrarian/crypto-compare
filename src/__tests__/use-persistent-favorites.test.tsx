import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePersistentFavorites } from "@/lib/usePersistentFavorites";

function TestFavorites() {
  const { favorites, toggleFavorite } = usePersistentFavorites();

  return (
    <div>
      <div>{favorites.join(",") || "empty"}</div>
      <button onClick={() => toggleFavorite("aes256gcm")}>toggle aes</button>
    </div>
  );
}

describe("usePersistentFavorites", () => {
  it("hydrates from storage and persists toggles", () => {
    window.localStorage.setItem("crypto-compare-favorites", JSON.stringify(["mlkem768"]));

    render(<TestFavorites />);

    expect(screen.getByText("mlkem768")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /toggle aes/i }));

    expect(screen.getByText("mlkem768,aes256gcm")).toBeInTheDocument();
    expect(window.localStorage.getItem("crypto-compare-favorites")).toBe(JSON.stringify(["mlkem768", "aes256gcm"]));
  });
});