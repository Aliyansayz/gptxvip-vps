

import React from 'react';
import { GeminiIcon } from './icons/index';

interface TextSelectionPopoverProps {
    rect: DOMRect;
    onAskAI: () => void;
    onClose: () => void;
}

export const TextSelectionPopover: React.FC<TextSelectionPopoverProps> = ({ rect, onAskAI, onClose }) => {
    const topPosition = rect.top < 50
        ? `${rect.bottom + window.scrollY + 8}px`
        : `${rect.top - 44 + window.scrollY}px`;

    const style: React.CSSProperties = {
        position: 'fixed',
        top: topPosition,
        left: `${rect.left + rect.width / 2 + window.scrollX}px`,
        transform: 'translateX(-50%)',
        zIndex: 50,
    };

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div style={style} className="text-selection-popover bg-popover rounded-full shadow-lg p-1 flex items-center animate-bounce-in">
                <button
                    onClick={onAskAI}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors"
                >
                    <GeminiIcon className="w-5 h-5" />
                    Ask AI
                </button>
            </div>
        </>
    );
};