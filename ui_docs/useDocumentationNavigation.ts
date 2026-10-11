import { useEffect, useRef, useState } from "react";

type Section = { id: string };
export function useDocumentationNavigation(sections: readonly Section[]) {
  const [activeSection, setActiveSection] = useState("overview");
  const [navOpen, setNavOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      let current = sections[0].id;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 140)
          current = section.id;
      }
      setActiveSection(current);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function onHash() {
      const id = window.location.hash.slice(1);
      if (sections.some((section) => section.id === id)) {
        document.getElementById(id)?.scrollIntoView();
        setActiveSection(id);
      }
    }
    onHash();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);
  useEffect(() => {
    if (!navOpen) return;
    const sidebar = sidebarRef.current;
    const workspace = workspaceRef.current;
    if (!sidebar || !workspace) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    workspace.inert = true;
    document.body.style.overflow = "hidden";
    sidebar.setAttribute("role", "dialog");
    sidebar.setAttribute("aria-modal", "true");
    sidebar.setAttribute("aria-label", "Documentation navigation");
    const focusable = () =>
      Array.from(
        sidebar.querySelectorAll<HTMLElement>("a[href], button"),
      ).filter((element) => element.getClientRects().length > 0);
    focusable()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setNavOpen(false);
      }
      if (event.key === "Tab") {
        const targets = focusable(),
          first = targets[0],
          last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    function onResize() {
      if (window.innerWidth > 720) setNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      workspace.inert = false;
      document.body.style.overflow = previousOverflow;
      sidebar.removeAttribute("role");
      sidebar.removeAttribute("aria-modal");
      sidebar.removeAttribute("aria-label");
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
      else menuRef.current?.focus({ preventScroll: true });
    };
  }, [navOpen]);
  return {
    activeSection,
    navOpen,
    setNavOpen,
    sidebarRef,
    menuRef,
    workspaceRef,
  };
}
