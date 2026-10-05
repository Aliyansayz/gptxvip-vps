/**
 * Utility script to handle cross-root and intra-root navigation.
 *
 * The application has separate entry surfaces selected by main.tsx:
 * - /blogs -> BlogsView
 * - /agents (including /agents/lab) -> Agent catalog
 * - /alternate-landing -> AlternateLandingPage
 * - all other paths -> main App
 */

/** Public manual aliases resolve to the canonical software_manual application. */
export function getCanonicalManualPath(pathname: string): string {
  const path = pathname.replace(/^\/(?:software|software-manual)(?=\/|$)/, "/software_manual");
  return path.replace(/^(\/software_manual(?:\/[^/]+)?)\/index\.html$/, "$1");
}

export function getAppRoot(path: string): string {
  let pathname: string;
  try {
    pathname = new URL(path, window.location.origin).pathname;
  } catch {
    pathname = path.split(/[?#]/, 1)[0] || "/";
  }

  pathname = getCanonicalManualPath(pathname);

  const isWithin = (root: string) =>
    pathname === root || pathname.startsWith(`${root}/`);

  if (isWithin("/software_manual")) return "/software_manual";
  if (isWithin("/alternate-landing")) return "/alternate-landing";
  if (isWithin("/blogs")) return "/blogs";
  if (isWithin("/agents") || isWithin("/agent")) return "/agents";
  if (isWithin("/profile")) return "/profile";
  if (isWithin("/finhub")) return "/finhub";
  return "/"; // default root
}

/**
 * Checks current route URL and decides whether to shift directly using pushState
 * or move through the root (hard window reload) to switch React trees.
 *
 * @param targetUrl The URL to navigate to
 */
export function smartNavigate(targetUrl: string) {
  let target: URL;
  try {
    target = new URL(targetUrl, window.location.href);
  } catch {
    window.location.href = targetUrl;
    return;
  }

  if (target.origin === window.location.origin) {
    target.pathname = getCanonicalManualPath(target.pathname);
  }

  const current = new URL(window.location.href);
  const currentRoot = getAppRoot(current.pathname);
  const targetRoot = getAppRoot(target.pathname);

  if (target.origin === current.origin && currentRoot === targetRoot) {
    if (target.href === current.href) return;
    // Both URLs belong to the same React application root.
    // We can go directly without a hard reload.
    window.history.pushState(
      {},
      "",
      `${target.pathname}${target.search}${target.hash}`,
    );

    // Keep both the hand-rolled route listeners and React Router roots in sync.
    window.dispatchEvent(
      new PopStateEvent("popstate", { state: window.history.state }),
    );
  } else {
    // The target URL belongs to a different React application root.
    // We need to move through the root (main.tsx) by doing a hard reload.
    window.location.href = target.href;
  }
}
