import React, { useState, useRef } from 'react';
import { useIndicatorsStore } from '../../../stores/indicators_store';
import { normalizeCSV } from '../middleware/normalizeCsvFile';
import { Ohlc } from '../indicators/baseline';

export const CsvFileInputMode: React.FC = () => {
    const { dataSettings, setDataSettings } = useIndicatorsStore();
    const [assetName, setAssetName] = useState('CustomAsset');
    const [timeframeValue, setTimeframeValue] = useState<number>(1);
    const [timeframeUnit, setTimeframeUnit] = useState<'s' | 'm' | 'h'>('m');
    const [fileError, setFileError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setFileError('');
            const text = await file.text();
            const normalized = normalizeCSV(text);
            
            // normalized csv format: "datetime,open,high,low,close,volume"
            const lines = normalized.split('\n').filter(l => l.trim() !== '');
            const parsedData: Ohlc[] = [];
            
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',');
                if (cols.length === 6) {
                    parsedData.push({
                        time: new Date(cols[0]).getTime(), // Attempt to parse datetime
                        open: Number(cols[1]),
                        high: Number(cols[2]),
                        low: Number(cols[3]),
                        close: Number(cols[4]),
                        volume: Number(cols[5]) 
                    });
                }
            }

            if (parsedData.length === 0) {
                setFileError('No valid data found in CSV.');
                return;
            }

            // Successfully parsed
            setDataSettings(prev => ({
                ...prev,
                dataSourceType: 'csv',
                asset: assetName,
                timeframe: `${timeframeValue}${timeframeUnit}`,
                simulationMode: `${assetName}_${timeframeValue}${timeframeUnit}`,
                csvRawData: parsedData,
                showAlpha: true
            }));
            
        } catch (err: any) {
            setFileError(err.message || 'Error processing CSV file');
        }
    };

    const handleModeSwitch = () => {
        setDataSettings(prev => ({
            ...prev,
            dataSourceType: 'simulation',
            csvRawData: []
        }));
    };

    return (
        <div className="flex flex-col gap-3 border border-zinc-700/50 p-3 rounded-lg mt-2">
            <div className="flex justify-between items-center border-b border-zinc-700/50 pb-2">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">CSV Data Source</span>
                {dataSettings.dataSourceType === 'csv' && (
                    <button 
                        onClick={handleModeSwitch}
                        className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded"
                    >
                        Switch to Simulation Mode
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">Asset Name</label>
                    <input 
                        type="text" 
                        value={assetName}
                        onChange={e => setAssetName(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">Timeframe Value</label>
                    <input 
                        type="number" 
                        min={1}
                        value={timeframeValue}
                        onChange={e => setTimeframeValue(parseInt(e.target.value) || 1)}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">Timeframe Unit</label>
                    <select 
                        value={timeframeUnit}
                        onChange={e => setTimeframeUnit(e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                        <option value="s">Seconds</option>
                        <option value="m">Minutes</option>
                        <option value="h">Hours</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] text-zinc-400 font-bold uppercase">Upload CSV File</label>
                <div className="flex items-center gap-3">
                    <input 
                        type="file" 
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-cyan-400 hover:file:bg-zinc-700"
                    />
                    {dataSettings.dataSourceType === 'csv' && dataSettings.csvRawData && dataSettings.csvRawData.length > 0 && (
                        <span className="text-[10px] text-emerald-400 font-bold">Loaded {dataSettings.csvRawData.length} records</span>
                    )}
                </div>
                {fileError && <span className="text-[10px] text-red-500 mt-1">{fileError}</span>}
            </div>
        </div>
    );
};
