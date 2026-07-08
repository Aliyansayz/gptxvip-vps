import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Sun, Moon, Zap, Infinity as InfinityIcon, Settings, MessageSquare as ChatIcon, Map, Library, LogOut } from 'lucide-react';

type Theme = 'light' | 'dark';
type View = 'roadmap' | 'topic-theory';

interface RoadmapNavbarProps {
    isAppLocked: boolean;
    onToggleLockMode: () => void;
    theme: Theme;
    onToggleTheme: () => void;
    studyEnergy: number;
    isInfiniteEnergy: boolean;
    onToggleInfiniteEnergy: () => void;
    energyLockoutTime: number;
    currentView: View;
    onViewChange: (view: View) => void;
    focusMode: boolean;
    onToggleFocusMode: () => void;
    showAiAssistant: boolean;
    onToggleAiAssistant: () => void;
    onExit?: () => void;
}

const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

interface ToggleSwitchProps {
    label: string;
    isOn: boolean;
    onToggle: () => void;
    onIcon: React.ReactNode;
    offIcon: React.ReactNode;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, isOn, onToggle, onIcon, offIcon }) => (
    <div className="flex items-center justify-between w-full">
        <label htmlFor={`toggle-${label}`} className="text-sm font-medium text-slate-300 flex items-center gap-2">
            {isOn ? onIcon : offIcon}
            {label}
        </label>
        <button
            id={`toggle-${label}`}
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-green-500' : 'bg-slate-700'}`}
            role="switch"
            aria-checked={isOn}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    </div>
);

const EnergyBeam: React.FC<{ studyEnergy: number; isInfinite: boolean; lockoutRemaining: number }> = ({ studyEnergy, isInfinite, lockoutRemaining }) => {
    const maxEnergy = 15;
    const percentage = isInfinite ? 100 : (studyEnergy / maxEnergy) * 100;
    const isLocked = !isInfinite && studyEnergy <= 0 && lockoutRemaining > 0;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-green-400">Study Energy</span>
                {isLocked ? (
                    <span className="font-mono text-red-500">{formatTime(lockoutRemaining)}</span>
                ) : isInfinite ? (
                    <InfinityIcon className="w-4 h-4 text-green-400" />
                ) : (
                    <span className="font-semibold text-green-400">{studyEnergy} / {maxEnergy}</span>
                )}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${isLocked ? 'bg-red-500' : isInfinite ? 'bg-green-400 animate-pulse' : 'bg-blue-500'}`}
                    style={{ width: isLocked ? '100%' : `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export const RoadmapNavbar: React.FC<RoadmapNavbarProps> = ({
    isAppLocked,
    onToggleLockMode,
    theme,
    onToggleTheme,
    studyEnergy,
    isInfiniteEnergy,
    onToggleInfiniteEnergy,
    energyLockoutTime,
    currentView,
    onViewChange,
    focusMode,
    onToggleFocusMode,
    showAiAssistant,
    onToggleAiAssistant,
    onExit,
}) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [lockoutRemaining, setLockoutRemaining] = useState(energyLockoutTime - Date.now());
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = energyLockoutTime - Date.now();
            setLockoutRemaining(remaining > 0 ? remaining : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [energyLockoutTime]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const baseButtonClass = "px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-2";

    const getButtonStyle = (viewName: View) => {
        const isActive = currentView === viewName;
        
        if (isActive) return 'bg-blue-900 text-green-400 shadow-md border border-blue-800';
        return 'text-slate-400 hover:bg-slate-900 hover:text-green-400 border border-transparent';
    };

    const navBgColor = 'bg-black/60 backdrop-blur-md border border-blue-900/50';

    return (
        <nav className="absolute top-0 left-0 w-full z-50 bg-transparent p-2 flex justify-between items-center">
            <div className={`flex items-center p-1 rounded-full shadow-lg gap-2 overflow-hidden ${navBgColor}`}>
                {/* Main Nav Group */}
                <div className="flex items-center gap-2">
                    <button onClick={() => onViewChange('roadmap')} className={`${baseButtonClass} ${getButtonStyle('roadmap')}`}>
                        <Map className="w-4 h-4" />
                        Roadmap
                    </button>
                    <button onClick={() => onViewChange('topic-theory')} className={`${baseButtonClass} ${getButtonStyle('topic-theory')}`} title="Topic Theory Library">
                        <Library className="w-4 h-4" />
                        Topic Theory
                    </button>
                    
                    {onExit && (
                        <button 
                            onClick={onExit}
                            className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-md text-sm font-semibold transition-all shadow-sm ml-2 flex items-center gap-1"
                            title="Exit Roadmap Area"
                        >
                            <LogOut className="w-4 h-4" />
                            Exit
                        </button>
                    )}
                </div>
            </div>

            <div ref={settingsRef} className="relative mr-2">
                <button
                    onClick={() => setIsSettingsOpen(prev => !prev)}
                    className={`p-2 rounded-full backdrop-blur-md border border-blue-900 hover:bg-slate-900 transition-colors bg-black/60 shadow-lg`}
                    title="Settings"
                >
                    <Settings className={`w-5 h-5 text-green-400`} />
                </button>

                {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl rounded-xl border border-blue-900 shadow-2xl z-50 p-4">
                        <div className="space-y-4">
                            <ToggleSwitch
                                label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                isOn={theme === 'dark'}
                                onToggle={onToggleTheme}
                                onIcon={<Moon className="w-4 h-4 text-green-400" />}
                                offIcon={<Sun className="w-4 h-4 text-slate-400" />}
                            />
                            <ToggleSwitch
                                label="Manual Lock"
                                isOn={isAppLocked}
                                onToggle={onToggleLockMode}
                                onIcon={<Lock className="w-4 h-4 text-red-500" />}
                                offIcon={<Unlock className="w-4 h-4 text-slate-400" />}
                            />
                            <ToggleSwitch
                                label="Focus Mode"
                                isOn={focusMode}
                                onToggle={onToggleFocusMode}
                                onIcon={<Zap className="w-4 h-4 text-green-400" />}
                                offIcon={<Zap className="w-4 h-4 text-slate-400" />}
                            />
                            <ToggleSwitch
                                label="AI Assistant"
                                isOn={showAiAssistant}
                                onToggle={onToggleAiAssistant}
                                onIcon={<ChatIcon className="w-4 h-4 text-green-400" />}
                                offIcon={<ChatIcon className="w-4 h-4 text-slate-400" />}
                            />
                            <div className="border-t border-blue-900/50 !mt-4 !mb-2" />
                            <ToggleSwitch
                                label="Infinite Energy"
                                isOn={isInfiniteEnergy}
                                onToggle={onToggleInfiniteEnergy}
                                onIcon={<InfinityIcon className="w-4 h-4 text-green-400" />}
                                offIcon={<Zap className="w-4 h-4 text-slate-400" />}
                            />
                            <EnergyBeam
                                studyEnergy={studyEnergy}
                                isInfinite={isInfiniteEnergy}
                                lockoutRemaining={lockoutRemaining}
                            />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
