import React, { useEffect, useRef } from 'react';

export const SpacetimeBackground: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        const container = containerRef.current;
        if (!svg || !container) return;

        // Increased grid density (roughly 3x more lines)
        const gridXCount = 61;
        const gridYCount = 31;
        const influenceRadius = 50;
        const maxDeformation = 20;
        
        // Variable to disable the hover effect on the grid
        const disableHoverEffect = true;

        let mouseX = -1000;
        let mouseY = -1000;

        const blackHoles: any[] = [];

        // Reduced random offset scale from 5 to 2 to prevent line crossover in denser grid
        const horizontalOffsets = Array.from({ length: gridYCount }).map(() => (Math.random() - 0.5) * 2);
        const verticalOffsets = Array.from({ length: gridXCount }).map(() => (Math.random() - 0.5) * 2);

        // Thinner stroke (0.3) and slightly lower opacity for denser grid
        const horizontalPaths = Array.from({ length: gridYCount }).map(() => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke', 'rgba(0, 0, 0, 0.1)'); // Lighter stroke for background
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-width', '0.2');
            svg.appendChild(path);
            return path;
        });

        const verticalPaths = Array.from({ length: gridXCount }).map(() => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke', 'rgba(0, 0, 0, 0.1)'); // Lighter stroke for background
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-width', '0.2');
            svg.appendChild(path);
            return path;
        });

        const handleMouseMove = (e: MouseEvent) => {
            if (disableHoverEffect) return;
            const rect = svg.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width) * 200;
            mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        };

        const handleMouseLeave = () => {
            mouseX = -1000;
            mouseY = -1000;
        };

        const handleClick = (e: MouseEvent) => {
            const rect = svg.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * 200;
            const clickY = ((e.clientY - rect.top) / rect.height) * 100;
            createBlackHole(clickX, clickY);
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
        svg.addEventListener('click', handleClick);

        function createBlackHole(x: number, y: number) {
            const blackHole = {
                x,
                y,
                strength: 30,
                radius: 30,
                life: 1,
                element: null as SVGCircleElement | null,
            };
            blackHoles.push(blackHole);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', String(x));
            circle.setAttribute('cy', String(y));
            circle.setAttribute('r', '0');
            circle.setAttribute('fill', 'rgba(0, 0, 0, 0.1)');
            circle.setAttribute('stroke', 'rgba(0,0,0,0.2)');
            circle.setAttribute('stroke-width', '0.2');
            svg.appendChild(circle);
            blackHole.element = circle;
        }

        function getDeformation(x: number, y: number, influenceX: number, influenceY: number, influenceRadius: number, maxDeformation: number) {
            const dx = x - influenceX;
            const dy = y - influenceY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < influenceRadius) {
                const normalizedDist = dist / influenceRadius;
                const deformation = (1 - Math.pow(normalizedDist, 2)) * maxDeformation;
                return {
                    dx: (dx / dist) * deformation,
                    dy: (dy / dist) * deformation
                };
            }
            return { dx: 0, dy: 0 };
        }

        let animationFrameId: number;
        function animateGrid() {
            for (let i = blackHoles.length - 1; i >= 0; i--) {
                const bh = blackHoles[i];
                bh.life -= 0.005;
                if (bh.life <= 0) {
                    bh.element?.remove();
                    blackHoles.splice(i, 1);
                } else {
                    bh.strength = 30 * bh.life;
                    bh.radius = 30 * bh.life;
                    bh.element?.setAttribute('r', String(5 * (1 - bh.life)));
                    bh.element?.setAttribute('opacity', String(bh.life));
                }
            }

            horizontalPaths.forEach((path, i) => {
                const y = i * (100 / (gridYCount - 1));
                const yOffset = horizontalOffsets[i];

                let totalDeformationY1 = 0;
                let totalDeformationY2 = 0;

                const mouseDeformation1 = getDeformation(50, y, mouseX, mouseY, influenceRadius, maxDeformation);
                totalDeformationY1 += mouseDeformation1.dy;
                const mouseDeformation2 = getDeformation(150, y, mouseX, mouseY, influenceRadius, maxDeformation);
                totalDeformationY2 += mouseDeformation2.dy;

                blackHoles.forEach(bh => {
                    const bhDeformation1 = getDeformation(50, y, bh.x, bh.y, bh.radius, bh.strength);
                    totalDeformationY1 += bhDeformation1.dy;
                    const bhDeformation2 = getDeformation(150, y, bh.x, bh.y, bh.radius, bh.strength);
                    totalDeformationY2 += bhDeformation2.dy;
                });

                path.setAttribute('d', `M 0 ${y} C 50 ${y + yOffset + totalDeformationY1}, 150 ${y + yOffset + totalDeformationY2}, 200 ${y}`);
            });

            verticalPaths.forEach((path, i) => {
                const x = i * (200 / (gridXCount - 1));
                const xOffset = verticalOffsets[i];
                
                let totalDeformationX1 = 0;
                let totalDeformationX2 = 0;

                const mouseDeformation1 = getDeformation(x, 25, mouseX, mouseY, influenceRadius, maxDeformation);
                totalDeformationX1 += mouseDeformation1.dx;
                const mouseDeformation2 = getDeformation(x, 75, mouseX, mouseY, influenceRadius, maxDeformation);
                totalDeformationX2 += mouseDeformation2.dx;

                blackHoles.forEach(bh => {
                    const bhDeformation1 = getDeformation(x, 25, bh.x, bh.y, bh.radius, bh.strength);
                    totalDeformationX1 += bhDeformation1.dx;
                    const bhDeformation2 = getDeformation(x, 75, bh.x, bh.y, bh.radius, bh.strength);
                    totalDeformationX2 += bhDeformation2.dx;
                });

                path.setAttribute('d', `M ${x} 0 C ${x + xOffset + totalDeformationX1} 25, ${x + xOffset + totalDeformationX2} 75, ${x} 100`);
            });

            animationFrameId = requestAnimationFrame(animateGrid);
        }

        animateGrid();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
            if (svg) {
                svg.removeEventListener('click', handleClick);
                while (svg.firstChild) {
                    svg.removeChild(svg.firstChild);
                }
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 w-full h-full bg-slate-50 overflow-hidden pointer-events-none z-0">
            <svg ref={svgRef} className="w-full h-full opacity-60 pointer-events-auto" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice"></svg>
        </div>
    );
};
