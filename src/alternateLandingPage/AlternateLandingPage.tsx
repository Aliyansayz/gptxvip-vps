import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { AuroraBackground } from "./components/AuroraBackground";
import { Navigation } from "./components/Navigation";
import { CommandLauncher } from "./components/CommandLauncher";
import { AppleMark, ProductHuntMark, WindowsMark } from "./components/Marks";
import { PreviewDialog, type PreviewContent } from "./components/PreviewDialog";
import "./landing.css";

export default function AlternateLandingPage() {
  const [dialog, setDialog] = useState<PreviewContent | null>(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Basalt — One keystroke away";
    return () => {
      document.title = previousTitle;
    };
  }, []);
  const download = (os: "Mac" | "Windows") =>
    setDialog({ kind: "download", os });
  return (
    <main id="top" className="basalt-page">
      <AuroraBackground />
      <a className="basalt-skip" href="#basalt-headline">
        Skip to content
      </a>
      <Navigation
        onInfo={(page) => setDialog({ kind: "info", page })}
        onDownload={() =>
          download(/Windows/i.test(navigator.userAgent) ? "Windows" : "Mac")
        }
      />
      <div className="basalt-hero">
        <div className="basalt-eyebrow">
          <span>v2.0</span>
          <span className="basalt-eyebrow-divider" />
          now with an AI command bar
          <ChevronRight size={13} aria-hidden="true" />
        </div>
        <h1 id="basalt-headline" className="basalt-headline">
          Everything you build,
          <br />
          one <span className="basalt-accent">keystroke</span> away.
        </h1>
        <p className="basalt-subtitle">
          Your tools, projects, and workflows. One fast command bar.
          <br className="basalt-desktop-break" /> Less context switching. More
          building.
        </p>
        <div className="basalt-downloads">
          <button className="basalt-keycap" onClick={() => download("Mac")}>
            <AppleMark />
            Download for Mac
          </button>
          <button className="basalt-keycap" onClick={() => download("Windows")}>
            <WindowsMark />
            Download for Windows
          </button>
        </div>
        <p className="basalt-install-caption">
          <span>brew install basalt</span>
          <span className="basalt-caption-separator">·</span>Install via
          homebrew or winget
        </p>
        <CommandLauncher
          onCommand={(title) => setDialog({ kind: "command", title })}
        />
        <button
          className="basalt-learn-more"
          onClick={() => setDialog({ kind: "info", page: "learn" })}
        >
          Learn more <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
      <aside className="basalt-product-hunt" aria-label="Product Hunt feature">
        <ProductHuntMark />
        <div>
          <span>Featured on Product Hunt</span>
          <strong>#1 Product of the Day</strong>
        </div>
      </aside>
      <PreviewDialog content={dialog} onClose={() => setDialog(null)} />
    </main>
  );
}
