import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BlogsView } from "./devLushArea/agentDevRootComponents/BlogsView";
import DevLushApp from "./devLushArea/agentDevRootComponents/devLushAreaApp";
import "./index.css";

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
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
