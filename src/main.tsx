import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { smartNavigate, getAppRoot, getCanonicalManualPath } from "./utils/navigation";
import "./index.css";
import { BrowserRouter } from "react-router";

const App = lazy(() => import("./App.tsx"));
const BlogsView = lazy(() =>
  import("./devLushArea/agentDevRootComponents/BlogsView").then((module) => ({
    default: module.BlogsView,
  })),
);
const AgentCatalogApp = lazy(
  () => import("./devLushArea/agentMarketplace/App"),
);
const DesignSystemBoard = lazy(() => import("../ui_docs/DesignSystemBoard"));
const AlternateLandingPage = lazy(
  () => import("./alternateLandingPage/AlternateLandingPage"),
);
const SoftwareManualApp = lazy(() => import("../software_manual/App"));

const RouteLoading = ({ dark = false }: { dark?: boolean }) => (
  <div
    className={`flex min-h-screen w-full items-center justify-center text-sm font-semibold ${dark ? "bg-[#07080a] text-neutral-400" : "bg-white text-slate-500"}`}
  >
    {dark ? "Loading Basalt…" : "Loading workspace…"}
  </div>
);

// Expose navigation utility globally
(window as any).smartNavigate = smartNavigate;
(window as any).getAppRoot = getAppRoot;

let path = window.location.pathname;

// Resolve public aliases and former HTML URLs before choosing the application root.
const canonicalManualPath = getCanonicalManualPath(path);
if (canonicalManualPath !== path) {
  path = canonicalManualPath;
  window.history.replaceState(window.history.state, "", `${path}${window.location.search}${window.location.hash}`);
}

// Keep the retired singular URL working while the catalog uses `/agents`.
if (path === "/agent" || path.startsWith("/agent/")) {
  path = path.replace(/^\/agent(?=\/|$)/, "/agents");
  window.history.replaceState(
    {},
    "",
    `${path}${window.location.search}${window.location.hash}`,
  );
}

const appRoot = getAppRoot(path);

if (appRoot === "/software_manual") {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Suspense fallback={<RouteLoading />}>
        <BrowserRouter basename="/software_manual">
          <SoftwareManualApp />
        </BrowserRouter>
      </Suspense>
    </StrictMode>,
  );
} else if (appRoot === "/blogs") {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Suspense fallback={<RouteLoading />}>
        <BlogsView />
      </Suspense>
    </StrictMode>,
  );
} else if (appRoot === "/agents") {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Suspense fallback={<RouteLoading />}>
        <BrowserRouter basename="/agents">
          <AgentCatalogApp />
        </BrowserRouter>
      </Suspense>
    </StrictMode>,
  );
} else if (appRoot === "/alternate-landing") {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Suspense fallback={<RouteLoading dark />}>
        <AlternateLandingPage />
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
      <Suspense fallback={<RouteLoading />}>
        <App />
      </Suspense>
    </StrictMode>,
  );
}
