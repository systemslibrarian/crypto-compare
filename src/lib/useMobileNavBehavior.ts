import { useEffect } from "react";

type UseMobileNavBehaviorArgs = {
  isOpen: boolean;
  navElement: HTMLElement | null;
  onClose: () => void;
};

export function useMobileNavBehavior({ isOpen, navElement, onClose }: UseMobileNavBehaviorArgs) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const getFocusable = () => navElement?.querySelectorAll<HTMLElement>('button, a, [tabindex]:not([tabindex="-1"])') ?? [];
    const focusable = getFocusable();
    if (focusable.length > 0) focusable[0].focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      const activeFocusable = getFocusable();
      if (event.key !== "Tab" || activeFocusable.length === 0) return;

      const first = activeFocusable[0];
      const last = activeFocusable[activeFocusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, navElement, onClose]);
}