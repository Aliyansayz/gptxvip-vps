import React, { useRef, useEffect, useState } from "react";
import { JourneyParticles } from "./JourneyParticles";
import { JourneyPath } from "./path";
import { JourneyNodes } from "./nodes";
import { JourneyOverlays } from "./JourneyOverlays";
import { getCameraTransform } from "./camera";
import { getStatusFromProgress } from "./status";
import { ProjectJourneyData, JourneyNode, Particle } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isProjectJourneyData = (value: unknown): value is ProjectJourneyData => {
  if (!isRecord(value) || !isRecord(value.app) || !isRecord(value.canvas) || !isRecord(value.path)) return false;
  if (typeof value.app.title !== "string" || typeof value.app.subtitle !== "string") return false;
  if (!Number.isFinite(value.canvas.width) || Number(value.canvas.width) <= 0 ||
      !Number.isFinite(value.canvas.height) || Number(value.canvas.height) <= 0 ||
      !Number.isFinite(value.canvas.camera_scale) || Number(value.canvas.camera_scale) <= 0) return false;
  if (typeof value.path.svg_path !== "string" || value.path.svg_path.trim().length === 0 ||
      !Number.isFinite(value.path.track_width) || Number(value.path.track_width) <= 0) return false;
  if (!Array.isArray(value.nodes) || value.nodes.length === 0 ||
      !Array.isArray(value.status_mapping) || value.status_mapping.length === 0) return false;

  const nodeIds = new Set<string>();
  let previousProgress = -1;
  for (const node of value.nodes) {
    if (!isRecord(node) || typeof node.id !== "string" || node.id.length === 0 || nodeIds.has(node.id) ||
        !Number.isFinite(node.progress) || Number(node.progress) < 0 || Number(node.progress) > 1 ||
        Number(node.progress) < previousProgress ||
        !isRecord(node.position) || !Number.isFinite(node.position.x_percent) ||
        Number(node.position.x_percent) < 0 || Number(node.position.x_percent) > 100 ||
        !Number.isFinite(node.position.y_percent) || Number(node.position.y_percent) < 0 ||
        Number(node.position.y_percent) > 100 || typeof node.title !== "string" ||
        typeof node.description !== "string" || typeof node.type !== "string") return false;
    nodeIds.add(node.id);
    previousProgress = Number(node.progress);

    if (node.details !== undefined) {
      if (!Array.isArray(node.details)) return false;
      for (const detail of node.details) {
        if (!isRecord(detail) || typeof detail.id !== "string" || typeof detail.title !== "string" ||
            typeof detail.icon !== "string" || !Array.isArray(detail.content)) return false;
        for (const content of detail.content) {
          if (!isRecord(content) || typeof content.type !== "string" ||
              (content.sentences !== undefined && !isStringArray(content.sentences)) ||
              (content.items !== undefined && !isStringArray(content.items)) ||
              (content.type === "paragraph" && !isStringArray(content.sentences))) return false;
        }
      }
    }
  }

  let previousStatusMax = -1;
  for (const status of value.status_mapping) {
    if (!isRecord(status) || !Number.isFinite(status.max) || Number(status.max) < previousStatusMax ||
        Number(status.max) < 0 || Number(status.max) > 1 || typeof status.text !== "string") return false;
    previousStatusMax = Number(status.max);
  }
  return true;
};

export const ProjectJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ribbonHeadRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const touchYRef = useRef<number | null>(null);
  
  const [data, setData] = useState<ProjectJourneyData | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  const [progress, setProgress] = useState(0);

  const [status, setStatus] = useState("Planning");
  const [pathLength, setPathLength] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [lockedNode, setLockedNode] = useState<JourneyNode | null>(null);
  const [subScroll, setSubScroll] = useState(0);

  // Fetch JSON data
  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    fetch(`/project-journey.json?t=${new Date().getTime()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Project journey request failed (${res.status})`);
        return res.json();
      })
      .then((json: unknown) => {
        if (!isProjectJourneyData(json)) {
          throw new Error("Project journey data has an invalid shape");
        }
        if (cancelled) return;
        setData(json);
        setStatus(getStatusFromProgress(0, json.status_mapping));
        
        // Generate stable random particles aligned roughly to canvas size
        const generatedParticles: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
          id: i, 
          x: Math.random() * (json.canvas.width * 1.5) - (json.canvas.width * 0.25), 
          y: Math.random() * json.canvas.height - (json.canvas.height * 0.25), 
          size: Math.random() * 3 + 1, 
          opacity: Math.random() * 0.2 + 0.05, 
          speed: Math.random() * 0.5 + 0.2
        }));
        setParticles(generatedParticles);
      })
      .catch(err => {
        console.error("Could not load journey data:", err);
        if (!cancelled) setLoadError(true);
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  // Measure path length safely
  useEffect(() => {
    if (!data) return;
    
    const updateLength = () => {
      if (pathRef.current) {
        try {
          const length = pathRef.current.getTotalLength();
          if (!Number.isFinite(length) || length <= 0) {
            throw new Error("Project journey SVG has no drawable path");
          }
          setPathLength(length);
        } catch (error) {
          console.error("Project journey path is invalid:", error);
          setData(null);
          setLoadError(true);
        }
      }
    };
    
    // Check immediately and also very slightly after paint
    updateLength();
    const timeout = setTimeout(updateLength, 150);
    
    window.addEventListener('resize', updateLength);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateLength);
    };
  }, [data]);

  const advanceJourney = (deltaY: number) => {
    if (!data) return;
    if (deltaY === 0) return;
    
    if (lockedNode) {
      // Sub-scroll logic inside expanded nodes
      const nextSubScroll = subScroll + (deltaY * 0.15); // Adjust sub-scroll speed modifier natively

      if (nextSubScroll > 100) {
        setSubScroll(100);
        setLockedNode(null);
        setProgress(Math.min(1, lockedNode.progress + 0.005)); // Safely nudge forward to unlock
      } else if (nextSubScroll < 0) {
        setSubScroll(0);
        setLockedNode(null);
        setProgress(Math.max(0, lockedNode.progress - 0.005)); // Safely nudge backward to unlock
      } else {
        setSubScroll(nextSubScroll);
      }
      return;
    }

    setProgress(prev => {
      const next = prev + (deltaY * 0.0005);
      let triggerNode: JourneyNode | null = null;
      let startSubScroll = 0;

      // Check bounds dynamically
      for (const node of data.nodes) {
        if (!node.details || node.details.length === 0) continue;
        
        // Forward cross
        if (prev < node.progress && next >= node.progress) {
          triggerNode = node;
          startSubScroll = 0;
          break;
        }
        // Backward cross
        if (prev > node.progress && next <= node.progress) {
          triggerNode = node;
          startSubScroll = 100;
          break;
        }
      }

      if (triggerNode) {
        setLockedNode(triggerNode);
        setSubScroll(startSubScroll);
        return triggerNode.progress; // snap precisely
      }

      return Math.max(0, Math.min(1, next));
    });
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('input[type="range"]')) return;
    advanceJourney(event.deltaY);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('input[type="range"]')) return;
    touchYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('input[type="range"]')) return;
    const currentY = event.touches[0]?.clientY;
    if (currentY === undefined || touchYRef.current === null) return;
    const deltaY = touchYRef.current - currentY;
    touchYRef.current = currentY;
    if (Math.abs(deltaY) >= 2) advanceJourney(deltaY);
  };

  const handleTouchEnd = () => { touchYRef.current = null; };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      advanceJourney(120);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      advanceJourney(-120);
    }
  };

  const handleTimelineChange = (nextProgress: number) => {
    if (!lockedNode) advanceJourney((nextProgress - progress) / 0.0005);
  };

  // Sync camera and ribbon whenever progress changes
  useEffect(() => {
    if (!data) return;

    const p = Math.max(0, Math.min(progress, 1)); // Clamp safely
    
    setStatus(getStatusFromProgress(p, data.status_mapping));

    // Ensure we trigger coordinate updates even initially when length might just be settling, 
    // or fallback to 0 coordinate if SVG isn't ready
    if (worldRef.current && ribbonHeadRef.current && containerRef.current) {
      let drawLength = 0;
      let point = { x: 0, y: 0 };
      
      if (pathRef.current && pathLength > 0) {
        drawLength = pathLength * p;
        pathRef.current.style.strokeDashoffset = (pathLength - drawLength).toString();
        point = pathRef.current.getPointAtLength(Math.max(drawLength, 0.01));
      }

      const CAMERA_SCALE = data.canvas.camera_scale || 1.3;
      
      const { tx, ty } = getCameraTransform(
        point, 
        containerRef.current.clientWidth, 
        containerRef.current.clientHeight, 
        CAMERA_SCALE
      );
      
      worldRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${CAMERA_SCALE})`;
      ribbonHeadRef.current.style.transform = `translate(${point.x}px, ${point.y}px)`;

      if (particlesRef.current) {
        particlesRef.current.style.transform = `translate(${tx * 0.3}px, ${ty * 0.3}px)`;
      }
    }
  }, [progress, pathLength, data]);

  if (!data) {
    if (loadError) {
      return (
        <div role="alert" className="flex min-h-[400px] w-full flex-col items-center justify-center gap-3 bg-slate-50 text-center dark:bg-zinc-950">
          <p className="font-semibold text-zinc-800 dark:text-zinc-100">Project journey could not be loaded.</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
        </div>
      );
    }
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"/>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Interactive project journey"
      aria-describedby="project-journey-help"
      aria-keyshortcuts="ArrowDown ArrowUp ArrowRight ArrowLeft PageDown PageUp"
      tabIndex={0}
      className="relative h-full min-h-[400px] w-full touch-pan-x overflow-hidden bg-zinc-50 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 dark:bg-zinc-950"
    >
      
      {/* Main Widget Layer */}
      <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out opacity-100">
        {/* Organized Background Particles */}
        <JourneyParticles particles={particles} particlesRef={particlesRef} />

        {/* THE MOVING CAMERA WORLD */}
        <div 
          ref={worldRef}
          className="absolute top-0 left-0 origin-top-left will-change-transform transition-all duration-300 ease-out"
          style={{ width: data.canvas.width, height: data.canvas.height }}
        >
          {/* Enhanced Grid Background */}
          <div className="absolute -inset-[4000px] z-0 opacity-[0.05] dark:opacity-[0.1]" 
               style={{ 
                 backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                 backgroundSize: '40px 40px'
               }} 
          />

          {/* Organized SVG Path Engine */}
          <JourneyPath perfectPath={data.path.svg_path} pathLength={pathLength} progress={progress} pathRef={pathRef} strokeWidth={data.path.track_width} width={data.canvas.width} height={data.canvas.height} />

          {/* The pen tip tracking the ribbon (Hidden exactly at 0 to prevent glitch) */}
          <div 
            ref={ribbonHeadRef}
            className={`absolute top-0 left-0 w-[14px] h-[14px] flex items-center justify-center z-30 -mt-[7px] -ml-[7px] bg-white dark:bg-zinc-800 border-[3px] border-emerald-500 rounded-full shadow-[0_0_15px_4px_rgba(16,185,129,0.4)] animate-pulse ${pathLength > 0 && progress > 0.001 ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Organized Project Milestone Nodes with Dynamic Expansions */}
          <JourneyNodes 
            nodes={data.nodes} 
            canvas={data.canvas} 
            progress={progress} 
            lockedNodeId={lockedNode?.id}
            subScroll={subScroll}
          />
          
        </div>

        {/* Organized HUD and Timeline Widget */}
        <JourneyOverlays 
          progress={progress} 
          status={status} 
          onProgressChange={handleTimelineChange}
          progressDisabled={Boolean(lockedNode)}
        />
      </div>

      <style>{`
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};
