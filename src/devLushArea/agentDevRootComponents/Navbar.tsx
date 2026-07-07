
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Sun, Moon, Zap, Infinity, Settings, MessageSquare as ChatIcon, Library, Search } from 'lucide-react';
import { StarIcon } from './icons';

type Theme = 'light' | 'dark';
type View = 'devlush-search' | 'reading' | 'articles' | 'favorites' | 'topic-theory' | 'devlush' | 'agent-workspace';

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
        <label htmlFor={`toggle-${label}`} className="text-sm font-medium text-foreground flex items-center gap-2">
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
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="font-semibold">Study Energy</span>
                {isLocked ? (
                    <span className="font-mono text-destructive">{formatTime(lockoutRemaining)}</span>
                ) : isInfinite ? (
                    <Infinity className="w-4 h-4" />
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

    const getButtonStyle = (viewName: View, variant: 'default' | 'med' | 'special' = 'default') => {
        const isActive = currentView === viewName;
        
        if (viewName === 'devlush') {
             if (isActive) return 'bg-indigo-600 text-white shadow-md';
             return 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30';
        }

        if (viewName === 'agent-workspace') {
            if (isActive) return 'bg-orange-500 text-white shadow-md';
            return 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30';
        }


        if (variant === 'special') {
            if (isActive) return 'bg-teal-600 text-white shadow-md';
            return 'text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30';
        }
        
        // Default (Bio/General)
        if (isActive) return 'bg-primary text-primary-foreground shadow-md';
        

        return 'text-muted-foreground hover:bg-muted hover:text-foreground';
    };

    const getTitle = () => {
        if (currentView === 'favorites') return 'Favorites';
        if (currentView === 'topic-theory') return 'Topic Theory';
        if (currentView === 'devlush') return 'devLush Topics';
        if (currentView === 'devlush-search') return 'Search devLush';
        if (currentView === 'agent-workspace') return 'Agent Workspace';
        return 'devLush';
    };

    const navTextColor = 'text-foreground';
    const navBgColor = 'bg-background/50 border-border/50';
    const titleColor = 'text-primary';

    return (
        <nav className="absolute top-0 left-0 w-full z-50 bg-transparent p-2 flex justify-between items-center">
            <div className="flex items-center gap-3 ml-2">
                {onExit && (
                    <button 
                        onClick={onExit}
                        className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white rounded-md text-sm font-semibold transition-all shadow-sm"
                        title="Exit DevLush Workspace"
                    >
                        Exit
                    </button>
                )}
                <h1 className={`text-xl font-heading tracking-wider ${titleColor}`}>{getTitle()}</h1>
            </div>

            <div className={`flex items-center p-0.5 backdrop-blur-md border rounded-full shadow-sm gap-1 overflow-hidden ${navBgColor}`}>


                {/* Main Nav Group */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg">
                    <button onClick={() => onViewChange('agent-workspace')} className={`${baseButtonClass} ${getButtonStyle('agent-workspace', 'special')}`}>
                        Agent Workspace
                    </button>
                    <button onClick={() => onViewChange('devlush')} className={`${baseButtonClass} ${getButtonStyle('devlush')}`}>
                        devLush Topics
                    </button>
                    <button onClick={() => onViewChange('devlush-search')} className={`p-1.5 rounded-md transition-colors ${currentView === 'devlush-search' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-muted-foreground hover:bg-muted'}`} title="Search Topics">
                        <Search className="w-4 h-4" />
                    </button>
                </div>



                {/* Extras Group */}
                <div className="flex items-center gap-1 p-0.5">
                    <button onClick={() => onViewChange('topic-theory')} className={`${baseButtonClass} ${getButtonStyle('topic-theory', 'special')}`} title="Topic Theory Library">
                        <Library className="w-4 h-4" />
                    </button>
                    <button onClick={() => onViewChange('reading')} className={`${baseButtonClass} ${getButtonStyle('reading')}`}>
                        Reading
                    </button>
                    <button onClick={() => onViewChange('articles')} className={`${baseButtonClass} ${getButtonStyle('articles')}`}>
                        Articles
                    </button>

                </div>
            </div>

            <div ref={settingsRef} className="relative mr-2">
                <button
                    onClick={() => setIsSettingsOpen(prev => !prev)}
                    className={`p-1.5 rounded-full backdrop-blur-md border hover:bg-background/80 transition-colors ${navBgColor}`}
                    title="Settings"
                >
                    <Settings className={`w-4 h-4 ${navTextColor}`} />
                </button>

                {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-popover rounded-lg border shadow-lg z-50 p-4 animate-fade-in-down">
                        <div className="space-y-4">
                            <button
                                onClick={() => { onViewChange('favorites'); setIsSettingsOpen(false); }}
                                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
                            >
                                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <StarIcon className="w-4 h-4 text-yellow-500" />
                                    Favorites View
                                </span>
                                <span className="text-xs text-muted-foreground group-hover:text-primary">Open &rarr;</span>
                            </button>

                            <div className="border-t border-border" />

                            <ToggleSwitch
                                label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                isOn={theme === 'dark'}
                                onToggle={onToggleTheme}
                                onIcon={<Moon className="w-4 h-4 text-muted-foreground" />}
                                offIcon={<Sun className="w-4 h-4 text-muted-foreground" />}
                            />
                            <ToggleSwitch
                                label="Manual Lock"
                                isOn={isAppLocked}
                                onToggle={onToggleLockMode}
                                onIcon={<Lock className="w-4 h-4 text-destructive" />}
                                offIcon={<Unlock className="w-4 h-4 text-muted-foreground" />}
                            />
                            <ToggleSwitch
                                label="Focus Mode"
                                isOn={focusMode}
                                onToggle={onToggleFocusMode}
                                onIcon={<Zap className="w-4 h-4 text-yellow-500" />}
                                offIcon={<Zap className="w-4 h-4 text-muted-foreground" />}
                            />
                            <ToggleSwitch
                                label="AI Assistant"
                                isOn={showAiAssistant}
                                onToggle={onToggleAiAssistant}
                                onIcon={<ChatIcon className="w-4 h-4 text-primary" />}
                                offIcon={<ChatIcon className="w-4 h-4 text-muted-foreground" />}
                            />
                            <div className="border-t border-border !mt-4 !mb-2" />
                            <ToggleSwitch
                                label="Infinite Energy"
                                isOn={isInfiniteEnergy}
                                onToggle={onToggleInfiniteEnergy}
                                onIcon={<Infinity className="w-4 h-4 text-primary" />}
                                offIcon={<Zap className="w-4 h-4 text-muted-foreground" />}
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

export default Navbar;
