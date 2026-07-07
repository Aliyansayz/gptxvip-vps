
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
    const saved = localStorage.getItem('labSettings');
    return (saved && saved.trim() !== '') ? JSON.parse(saved) : DEFAULT_SETTINGS;
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
        if (key === 'rememberSettings' && !newSettings.rememberSettings) {
            localStorage.removeItem('labSettings');
        } 
        // If "remember settings" is on (or turned on), save
        else if (newSettings.rememberSettings) {
            localStorage.setItem('labSettings', JSON.stringify(newSettings));
        }

        onSettingsChange(newSettings);
    };

    return (
        <div className="relative z-50">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`p-2 rounded-md transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                title="Lab Settings"
            >
                <Settings className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-card border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Lab Settings</h3>
                        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
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
        onClick={onChange}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
    >
        <span className="text-foreground/80">{label}</span>
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
            {checked && <Check className="w-3 h-3" />}
        </div>
    </button>
);
