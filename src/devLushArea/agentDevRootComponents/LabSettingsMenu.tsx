
import React, { useState } from 'react';
import { Settings, X, Check } from 'lucide-react';

export interface LabSettings {
    disableQuestion: boolean;
    hideQuestionDefault: boolean;
    hideTheoryDefault: boolean;
    disableTheory: boolean;
    rememberSettings: boolean;
}

export const DEFAULT_SETTINGS: LabSettings = {
    disableQuestion: false,
    hideQuestionDefault: false,
    hideTheoryDefault: false,
    disableTheory: false,
    rememberSettings: false,
};

export const loadSavedSettings = (): LabSettings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
        const saved = window.localStorage.getItem('labSettings');
        if (!saved || saved.trim() === '') return DEFAULT_SETTINGS;
        const parsed: unknown = JSON.parse(saved);
        if (!parsed || typeof parsed !== 'object') return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...parsed } as LabSettings;
    } catch {
        return DEFAULT_SETTINGS;
    }
};

interface LabSettingsMenuProps {
    settings: LabSettings;
    onSettingsChange: (settings: LabSettings) => void;
}

export const LabSettingsMenu: React.FC<LabSettingsMenuProps> = ({ settings, onSettingsChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (key: keyof LabSettings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        
        // If "remember settings" is toggled off, clear storage
        try {
            if (key === 'rememberSettings' && !newSettings.rememberSettings) {
                window.localStorage.removeItem('labSettings');
            } else if (newSettings.rememberSettings) {
                window.localStorage.setItem('labSettings', JSON.stringify(newSettings));
            }
        } catch {
            // Settings still apply for this session when browser storage is unavailable.
        }

        onSettingsChange(newSettings);
    };

    return (
        <div className="relative z-50">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)} 
                aria-label="Lab settings"
                aria-expanded={isOpen}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                title="Lab Settings"
            >
                <Settings className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-60 overflow-hidden rounded-xl border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-200 sm:w-72 lg:left-auto lg:right-0">
                    <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Lab Settings</h3>
                        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close lab settings" className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-2 space-y-1">
                        <SettingItem 
                            label="Disable Question" 
                            checked={settings.disableQuestion} 
                            onChange={() => handleToggle('disableQuestion')} 
                        />
                        <SettingItem 
                            label="Hide Question by Default" 
                            checked={settings.hideQuestionDefault} 
                            onChange={() => handleToggle('hideQuestionDefault')} 
                        />
                        <div className="h-px bg-border mx-2 my-1" />
                        <SettingItem 
                            label="Keep Theory Hidden by Default" 
                            checked={settings.hideTheoryDefault} 
                            onChange={() => handleToggle('hideTheoryDefault')} 
                        />
                        <SettingItem 
                            label="Disable Theory Pane" 
                            checked={settings.disableTheory} 
                            onChange={() => handleToggle('disableTheory')} 
                        />
                        <div className="h-px bg-border mx-2 my-1" />
                        <SettingItem 
                            label="Remember My Settings" 
                            checked={settings.rememberSettings} 
                            onChange={() => handleToggle('rememberSettings')} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const SettingItem: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <button 
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className="flex min-h-11 w-full items-center justify-between rounded-lg p-2 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
        <span className="text-foreground/80">{label}</span>
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
            {checked && <Check className="w-3 h-3" />}
        </div>
    </button>
);
