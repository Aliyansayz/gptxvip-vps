import React from "react";
import { Particle } from "./types";

interface Props {
  particles: Particle[];
  particlesRef: React.RefObject<HTMLDivElement | null>;
}

export const JourneyParticles: React.FC<Props> = ({ particles, particlesRef }) => {
  return (
    <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-0 will-change-transform">
      {particles.map((p) => (
        <div 
          key={p.id}
          className="absolute bg-emerald-500 rounded-full"
          style={{ 
            left: p.x, 
            top: p.y, 
            width: p.size, 
            height: p.size, 
            opacity: p.opacity 
          }}
        />
      ))}
    </div>
  );
};
