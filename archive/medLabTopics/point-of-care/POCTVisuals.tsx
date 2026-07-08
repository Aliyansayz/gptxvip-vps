import React from 'react';
import { Camera, Image as ImageIcon, Clock, Car, AlertTriangle } from 'lucide-react';

export const CameraAnalogy = () => (
    <div className="flex flex-col gap-6 items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 my-2 shadow-sm">
        <div className="flex flex-col items-center gap-2 w-full">
            <div className="w-full h-20 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center border-2 border-teal-500 relative shadow-sm">
                <Camera className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                <div className="absolute -bottom-2 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">INSTANT</div>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">POCT (Polaroid)</p>
        </div>
        
        <div className="w-full border-t border-dashed border-slate-300 dark:border-slate-700"></div>

        <div className="flex flex-col items-center gap-2 w-full">
            <div className="w-full h-20 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center border-2 border-blue-500 border-dashed relative opacity-80">
                <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <Clock className="absolute -top-2 -right-2 w-5 h-5 text-blue-500 bg-white rounded-full" />
                <div className="absolute -bottom-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">WAIT 24h</div>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Central Lab (Studio)</p>
        </div>
    </div>
);

export const RoadAnalogy = ({ value }: { value: number }) => {
    // value is INR. Normal 1, Therapeutic 2-3, High > 4
    const slipperiness = Math.min(100, (value / 5) * 100);
    return (
        <div className="my-2 p-3 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl border relative overflow-hidden">
            <div className="text-center mb-6">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Coagulation Road Conditions</h4>
            </div>
            
            {/* Road Surface */}
            <div className="h-16 bg-slate-400 rounded-lg relative overflow-hidden flex items-center">
                {/* Ice Patch */}
                <div 
                    className="absolute right-0 h-full bg-cyan-100/50 dark:bg-cyan-400/20 backdrop-blur-sm transition-all duration-500" 
                    style={{ width: `${Math.max(0, slipperiness - 20)}%` }}
                ></div>
                
                {/* Car */}
                <div 
                    className="absolute transition-all duration-700 ease-out"
                    style={{ left: `${Math.min(90, value * 15)}%` }}
                >
                    <Car className={`w-8 h-8 ${value > 4 ? 'text-red-500 animate-bounce' : value >= 2 ? 'text-green-500' : 'text-blue-500'}`} />
                    {value > 4 && <AlertTriangle className="absolute -top-3 right-0 w-3 h-3 text-red-500 animate-ping" />}
                </div>

                {/* Markers */}
                <div className="absolute bottom-1 left-[20%] w-0.5 h-3 bg-white/50"></div> {/* INR 1 */}
                <div className="absolute bottom-1 left-[40%] w-0.5 h-3 bg-green-400/80"></div> {/* INR 2 */}
                <div className="absolute bottom-1 left-[60%] w-0.5 h-3 bg-green-400/80"></div> {/* INR 3 */}
            </div>
            
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-2 px-1">
                <span>INR 1 (Dry)</span>
                <span className="text-green-600 font-bold">Safe Zone</span>
                <span className="text-red-500 font-bold">INR 5+ (Ice)</span>
            </div>
        </div>
    );
};

export const DashboardAnalogy = () => (
    <div className="my-4 p-3 bg-slate-900 rounded-xl border border-slate-700 shadow-inner">
        <h4 className="text-center text-[10px] font-bold text-slate-400 uppercase mb-3">Urinalysis "Check Engine" Dashboard</h4>
        <div className="grid grid-cols-2 gap-2">
            {[
                { label: 'GLU', color: 'text-green-500' },
                { label: 'PRO', color: 'text-green-500' },
                { label: 'KET', color: 'text-green-500' },
                { label: 'LEU', color: 'text-red-500 animate-pulse', icon: <AlertTriangle className="w-3 h-3 inline mr-1"/> },
                { label: 'NIT', color: 'text-red-500 animate-pulse', icon: <AlertTriangle className="w-3 h-3 inline mr-1"/> },
                { label: 'BLO', color: 'text-green-500' },
                { label: 'pH', color: 'text-green-500' },
                { label: 'SG', color: 'text-green-500' },
                { label: 'BIL', color: 'text-green-500' },
                { label: 'URO', color: 'text-green-500' },
            ].map((item, i) => (
                <div key={i} className="bg-black/50 rounded p-1.5 flex flex-col items-center justify-center border border-slate-800">
                    <span className={`text-[9px] font-bold font-mono ${item.color}`}>{item.icon} {item.label}</span>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${item.color.includes('red') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                </div>
            ))}
        </div>
    </div>
);

export const RiverAnalogy = () => (
    <div className="my-4 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900 relative overflow-hidden">
        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest text-center mb-2">Lateral Flow Mechanism</h4>
        
        {/* The River */}
        <div className="h-16 relative bg-blue-200/50 dark:bg-blue-900/30 rounded-lg overflow-hidden flex items-center">
            {/* Flow arrows */}
            <div className="absolute inset-0 flex justify-around opacity-20">
                {[1,2,3,4].map(i => <div key={i} className="w-4 h-full border-r border-blue-400 transform skew-x-12"></div>)}
            </div>
            
            {/* "Fisherman" (Test Line Antibody) */}
            <div className="absolute left-[60%] bottom-0 flex flex-col items-center z-10">
                <div className="w-1 h-8 bg-black/50"></div>
                <div className="w-4 h-4 border-2 border-red-500 rounded-full flex items-center justify-center bg-white"><div className="w-2 h-2 bg-red-500 rounded-full"></div></div>
                <span className="text-[8px] font-bold mt-1 bg-white/80 px-1 rounded shadow-sm">Test Line</span>
            </div>

            {/* "Fish" (Antigens) flowing */}
            <div className="flex gap-4 animate-slide-ltr absolute w-[200%]">
                {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-purple-500 rounded-full shadow-sm flex items-center justify-center text-[6px] text-white font-bold">Ag</div>
                ))}
            </div>
        </div>
        <p className="text-[10px] text-center mt-2 text-muted-foreground italic leading-tight">
            Like a fisherman catching specific fish in a stream. Only the target antigen gets caught at the Test Line.
        </p>
    </div>
);
