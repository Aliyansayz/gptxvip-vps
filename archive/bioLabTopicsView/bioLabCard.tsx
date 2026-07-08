import React, { useState, useRef, useMemo } from 'react';
import { Exercise, Difficulty } from '../../types';

import {
    PlayIcon,
    BookIcon,
    LockIcon,
    ArrowRightIcon,
    CheckIcon,
} from '../icons';
import { difficultyColors } from '../../constants/ui';

interface BioLabTopicsCardProps {
    concept: Exercise;
    onStart: () => void;
    isLocked: boolean;
    isCompleted?: boolean;
    colorScheme?: {
        gradient: string;
        iconBg: string;
        iconText: string;
        textHover?: string;
    };
}

const BioLabTopicsCard: React.FC<BioLabTopicsCardProps> = ({
    concept,
    onStart,
    isLocked,
    isCompleted = false,
    colorScheme,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [glowOpacity, setGlowOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isLocked || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMouse({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const glowColor = useMemo(() => {
        if (colorScheme?.gradient?.includes('green')) {
            return 'rgba(16, 185, 129, 0.4)';
        }
        return 'rgba(168, 85, 247, 0.4)';
    }, [colorScheme]);

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => !isLocked && setGlowOpacity(1)}
            onMouseLeave={() => !isLocked && setGlowOpacity(0)}
            className={`group relative overflow-hidden rounded-2xl p-[2px] transition-all duration-300
        ${isLocked ? 'opacity-60 saturate-50' : 'hover:-translate-y-1 hover:shadow-xl'}
      `}
        >
            {/* Glow */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                    opacity: isLocked ? 0 : glowOpacity,
                    background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, ${glowColor}, transparent 40%)`,
                }}
            />

            <div className="relative z-10 bg-card rounded-[14px] p-6 flex flex-col h-full">
                {/* Lock Overlay */}
                {isLocked && (
                    <div className="absolute inset-0 bg-card/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <LockIcon className="w-10 h-10 text-muted-foreground" />
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <span
                        className={`p-2 rounded-lg ${colorScheme?.iconBg ?? 'bg-primary/10'
                            } ${colorScheme?.iconText ?? 'text-primary'}`}
                    >
                        <BookIcon className="w-6 h-6" />
                    </span>

                    <div className="flex-1">
                        <h3
                            className={`font-bold text-lg leading-tight text-card-foreground ${colorScheme?.textHover ?? ''
                                } transition-colors`}
                        >
                            {concept.title}
                        </h3>

                        <div className="flex gap-2 mt-1">
                            {concept.difficulty && (
                                <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColors[concept.difficulty]}`}
                                >
                                    {concept.difficulty}
                                </span>
                            )}

                            {isCompleted && (
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-success/10 text-success flex items-center gap-1">
                                    <CheckIcon className="w-3 h-3" /> Done
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Prompt */}
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {concept.prompt}
                </p>

                {/* Concept */}
                <div className="bg-muted p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold text-secondary-foreground">
                        Concept Tested:
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {concept.concept_tested}
                    </p>
                </div>

                {/* Action */}
                <button
                    onClick={onStart}
                    disabled={isLocked}
                    className={`mt-auto w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold
            text-primary-foreground bg-[size:200%_auto] animate-animated-gradient-bg
            ${colorScheme?.gradient ?? 'bg-gradient-accent'}
            disabled:opacity-50 disabled:cursor-not-allowed
            group-hover:shadow-md transition-all`}
                >
                    {isLocked ? (
                        <>
                            <LockIcon className="w-5 h-5" /> Locked
                        </>
                    ) : isCompleted ? (
                        'Review Activity'
                    ) : (
                        <>
                            <PlayIcon className="w-5 h-5" /> Launch Activity
                            <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default BioLabTopicsCard;