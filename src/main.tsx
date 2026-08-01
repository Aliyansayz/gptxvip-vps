import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BlogsView } from "./devLushArea/agentDevRootComponents/BlogsView";
import DevLushApp from "./devLushArea/agentDevRootComponents/devLushAreaApp";
import { smartNavigate, getAppRoot } from "./utils/navigation";
import "./index.css";

// Expose navigation utility globally
(window as any).smartNavigate = smartNavigate;
(window as any).getAppRoot = getAppRoot;

const path = window.location.pathname;

if (path.startsWith('/blogs')) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BlogsView />
    </StrictMode>,
  );
} else if (path.startsWith('/agent')) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <DevLushApp />
    </StrictMode>,
  );
} else if (path.startsWith('/profile')) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App initialTab="profile" />
    </StrictMode>,
  );
} else if (path.startsWith('/math_primer')) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App initialTab="math-primer" />
    </StrictMode>,
  );
} else if (path.startsWith('/core_concepts')) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App initialTab="core-concepts" />
    </StrictMode>,
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
