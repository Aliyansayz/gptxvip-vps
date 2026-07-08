import React, { useEffect, useRef } from 'react';
import './HomeView.css';

interface HomeViewProps {
    onNavigate: (view: 'lab' | 'medlab') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
    const sceneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sceneRef.current) return;

        const sceneContainer = sceneRef.current;
        // Clear previous content if any
        sceneContainer.innerHTML = '';

        const helix = document.createElement('div');
        helix.className = 'helix-container';

        const numSegments = 50; // Increased for a denser, smoother look
        const spacing = 12;

        for (let i = 0; i < numSegments; i++) {
            const segment = document.createElement('div');
            segment.className = 'segment';

            const xPos = i * spacing;
            const rotation = i * 12; // Adjusted for a tighter spiral

            // Apply a slight skew logic as requested
            let skewValue = 0;
            const threshold = numSegments * 0.4;
            if (i < threshold) {
                skewValue = (threshold - i) * 1.5;
            }

            // Centralize the helix and apply initial transforms
            segment.style.transform = `translateX(${xPos - (numSegments * spacing / 2)}px) rotateX(${rotation}deg) skewY(${skewValue}deg)`;

            // Top Dot
            const dot1 = document.createElement('div');
            dot1.className = 'line-link';
            dot1.style.transform = `translateZ(40px)`;

            // Bottom Dot
            const dot2 = document.createElement('div');
            dot2.className = 'line-link';
            dot2.style.transform = `translateZ(-40px)`;
            dot2.style.background = 'var(--secondary-glow)';
            dot2.style.boxShadow = '0 0 10px var(--secondary-glow)';

            // Connecting Line
            const connector = document.createElement('div');
            connector.className = 'connector';
            connector.style.background = `linear-gradient(to bottom, var(--primary-glow), var(--secondary-glow))`;

            segment.appendChild(connector);
            segment.appendChild(dot1);
            segment.appendChild(dot2);
            helix.appendChild(segment);
        }

        sceneContainer.appendChild(helix);
    }, []);

    return (
        <div className="home-view-container">
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">MedCush</h1>
                        <div className="hero-badge">Multipurpose Ed and Research App</div>
                        <p className="hero-description">
                            Master complex ideas through an <strong>analogical style of learning</strong> at the speed of
                            thought. Our AI-driven notebook acts as your intellectual super-resource, translating dense research
                            into intuitive, actionable insights.
                        </p>
                        <div className="hero-actions">
                            <button onClick={() => onNavigate('lab')} className="btn btn-primary">Get Started</button>
                            <button className="btn btn-secondary">Watch Demo</button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="transform-wrapper">
                            <div className="scene" ref={sceneRef} id="helix-scene">
                                {/* DNA Helix injected here */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
