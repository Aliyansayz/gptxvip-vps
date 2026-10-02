import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { smartNavigate, getAppRoot } from "./utils/navigation";
import "./index.css";
import { BrowserRouter } from "react-router";

const BlogsView = lazy(() => import("./devLushArea/agentDevRootComponents/BlogsView").then((module) => ({ default: module.BlogsView })));
const AgentCatalogApp = lazy(() => import("./devLushArea/agentMarketplace/App"));
const DesignSystemBoard = lazy(() => import("../ui_docs/DesignSystemBoard"));

const RouteLoading = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-white text-sm font-semibold text-slate-500">
    Loading workspace…
  </div>
);

// Expose navigation utility globally
(window as any).smartNavigate = smartNavigate;
(window as any).getAppRoot = getAppRoot;

let path = window.location.pathname;

// Keep the retired singular URL working while the catalog uses `/agents`.
if (path === "/agent" || path.startsWith("/agent/")) {
  path = path.replace(/^\/agent(?=\/|$)/, "/agents");
  window.history.replaceState({}, "", `${path}${window.location.search}${window.location.hash}`);
}

const appRoot = getAppRoot(path);

if (appRoot === '/blogs') {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Suspense fallback={<RouteLoading />}>
        <BlogsView />
      </Suspense>
    </StrictMode>,
  );
} else if (appRoot === '/agents') {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Suspense fallback={<RouteLoading />}>
        <BrowserRouter basename="/agents">
          <AgentCatalogApp />
        </BrowserRouter>
      </Suspense>
    </StrictMode>,
  );
} else if (path === "/ui-ux" || path.startsWith("/ui-ux/")) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Suspense fallback={<RouteLoading />}>
        <DesignSystemBoard />
      </Suspense>
    </StrictMode>,
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
