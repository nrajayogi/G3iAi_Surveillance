import { useState } from 'react';
import { Calendar, Search, Download, Play, FileText, CheckCircle } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

export default function ArchiveRetrieval({ darkMode }) {
    const { cameras, getHistoricalLogs } = useGlobalContext();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCameraId, setSelectedCameraId] = useState('');
    const [isRetrieving, setIsRetrieving] = useState(false);
    const [retrievedLogs, setRetrievedLogs] = useState(null);

    const handleRetrieve = async () => {
        if (!selectedDate || !selectedCameraId) return;

        setIsRetrieving(true);
        setRetrievedLogs(null);

        // Simulate network delay
        setTimeout(async () => {
            try {
                const logs = await getHistoricalLogs(selectedDate, selectedCameraId);
                setRetrievedLogs(logs);
            } catch (error) {
                console.error("Failed to retrieve logs", error);
                alert("Failed to retrieve logs. Check console.");
            } finally {
                setIsRetrieving(false);
            }
        }, 1500);
    };

    const handleDownload = () => {
        if (!retrievedLogs) return;
        const content = JSON.stringify(retrievedLogs, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ARCHIVE_${selectedCameraId}_${selectedDate}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-3">
                        <Database className="w-6 h-6 text-cyan-400" /> ARCHIVE RETRIEVAL
                    </h2>
                    <p className="text-slate-400 text-xs font-mono mt-1">ACCESS HISTORICAL FOOTAGE & LOGS</p>
                </div>
            </div>

            {/* Controls */}
            <div className={`p-6 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-4 ${darkMode ? 'bg-[#0f0f12] border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 tracking-widest">TARGET DATE</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="date"
                            className={`w-full p-2 pl-10 rounded text-xs font-mono border bg-transparent ${darkMode ? 'border-slate-700 text-white' : 'border-slate-300'}`}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 tracking-widest">SOURCE NODE</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            className={`w-full p-2 pl-10 rounded text-xs font-mono border bg-transparent ${darkMode ? 'border-slate-700 text-white' : 'border-slate-300'}`}
                            value={selectedCameraId}
                            onChange={(e) => setSelectedCameraId(e.target.value)}
                        >
                            <option value="">SELECT CAMERA ID</option>
                            {cameras.map(c => (
                                <option key={c.id} value={c.id}>{c.id} - {c.location}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={handleRetrieve}
                        disabled={!selectedDate || !selectedCameraId || isRetrieving}
                        className={`w-full py-2.5 rounded font-bold text-xs tracking-widest transition-all ${isRetrieving
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}
                    >
                        {isRetrieving ? 'ACCESSING DATABASE...' : 'RETRIEVE ARCHIVE'}
                    </button>
                </div>
            </div>

            {/* Results Area */}
            {retrievedLogs && (
                <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-black/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                                <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{retrievedLogs.length} EVENTS FOUND</h3>
                                <p className="text-[10px] text-slate-500 font-mono">SOURCE: {selectedCameraId} | DATE: {selectedDate}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDownload}
                            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold border ${darkMode
                                ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                                : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                        >
                            <Download className="w-4 h-4" /> DOWNLOAD LOGS
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {retrievedLogs.map(log => (
                            <div key={log.id} className={`p-3 rounded border flex items-center justify-between group ${darkMode ? 'bg-[#0a0a0c] border-slate-800 hover:border-cyan-500/30' : 'bg-white border-slate-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded ${darkMode ? 'bg-cyan-900/10 text-cyan-500' : 'bg-blue-50 text-blue-600'}`}>
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className={`text-xs font-mono font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{log.timestamp.split('T')[1].substring(0, 8)}</div>
                                        <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{log.type}</div>
                                        <div className="text-[10px] text-slate-500">{log.details}</div>
                                    </div>
                                </div>
                                <button className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'bg-slate-800 hover:bg-cyan-500 hover:text-black' : 'bg-slate-100 hover:bg-blue-500 hover:text-white'}`}>
                                    <Play className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
