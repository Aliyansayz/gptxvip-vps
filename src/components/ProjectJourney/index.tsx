import React, { useRef, useEffect, useState } from "react";
import { JourneyParticles } from "./JourneyParticles";
import { JourneyPath } from "./path";
import { JourneyNodes } from "./nodes";
import { JourneyOverlays } from "./JourneyOverlays";
import { getCameraTransform } from "./camera";
import { getStatusFromProgress } from "./status";
import { ProjectJourneyData, JourneyNode, Particle } from "./types";

export const ProjectJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ribbonHeadRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<ProjectJourneyData | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  const [progress, setProgress] = useState(0);

  const [status, setStatus] = useState("Planning");
  const [activeStep, setActiveStep] = useState<JourneyNode | null>(null);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [pathLength, setPathLength] = useState(0);

  const [lockedNode, setLockedNode] = useState<JourneyNode | null>(null);
  const [subScroll, setSubScroll] = useState(0);

  // Fetch JSON data
  useEffect(() => {
    // Add cache busting timestamp so JSON changes reflect immediately
    fetch(`/project-journey.json?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then((json: ProjectJourneyData) => {
        setData(json);
        setActiveStep(json.nodes[0]);
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
      .catch(err => console.error("Could not load journey data:", err));
  }, []);

  // Measure path length safely
  useEffect(() => {
    if (!data) return;
    
    const updateLength = () => {
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        if (length > 0) {
          setPathLength(length);
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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!data) return;
    
    if (lockedNode) {
      // Sub-scroll logic inside expanded nodes
      const nextSubScroll = subScroll + (e.deltaY * 0.15); // Adjust sub-scroll speed modifier natively

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
      const next = prev + (e.deltaY * 0.0005);
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

  // Sync camera and ribbon whenever progress changes
  useEffect(() => {
    if (!data) return;

    const p = Math.max(0, Math.min(progress, 1)); // Clamp safely
    
    setStatus(getStatusFromProgress(p, data.status_mapping));

    const newActiveNodes = data.nodes
      .filter(step => p >= step.progress)
      .map(step => step.id);
    setActiveNodes(newActiveNodes);

    const currentStepIndex = [...data.nodes].reverse().findIndex(s => p >= s.progress);
    const currentActive = data.nodes[data.nodes.length - 1 - (currentStepIndex === -1 ? 0 : currentStepIndex)] || data.nodes[0];
    setActiveStep(currentActive);

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
      className="relative w-full h-full min-h-[400px] overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500"
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
