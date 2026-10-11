import { useEffect, useRef, type RefObject } from "react";

let locks = 0;
let priorOverflow = "";
const focusable =
  'button, a[href], input:not([type="hidden"]), select, textarea, [tabindex]';
function targets(element: HTMLElement) {
  return [...element.querySelectorAll<HTMLElement>(focusable)].filter(
    (target) =>
      target.tabIndex >= 0 &&
      !target.matches(":disabled") &&
      !target.closest("[inert]") &&
      target.getClientRects().length > 0 &&
      getComputedStyle(target).visibility !== "hidden",
  );
}

/** Local inert siblings, contained keyboard focus, nested-safe scroll lock and return focus. */
export function useFocusLayer(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const element = ref.current;
    if (!open || !element) return;
    const opener = document.activeElement as HTMLElement | null;
    const scope = (element.closest(".product-workspace") ||
      element.parentElement ||
      element) as HTMLElement;
    const inactive = new Map<HTMLElement, boolean>();
    let branch: HTMLElement = element;
    while (branch.parentElement && scope.contains(branch.parentElement)) {
      const parent = branch.parentElement;
      for (const sibling of [...parent.children]) {
        if (
          sibling === branch ||
          !(sibling instanceof HTMLElement) ||
          sibling.classList.contains("product-backdrop")
        )
          continue;
        inactive.set(sibling, sibling.inert);
        sibling.inert = true;
      }
      branch = parent;
    }
    if (!locks++) {
      priorOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    const focusFirst = () => (targets(element)[0] || element).focus();
    focusFirst();
    const isTop = () =>
      [...scope.querySelectorAll('[role="dialog"]')]
        .filter((node) => node.getClientRects().length)
        .at(-1) === element;
    const key = (event: KeyboardEvent) => {
      if (!isTop()) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        close.current();
      }
      if (event.key === "Tab") {
        const controls = targets(element);
        const first = controls[0],
          last = controls.at(-1);
        if (!first) {
          event.preventDefault();
          element.focus();
          return;
        }
        if (
          !element.contains(document.activeElement) ||
          (event.shiftKey && document.activeElement === first)
        ) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const focus = (event: FocusEvent) => {
      if (isTop() && !element.contains(event.target as Node)) focusFirst();
    };
    document.addEventListener("keydown", key, true);
    document.addEventListener("focusin", focus);
    return () => {
      document.removeEventListener("keydown", key, true);
      document.removeEventListener("focusin", focus);
      inactive.forEach((wasInert, node) => {
        node.inert = wasInert;
      });
      if (!--locks) document.body.style.overflow = priorOverflow;
      if (
        opener?.isConnected &&
        !opener.matches(":disabled") &&
        opener.getClientRects().length
      )
        opener.focus();
    };
  }, [ref, open]);
}
