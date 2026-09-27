

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GeminiIcon } from './icons/index';

interface TextSelectionPopoverProps {
    rect: DOMRect;
    onAskAI: () => void;
    onClose: () => void;
}

export const TextSelectionPopover: React.FC<TextSelectionPopoverProps> = ({ rect, onAskAI, onClose }) => {
    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    const topPosition = rect.top < 50
        ? `${rect.bottom + 8}px`
        : `${rect.top - 44}px`;

    const style: React.CSSProperties = {
        position: 'fixed',
        top: topPosition,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
        zIndex: 50,
    };

    return (
        <>
            <div className="fixed inset-0 z-40" aria-hidden="true" onClick={onClose} />
            <div style={style} className="text-selection-popover bg-popover rounded-full shadow-lg p-1 flex items-center animate-bounce-in">
                <button
                    type="button"
                    onClick={onAskAI}
                    className="flex min-h-11 items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <GeminiIcon className="w-5 h-5" />
                    Ask AI
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Close text selection actions"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </>
    );
};
