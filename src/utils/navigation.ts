/**
 * Utility script to handle cross-root and intra-root navigation.
 * 
 * The application has multiple React roots mounted in main.tsx based on the initial pathname:
 * - /blogs -> BlogsView
 * - /agent -> DevLushApp
 * - /profile -> App (with profile tab)
 * - / (default) -> App
 */

export function getAppRoot(path: string): string {
  if (path.startsWith('/blogs')) return '/blogs';
  if (path.startsWith('/agent')) return '/agent';
  if (path.startsWith('/profile')) return '/profile';
  if (path.startsWith('/finhub')) return '/finhub';
  return '/'; // default root
}

/**
 * Checks current route URL and decides whether to shift directly using pushState 
 * or move through the root (hard window reload) to switch React trees.
 * 
 * @param targetUrl The URL to navigate to
 */
export function smartNavigate(targetUrl: string) {
  const currentUrl = window.location.pathname;
  
  const currentRoot = getAppRoot(currentUrl);
  const targetRoot = getAppRoot(targetUrl);

  if (currentRoot === targetRoot) {
    // Both URLs belong to the same React application root.
    // We can go directly without a hard reload.
    window.history.pushState({}, '', targetUrl);
    
    // Dispatch a custom event in case components inside the current root
    // want to listen to routing changes (since react-router is not used globally).
    const navEvent = new CustomEvent('app-navigate', { detail: { path: targetUrl } });
    window.dispatchEvent(navEvent);
  } else {
    // The target URL belongs to a different React application root.
    // We need to move through the root (main.tsx) by doing a hard reload.
    window.location.href = targetUrl;
  }
}
