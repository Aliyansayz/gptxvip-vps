import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { Activity, Zap, Shield, Target, TrendingUp } from "lucide-react";
import { createScrollTransition } from "../functions/transitions";

gsap.registerPlugin(ScrollTrigger);

/**
 * ARCHIVED COMPONENT: ScrollTransition
 * Reason: Removed from MultipleTradeView as "totally unnecessary these three slides".
 * Archived on: 2026-04-17
 */
export const ScrollTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const curvePathRef = useRef<SVGPathElement>(null);

  // Calculus Visualizer Logic (Adapted for Trading)
  useLayoutEffect(() => {
    if (!containerRef.current || !page1Ref.current || !page2Ref.current || !page3Ref.current) return;
    
    const ctx = createScrollTransition(containerRef.current, [
      page1Ref.current,
      page2Ref.current,
      page3Ref.current,
    ]);

    return () => ctx.revert();
  }, []);

  // Integral (Calculus) Visualization Animation
  useEffect(() => {
    const svgWidth = 100;
    const svgHeight = 50;
    const logicalRange = { x: 1, y: 1 };
    const maxRects = 100;
    const speed = 0.5;
    let rects = 2;
    let animationFrameId: number;

    const mapX = (x: number) => (x / logicalRange.x) * svgWidth;
    const mapY = (y: number) => (y / logicalRange.y) * svgHeight;
    const curveFunction = (x: number) => x * x;

    const generateCurvePath = () => {
      let d = `M ${mapX(0)},${svgHeight - mapY(curveFunction(0))}`;
      for (let i = 1; i <= 100; i++) {
        const x = i / 100;
        const y = curveFunction(x);
        d += ` L ${mapX(x)},${svgHeight - mapY(y)}`;
      }
      return d;
    };

    if (curvePathRef.current) {
      curvePathRef.current.setAttribute("d", generateCurvePath());
    }

    const updateVisualization = () => {
      if (!svgRef.current) return;
      const existingRects = svgRef.current.querySelectorAll("rect");
      existingRects.forEach((rect) => rect.remove());

      const dx = logicalRange.x / rects;
      const rectWidthSvg = svgWidth / rects;

      for (let i = 0; i < rects; i++) {
        const logicalX = i * dx;
        const logicalY = curveFunction(logicalX);
        const rectHeightSvg = mapY(logicalY);

        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        rect.setAttribute("x", (i * rectWidthSvg).toString());
        rect.setAttribute("y", (svgHeight - rectHeightSvg).toString());
        rect.setAttribute("width", rectWidthSvg.toString());
        rect.setAttribute("height", rectHeightSvg.toString());
        rect.setAttribute("fill", "rgba(16, 185, 129, 0.4)"); // Emerald color
        rect.setAttribute("stroke", "#10b981");
        rect.setAttribute("stroke-width", "0.2");

        svgRef.current.appendChild(rect);
      }
    };

    const animate = () => {
      rects += speed;
      if (rects > maxRects) {
        rects = 2;
      }
      updateVisualization();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 mt-12 transition-colors duration-300"
    >
      {/* Page 1: Execution Pipeline (Calculus Visualizer Style) */}
      <div
        ref={page1Ref}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-start pt-12 p-8 bg-white dark:bg-zinc-950 z-20 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto text-center">
          <header className="mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter transition-colors duration-300">
              Execution Pipeline
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-mono text-sm transition-colors duration-300">
              Witness the{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                cumulative volume
              </strong>{" "}
              emerge from discrete execution blocks.
            </p>
          </header>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-2xl h-auto p-4">
              <svg
                ref={svgRef}
                viewBox="0 0 100 50"
                className="w-full h-auto bg-transparent transition-all duration-300"
              >
                <path
                  ref={curvePathRef}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  fill="rgba(16, 185, 129, 0.1)"
                ></path>
              </svg>
            </div>
          </div>
          <div className="mt-8 text-xs text-zinc-500 dark:text-zinc-600 font-mono animate-pulse uppercase tracking-widest transition-colors duration-300">
            Scroll down to transition to Market Liquidity
          </div>
        </div>
      </div>

      {/* Page 2: Market Liquidity Field (Magnetic Field Style) */}
      <div
        ref={page2Ref}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-start pt-12 p-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 z-30 border-l border-zinc-200 dark:border-zinc-800 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 transition-colors duration-300">
            Liquidity Field: Order Flow
          </h2>
          <div className="flex justify-center items-center w-full p-4">
            <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 200 200">
              {/* Part of the wire (Order Flow Line) */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="180"
                className="stroke-zinc-300 dark:stroke-zinc-700 stroke-[5px] fill-none transition-colors duration-300"
              />

              {/* Elliptical Field Lines (side perspective) */}
              {[20, 30, 45, 60, 75, 90].map((r, i) => {
                const ry = r * 0.35;
                return (
                  <path
                    key={i}
                    d={`M 100 100 m ${r} 0 a ${r} ${ry} 0 1 1 -${r * 2} 0 a ${r} ${ry} 0 1 1 ${r * 2} 0`}
                    className="stroke-emerald-500/40 stroke-[1.5px] fill-none stroke-dasharray-[8,8] animate-[fieldFlow_4s_linear_infinite]"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                );
              })}

              {/* Field particles for animation */}
              {[20, 30, 45, 60, 75, 90].map((r, i) => {
                const ry = r * 0.35;
                return (
                  <circle
                    key={`p-${i}`}
                    className="fill-emerald-500 dark:fill-emerald-400 transition-colors duration-300"
                    r="2"
                  >
                    <animateMotion
                      path={`M ${100 + r} 100 A ${r} ${ry} 0 1 1 ${100 - r} 100 A ${r} ${ry} 0 1 1 ${100 + r} 100`}
                      dur="4s"
                      begin={`${i * 0.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                );
              })}

              {/* Part of the wire in front */}
              <line
                x1="100"
                y1="20"
                x2="100"
                y2="100"
                className="stroke-zinc-300 dark:stroke-zinc-700 stroke-[5px] fill-none transition-colors duration-300"
              />

              {/* Current direction arrow (downwards) and label */}
              <polygon
                points="95,30 105,30 100,20"
                className="fill-emerald-600 dark:fill-emerald-500 transition-colors duration-300"
              />
              <text
                x="110"
                y="35"
                className="fill-zinc-500 dark:fill-zinc-400 text-[14px] font-bold font-mono transition-colors duration-300"
              >
                FLOW
              </text>
            </svg>
          </div>
          <div className="mt-8 p-6 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center max-w-2xl mx-auto transition-colors duration-300">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed transition-colors duration-300">
              Market liquidity behaves like a magnetic field around the core
              order flow. High-frequency algorithms detect these "concentric"
              zones of liquidity to optimize entry and exit points, ensuring
              minimal slippage during large-scale execution.
            </p>
          </div>
          <div className="mt-8 text-xs text-zinc-500 dark:text-zinc-600 font-mono animate-pulse uppercase tracking-widest transition-colors duration-300">
            Scroll down to transition to Returns Accumulation
          </div>
        </div>
      </div>

      {/* Page 3: Returns Accumulation */}
      <div
        ref={page3Ref}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-start pt-12 p-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 z-40 border-l border-zinc-200 dark:border-zinc-800 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto text-center">
          <header className="mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter transition-colors duration-300">
              Returns Accumulation
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-mono text-sm transition-colors duration-300">
              Compounding edge over thousands of executions.
            </p>
          </header>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-2xl h-auto p-4 flex flex-col items-center gap-6">
              <div className="p-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-16 h-16" />
              </div>
              <div className="p-6 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center max-w-2xl mx-auto transition-colors duration-300">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed transition-colors duration-300">
                  By systematically capturing small edges in the order flow and navigating the liquidity field efficiently, the strategy accumulates returns over time. The compounding effect of these micro-wins forms the foundation of the algorithm's profitability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fieldFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 16; }
        }
      `}</style>
    </div>
  );
};
