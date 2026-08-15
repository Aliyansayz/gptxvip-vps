import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export const ZScoreChartWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    // Generate a pseudo-random walk that mean-reverts
    const generateZScoreData = () => {
      const data = [];
      let currentZ = 0;
      for (let i = 0; i < 200; i++) {
        // Mean reversion pull
        const pull = -currentZ * 0.05;
        // Random noise
        const noise = (Math.random() - 0.5) * 0.8;

        // Add some structured moves to hit the bands
        if (i > 30 && i < 50) currentZ += 0.2; // Push up to entry
        if (i > 120 && i < 140) currentZ -= 0.2; // Push down to entry

        currentZ += pull + noise;

        // Cap it
        if (currentZ > 3.5) currentZ = 3.5;
        if (currentZ < -3.5) currentZ = -3.5;

        data.push(currentZ);
      }
      return data;
    };

    const data = generateZScoreData();

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw bands
      const drawBand = (
        z: number,
        color: string,
        label: string,
        dash: number[] = [],
      ) => {
        const y = height / 2 - z * (height / 8);
        ctx.beginPath();
        ctx.setLineDash(dash);
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.font = "10px monospace";
        ctx.fillText(`${label} (${z > 0 ? "+" : ""}${z})`, 5, y - 5);
      };

      // Background bands
      ctx.fillStyle = "rgba(239, 68, 68, 0.05)"; // Red top
      ctx.fillRect(0, 0, width, height / 2 - 2 * (height / 8));

      ctx.fillStyle = "rgba(16, 185, 129, 0.05)"; // Green middle
      ctx.fillRect(0, height / 2 - 0.5 * (height / 8), width, height / 8);

      ctx.fillStyle = "rgba(239, 68, 68, 0.05)"; // Red bottom
      ctx.fillRect(0, height / 2 - -2 * (height / 8), width, height);

      // Draw lines
      drawBand(3.0, "rgba(239, 68, 68, 0.5)", "Stop Loss", [4, 4]);
      drawBand(2.0, "rgba(245, 158, 11, 0.5)", "Entry Short", [2, 2]);
      drawBand(0.5, "rgba(16, 185, 129, 0.5)", "Exit (Mean Reversion)", [2, 2]);
      drawBand(0, "rgba(161, 161, 170, 0.5)", "Mean", []);
      drawBand(
        -0.5,
        "rgba(16, 185, 129, 0.5)",
        "Exit (Mean Reversion)",
        [2, 2],
      );
      drawBand(-2.0, "rgba(245, 158, 11, 0.5)", "Entry Long", [2, 2]);
      drawBand(-3.0, "rgba(239, 68, 68, 0.5)", "Stop Loss", [4, 4]);

      // Draw Z-Score line
      ctx.beginPath();
      ctx.strokeStyle = "#3b82f6"; // Blue line
      ctx.lineWidth = 2;

      const pointSpacing = width / 100;

      for (let i = 0; i < 100; i++) {
        const dataIndex = Math.floor((i + offset) % data.length);
        const z = data[dataIndex];
        const x = i * pointSpacing;
        const y = height / 2 - z * (height / 8);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Highlight entry/exit points
      for (let i = 0; i < 100; i++) {
        const dataIndex = Math.floor((i + offset) % data.length);
        const z = data[dataIndex];
        const x = i * pointSpacing;
        const y = height / 2 - z * (height / 8);

        if (z >= 2.0 || z <= -2.0) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#f59e0b";
          ctx.fill();
        } else if (Math.abs(z) <= 0.5) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#10b981";
          ctx.fill();
        } else if (Math.abs(z) >= 3.0) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#ef4444";
          ctx.fill();
        }
      }

      if (isHovered) {
        offset += 0.2;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return (
    <div
      className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 overflow-hidden relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm">Z-Score Spread Dynamics</h3>
          <p className="text-xs text-zinc-500">
            Hover to animate the mean-reverting spread
          </p>
        </div>
        <div className="flex gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div> Entry
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Exit
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div> Stop
          </div>
        </div>
      </div>

      <div className="relative w-full h-[250px]">
        <canvas
          ref={canvasRef}
          width={800}
          height={250}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};
