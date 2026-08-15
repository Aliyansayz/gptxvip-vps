import React, { useEffect, useRef } from "react";

export const HeroCandlestickChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      for (let i = 0; i < 400; i++) {
        // Mean reversion pull
        const pull = -currentZ * 0.05;
        // Random noise
        const noise = (Math.random() - 0.5) * 0.8;

        // Add some structured moves to hit the bands
        if (i > 30 && i < 60) currentZ += 0.15; // Push up to entry
        if (i > 150 && i < 180) currentZ -= 0.15; // Push down to entry

        currentZ += pull + noise;

        // Cap it
        if (currentZ > 3.5) currentZ = 3.5;
        if (currentZ < -3.5) currentZ = -3.5;

        data.push(currentZ);
      }
      return data;
    };

    const data = generateZScoreData();

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
      }
    };

    const animateLoop = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

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
        ctx.font = "12px monospace";
        ctx.fillText(`${label} (${z > 0 ? "+" : ""}${z})`, 15, y - 8);
      };

      // Background bands
      ctx.fillStyle = "rgba(255, 255, 255, 0.01)"; // Clean top
      ctx.fillRect(0, 0, width, height / 2 - 2 * (height / 8));

      ctx.fillStyle = "rgba(34, 211, 238, 0.03)"; // Cyan middle
      ctx.fillRect(0, height / 2 - 0.5 * (height / 8), width, height / 8);

      ctx.fillStyle = "rgba(255, 255, 255, 0.01)"; // Clean bottom
      ctx.fillRect(0, height / 2 - -2 * (height / 8), width, height);

      // Draw lines
      drawBand(3.0, "rgba(255, 255, 255, 0.2)", "Stop Loss", [4, 4]);
      drawBand(2.0, "rgba(245, 158, 11, 0.4)", "Entry Short", [2, 2]);
      drawBand(0.5, "rgba(34, 211, 238, 0.4)", "Exit (Mean Reversion)", [2, 2]);
      drawBand(0, "rgba(255, 255, 255, 0.2)", "Mean", []);
      drawBand(
        -0.5,
        "rgba(34, 211, 238, 0.4)",
        "Exit (Mean Reversion)",
        [2, 2],
      );
      drawBand(-2.0, "rgba(245, 158, 11, 0.4)", "Entry Long", [2, 2]);
      drawBand(-3.0, "rgba(255, 255, 255, 0.2)", "Stop Loss", [4, 4]);

      // Draw Z-Score line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(34, 211, 238, 0.8)"; // Cyan line
      ctx.lineWidth = 2.5;

      const numPoints = 150;
      const pointSpacing = width / (numPoints - 1);

      for (let i = 0; i < numPoints; i++) {
        const dataIndex = Math.floor((i + offset) % data.length);
        const z = data[dataIndex];
        const x = i * pointSpacing;
        const y = height / 2 - z * (height / 8);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Highlight exit/mean points
      ctx.fillStyle = "rgba(34, 211, 238, 1)"; // Cyan points for exit/mean
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const dataIndex = Math.floor((i + offset) % data.length);
        const z = data[dataIndex];
        if (Math.abs(z) <= 0.5) {
          const x = i * pointSpacing;
          const y = height / 2 - z * (height / 8);
          ctx.moveTo(x + 3, y);
          ctx.arc(x, y, 3, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // Removed mismatching red dots

      offset += 0.45; // Increased speed
      animationFrameId = requestAnimationFrame(animateLoop);
    };

    window.addEventListener("resize", resize);
    setTimeout(resize, 50); // Initial draw
    animationFrameId = requestAnimationFrame(animateLoop);

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-60">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
