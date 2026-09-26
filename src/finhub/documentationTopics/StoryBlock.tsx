import React, { useState, useEffect, MouseEvent } from "react";

export const StoryBlock: React.FC = () => {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [transforms, setTransforms] = useState<
    Record<string, { tx: number; ty: number; scale: number }>
  >({});

  const handleFocus = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    if (focusedId === id) {
      setFocusedId(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const screenCenterX = viewportWidth / 2;
    const screenCenterY = viewportHeight / 2;

    const tx = screenCenterX - cardCenterX;
    const ty = screenCenterY - cardCenterY;
    const scale = window.innerWidth > 768 ? 1.5 : 1.1;

    setTransforms((prev) => ({ ...prev, [id]: { tx, ty, scale } }));
    setFocusedId(id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusedId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative py-8 w-full flex flex-col items-center">
      <style>{`
        .bento-grid {
            display: grid;
            gap: 1rem;
            width: 100%;
            max-width: 900px;
            grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
            .bento-grid {
                grid-template-columns: repeat(4, 1fr);
                grid-auto-rows: 140px;
            }
            .ratio-portrait { grid-column: span 1; grid-row: span 2; }
            .ratio-square { grid-column: span 2; grid-row: span 2; }
            .ratio-ultrawide { grid-column: span 3; grid-row: span 1; }
            .ratio-tall-square { grid-column: span 1; grid-row: span 2; }
            .bento-grid > :nth-child(4) { grid-column: span 1; grid-row: span 1; }
        }
        .content-card {
            background: var(--tw-colors-white, #ffffff);
            border-radius: 1rem;
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--tw-colors-zinc-200, #e4e4e7);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            position: relative;
            cursor: pointer;
            text-align: left;
            transition: 
                transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.3s ease,
                opacity 0.4s ease,
                background-color 0.3s ease,
                border-color 0.3s ease;
            z-index: 10;
        }
        .dark .content-card {
            background: #18181b;
            border-color: #27272a;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }
        .content-card:hover:not(.focused) {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
            border-color: var(--tw-colors-zinc-300, #d4d4d8);
        }
        .dark .content-card:hover:not(.focused) {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
            border-color: #3f3f46;
        }
        .content-card.focused {
            transform: translate(var(--tx, 0), var(--ty, 0)) scale(var(--scale, 1.5));
            z-index: 100;
            cursor: pointer;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border-color: var(--tw-colors-zinc-400, #a1a1aa);
        }
        .dark .content-card.focused {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            border-color: #52525b;
        }
        .grid-hidden { opacity: 0; pointer-events: none; }
        .card-hidden { opacity: 0; transform: scale(0.9); pointer-events: none; }
        .diagram-container {
            background: #ffffff;
            border-radius: 0.5rem;
            padding: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px dashed var(--tw-colors-zinc-200, #e4e4e7);
            flex-grow: 1;
            margin-top: 0.75rem;
            min-height: 60px;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        .dark .diagram-container {
            background: #09090b;
            border-color: #27272a;
        }
        .heading-accent { height: 4px; width: 24px; border-radius: 2px; margin-bottom: 0.75rem; }
        .card-title { font-size: 1rem; font-weight: 800; color: var(--tw-colors-zinc-900, #18181b); margin-bottom: 0.25rem; line-height: 1.2; transition: color 0.3s ease; }
        .dark .card-title { color: #f4f4f5; }
        .card-text { font-size: 0.75rem; color: var(--tw-colors-zinc-500, #71717a); line-height: 1.4; transition: color 0.3s ease; }
        .dark .card-text { color: #a1a1aa; }
      `}</style>

      <header
        className={`mb-8 text-center transition-opacity duration-300 w-full ${focusedId ? "grid-hidden" : ""}`}
      >
        <h2 className="transition-colors duration-300">Execution Narrative</h2>
        <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs mt-1 transition-colors duration-300">
          Multi-Strategy Exit Framework
        </p>
      </header>

      <main className="bento-grid">
        {/* Block 1 */}
        <button
          className={`content-card ratio-portrait ${focusedId === "B-01" ? "focused" : ""} ${focusedId && focusedId !== "B-01" ? "card-hidden" : ""}`}
          style={
            {
              "--tx": transforms["B-01"]?.tx
                ? `${transforms["B-01"].tx}px`
                : "0px",
              "--ty": transforms["B-01"]?.ty
                ? `${transforms["B-01"].ty}px`
                : "0px",
              "--scale": transforms["B-01"]?.scale || 1,
            } as React.CSSProperties
          }
          onClick={(e) => handleFocus(e, "B-01")}
          tabIndex={focusedId && focusedId !== "B-01" ? -1 : 0}
          aria-label={focusedId === "B-01" ? "Collapse Take Profit Based Exit" : "Expand Take Profit Based Exit"}
          aria-expanded={focusedId === "B-01"}
        >
          <div className="heading-accent bg-blue-500"></div>
          <h2 className="card-title">Take Profit Based</h2>
          <p className="card-text">
            The first trade is designed to capture immediate momentum. It uses a strict, predefined <strong>Take Profit</strong> level to secure early gains and reduce overall exposure quickly.
          </p>
          <div className="diagram-container">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 160"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                cx="200"
                cy="80"
                r="40"
                fill="#3b82f6"
                fillOpacity="0.1"
                stroke="#3b82f6"
                strokeWidth="3"
              />
              <path
                d="M180 80 L200 100 L230 60"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {/* Block 2 */}
        <button
          className={`content-card ratio-square ${focusedId === "B-02" ? "focused" : ""} ${focusedId && focusedId !== "B-02" ? "card-hidden" : ""}`}
          style={
            {
              "--tx": transforms["B-02"]?.tx
                ? `${transforms["B-02"].tx}px`
                : "0px",
              "--ty": transforms["B-02"]?.ty
                ? `${transforms["B-02"].ty}px`
                : "0px",
              "--scale": transforms["B-02"]?.scale || 1,
            } as React.CSSProperties
          }
          onClick={(e) => handleFocus(e, "B-02")}
          tabIndex={focusedId && focusedId !== "B-02" ? -1 : 0}
          aria-label={focusedId === "B-02" ? "Collapse Indicator Based Exit" : "Expand Indicator Based Exit"}
          aria-expanded={focusedId === "B-02"}
        >
          <div className="heading-accent bg-purple-500"></div>
          <h2 className="card-title">Indicator Based Exit</h2>
          <p className="card-text">
            The second trade relies on dynamic market conditions. It remains open until a specific technical indicator (e.g., RSI divergence or MACD crossover) signals a trend reversal, maximizing trend-following potential.
          </p>
          <div className="diagram-container">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 160"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M50 120 L150 80 L250 100 L350 40"
                fill="none"
                stroke="#a855f7"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="350" cy="40" r="6" fill="#a855f7" />
              <path
                d="M50 120 L150 80 L250 100 L350 40 L350 160 L50 160 Z"
                fill="#a855f7"
                fillOpacity="0.1"
                stroke="none"
              />
            </svg>
          </div>
        </button>

        {/* Block 3 */}
        <button
          className={`content-card ratio-ultrawide ${focusedId === "B-03" ? "focused" : ""} ${focusedId && focusedId !== "B-03" ? "card-hidden" : ""}`}
          style={
            {
              "--tx": transforms["B-03"]?.tx
                ? `${transforms["B-03"].tx}px`
                : "0px",
              "--ty": transforms["B-03"]?.ty
                ? `${transforms["B-03"].ty}px`
                : "0px",
              "--scale": transforms["B-03"]?.scale || 1,
            } as React.CSSProperties
          }
          onClick={(e) => handleFocus(e, "B-03")}
          tabIndex={focusedId && focusedId !== "B-03" ? -1 : 0}
          aria-label={focusedId === "B-03" ? "Collapse Time-Based Exit" : "Expand Time-Based Exit"}
          aria-expanded={focusedId === "B-03"}
        >
          <div className="heading-accent bg-amber-500"></div>
          <h2 className="card-title">Time Based Exit</h2>
          <p className="card-text">
            The third trade acts as a temporal hedge. It is programmed to close after a set duration (e.g., end of the trading session), preventing overnight exposure and mitigating unpredictable gap risks.
          </p>
          <div className="diagram-container">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 160"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect
                x="100"
                y="60"
                width="80"
                height="60"
                rx="8"
                fill="#f59e0b"
                fillOpacity="0.1"
                stroke="#f59e0b"
                strokeWidth="3"
              />
              <path
                d="M200 90 L240 90"
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
              <rect
                x="260"
                y="40"
                width="80"
                height="80"
                rx="8"
                fill="#f59e0b"
                fillOpacity="0.2"
                stroke="#f59e0b"
                strokeWidth="3"
              />
            </svg>
          </div>
        </button>

        {/* Block 4 */}
        <button
          className={`content-card ratio-tall-square ${focusedId === "B-04" ? "focused" : ""} ${focusedId && focusedId !== "B-04" ? "card-hidden" : ""}`}
          style={
            {
              "--tx": transforms["B-04"]?.tx
                ? `${transforms["B-04"].tx}px`
                : "0px",
              "--ty": transforms["B-04"]?.ty
                ? `${transforms["B-04"].ty}px`
                : "0px",
              "--scale": transforms["B-04"]?.scale || 1,
            } as React.CSSProperties
          }
          onClick={(e) => handleFocus(e, "B-04")}
          tabIndex={focusedId && focusedId !== "B-04" ? -1 : 0}
          aria-label={focusedId === "B-04" ? "Collapse Risk Distribution" : "Expand Risk Distribution"}
          aria-expanded={focusedId === "B-04"}
        >
          <div className="heading-accent bg-emerald-500"></div>
          <h2 className="card-title">Risk Distribution</h2>
          <p className="card-text">
            By diversifying exit strategies across multiple trades, the system effectively balances <strong>capital preservation</strong> with the pursuit of extended market trends.
          </p>
          <div className="diagram-container">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 160"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                cx="200"
                cy="40"
                r="20"
                fill="#10b981"
                fillOpacity="0.1"
                stroke="#10b981"
                strokeWidth="3"
              />
              <circle
                cx="200"
                cy="90"
                r="20"
                fill="#10b981"
                fillOpacity="0.2"
                stroke="#10b981"
                strokeWidth="3"
              />
              <circle
                cx="200"
                cy="140"
                r="20"
                fill="#10b981"
                fillOpacity="0.3"
                stroke="#10b981"
                strokeWidth="3"
              />
              <path
                d="M200 60 L200 70 M200 110 L200 120"
                stroke="#10b981"
                strokeWidth="2"
              />
            </svg>
          </div>
        </button>
      </main>
    </div>
  );
};
