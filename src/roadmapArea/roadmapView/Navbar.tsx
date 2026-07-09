import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Sun, Moon, Zap, Infinity as InfinityIcon, Settings, MessageSquare as ChatIcon, Map, Library, LogOut } from 'lucide-react';
// Note: Assuming a StarIcon is needed if we add favorites later, but we use Lucide icons here.

type Theme = 'light' | 'dark';
type View = 'roadmap' | 'topic-theory';

interface NavbarProps {
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
        <label htmlFor={`toggle-${label}`} className="text-sm font-medium text-slate-900 flex items-center gap-2">
            {isOn ? onIcon : offIcon}
            {label}
        </label>
        <button
            id={`toggle-${label}`}
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${isOn ? 'bg-primary' : 'bg-muted'}`}
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
            <div className="flex justify-between items-center text-xs text-slate-600">
                <span className="font-semibold">Study Energy</span>
                {isLocked ? (
                    <span className="font-mono text-destructive">{formatTime(lockoutRemaining)}</span>
                ) : isInfinite ? (
                    <InfinityIcon className="w-4 h-4" />
                ) : (
                    <span className="font-semibold">{studyEnergy} / {maxEnergy}</span>
                )}
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${isLocked ? 'bg-destructive' : isInfinite ? 'bg-primary animate-pulse' : 'bg-yellow-500'}`}
                    style={{ width: isLocked ? '100%' : `${percentage}%` }}
                />
            </div>
        </div>
    );
};


const Navbar: React.FC<NavbarProps> = ({
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

    const getButtonStyle = (viewName: View, variant: 'default' | 'special' = 'default') => {
        const isActive = currentView === viewName;
        
        if (viewName === 'roadmap') {
             if (isActive) return 'bg-indigo-600 text-white shadow-md';
             return 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30';
        }

        if (variant === 'special') {
            if (isActive) return 'bg-teal-600 text-white shadow-md';
            return 'text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30';
        }
        
        if (isActive) return 'bg-primary text-primary-foreground shadow-md';
        return 'text-muted-foreground hover:bg-muted hover:text-foreground';
    };

    const navTextColor = 'text-slate-200';
    const navBgColor = 'bg-slate-950 border-slate-800';

    return (
        <nav className={`w-full flex-shrink-0 z-50 flex items-center justify-between px-4 py-2 backdrop-blur-md border-b shadow-sm ${navBgColor}`}>
            {/* Left side empty space to balance right side settings */}
            <div className="flex-1" />

            <div className="flex items-center justify-center gap-4">
                {/* Main Nav Group */}
                <div className="flex items-center gap-1">
                    <button onClick={() => onViewChange('roadmap')} className={`${baseButtonClass} ${getButtonStyle('roadmap')}`}>
                        <Map className="w-4 h-4" />
                        Roadmap
                    </button>
                    <button onClick={() => onViewChange('topic-theory')} className={`${baseButtonClass} ${getButtonStyle('topic-theory', 'special')}`} title="Topic Theory Library">
                        <Library className="w-4 h-4" />
                        Topic Theory
                    </button>
                    
                    {onExit && (
                        <button 
                            onClick={onExit}
                            className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white rounded-md text-sm font-semibold transition-all shadow-sm ml-1 flex items-center gap-1"
                            title="Exit Roadmap Area"
                        >
                            <LogOut className="w-4 h-4" />
                            Exit
                        </button>
                    )}
                </div>
            </div>

            {/* Settings button on the right */}
            <div className="flex-1 flex justify-end">
                <div ref={settingsRef} className="relative">
                    <button
                        onClick={() => setIsSettingsOpen(prev => !prev)}
                        className="p-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors shadow-sm bg-slate-900"
                        title="Settings"
                    >
                        <Settings className={`w-4 h-4 ${navTextColor}`} />
                    </button>

                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-lg border border-slate-200 shadow-xl z-50 p-4 animate-fade-in-down">
                        <div className="space-y-4">
                            <ToggleSwitch
                                label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                isOn={theme === 'dark'}
                                onToggle={onToggleTheme}
                                onIcon={<Moon className="w-4 h-4 text-slate-500" />}
                                offIcon={<Sun className="w-4 h-4 text-slate-500" />}
                            />
                            <ToggleSwitch
                                label="Manual Lock"
                                isOn={isAppLocked}
                                onToggle={onToggleLockMode}
                                onIcon={<Lock className="w-4 h-4 text-red-500" />}
                                offIcon={<Unlock className="w-4 h-4 text-slate-500" />}
                            />
                            <ToggleSwitch
                                label="Focus Mode"
                                isOn={focusMode}
                                onToggle={onToggleFocusMode}
                                onIcon={<Zap className="w-4 h-4 text-yellow-500" />}
                                offIcon={<Zap className="w-4 h-4 text-slate-500" />}
                            />
                            <ToggleSwitch
                                label="AI Assistant"
                                isOn={showAiAssistant}
                                onToggle={onToggleAiAssistant}
                                onIcon={<ChatIcon className="w-4 h-4 text-indigo-600" />}
                                offIcon={<ChatIcon className="w-4 h-4 text-slate-500" />}
                            />
                            <div className="border-t border-border !mt-4 !mb-2" />
                            <ToggleSwitch
                                label="Infinite Energy"
                                isOn={isInfiniteEnergy}
                                onToggle={onToggleInfiniteEnergy}
                                onIcon={<InfinityIcon className="w-4 h-4 text-indigo-600" />}
                                offIcon={<Zap className="w-4 h-4 text-slate-500" />}
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
            </div>
        </nav>
    );
};

export default Navbar;
