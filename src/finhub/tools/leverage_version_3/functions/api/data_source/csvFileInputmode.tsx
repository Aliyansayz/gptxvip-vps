import React, { useState, useRef } from 'react';
import { useIndicatorsStore } from '../../../stores/indicators_store';
import { decodeCsvBytes, inferCsvFileMetadata, parseCsvCandles } from '../middleware/normalizeCsvFile';

export const CsvFileInputMode: React.FC = () => {
    const { dataSettings, setDataSettings, tradingConfig } = useIndicatorsStore();
    const [assetName, setAssetName] = useState(() => dataSettings.dataSourceType === 'csv' ? String(dataSettings.asset) : 'CustomAsset');
    const [timeframeValue, setTimeframeValue] = useState<number>(() => dataSettings.dataSourceType === 'csv' ? Number.parseInt(dataSettings.timeframe, 10) || 1 : 1);
    const [timeframeUnit, setTimeframeUnit] = useState<'s' | 'm' | 'h'>(() => {
        const unit = dataSettings.timeframe?.slice(-1);
        return dataSettings.dataSourceType === 'csv' && (unit === 's' || unit === 'm' || unit === 'h') ? unit : 'm';
    });
    const [assetNameEdited, setAssetNameEdited] = useState(false);
    const [timeframeEdited, setTimeframeEdited] = useState(false);
    const [loadedFileName, setLoadedFileName] = useState('');
    const [fileError, setFileError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setFileError('');
            const text = decodeCsvBytes(new Uint8Array(await file.arrayBuffer()));
            const csvTimezone = tradingConfig.timeFilter?.csv_file_timezone || 'GMT+3';
            const parsedData = parseCsvCandles(text, csvTimezone);
            const inferred = inferCsvFileMetadata(file.name);
            const resolvedAsset = (assetNameEdited ? assetName : inferred.asset || assetName).trim() || 'CustomAsset';
            const resolvedTimeframe = timeframeEdited ? `${timeframeValue}${timeframeUnit}` : inferred.timeframe || `${timeframeValue}${timeframeUnit}`;
            const timeframeMatch = /^(\d+)([smh])$/.exec(resolvedTimeframe);
            if (timeframeMatch) {
                setTimeframeValue(Number(timeframeMatch[1]));
                setTimeframeUnit(timeframeMatch[2] as 's' | 'm' | 'h');
            }
            setAssetName(resolvedAsset);
            setLoadedFileName(file.name);

            // Successfully parsed
            setDataSettings(prev => ({
                ...prev,
                dataSourceType: 'csv',
                asset: resolvedAsset,
                timeframe: resolvedTimeframe,
                simulationMode: `${resolvedAsset}_${resolvedTimeframe}`,
                csvRawData: parsedData,
                showAlpha: true
            }));
            
        } catch (err) {
            setFileError(err instanceof Error ? err.message : 'Error processing CSV file');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
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
                        onChange={e => { setAssetName(e.target.value); setAssetNameEdited(true); }}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">Timeframe Value</label>
                    <input 
                        type="number" 
                        min={1}
                        value={timeframeValue}
                        onChange={e => { setTimeframeValue(parseInt(e.target.value) || 1); setTimeframeEdited(true); }}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1.5 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">Timeframe Unit</label>
                    <select 
                        value={timeframeUnit}
                        onChange={e => { setTimeframeUnit(e.target.value as 's' | 'm' | 'h'); setTimeframeEdited(true); }}
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
                        accept=".csv,text/csv,text/plain"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-cyan-400 hover:file:bg-zinc-700"
                    />
                    {dataSettings.dataSourceType === 'csv' && dataSettings.csvRawData && dataSettings.csvRawData.length > 0 && (
                        <span className="text-[10px] text-emerald-400 font-bold">Loaded {dataSettings.csvRawData.length} candles{loadedFileName ? ` from ${loadedFileName}` : ''}</span>
                    )}
                </div>
                {fileError && <span className="text-[10px] text-red-500 mt-1">{fileError}</span>}
                <span className="text-[10px] text-zinc-500">Accepts datetime/open/high/low/close (volume optional) or MetaTrader &lt;DATE&gt;/&lt;TIME&gt;/&lt;OPEN&gt;/&lt;HIGH&gt;/&lt;LOW&gt;/&lt;CLOSE&gt; exports. Times without an offset use CSV File Timezone ({tradingConfig.timeFilter?.csv_file_timezone || 'GMT+3'}).</span>
                <span className="text-[10px] text-zinc-500">Imported candles remain available until this page is reloaded. Re-import the file after a reload.</span>
            </div>
        </div>
    );
};
