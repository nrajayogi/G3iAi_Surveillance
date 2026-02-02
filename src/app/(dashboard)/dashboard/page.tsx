'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Activity, AlertTriangle, X, LayoutDashboard, Map, Database, Radio, Settings, Globe, Cpu, Wifi, User, Car, Bike, Truck, FileText, Download, Scan, Sun, Moon, Shield, Play, Pause, FastForward, Rewind, Share2, Calendar, Clock } from 'lucide-react';
import SurveillanceScreen from '@/components/dashboard/SurveillanceScreen';
import ZoomRail from '@/components/dashboard/ZoomRail';

// --- MOCK DATA FOR CAMERAS & SECTORS ---
const INITIAL_SECTORS = [
    { id: 'SEC-A', name: 'Alpha Sector' },
    { id: 'SEC-B', name: 'Bravo Sector' },
    { id: 'SEC-C', name: 'Charlie Sector' },
    { id: 'SEC-D', name: 'Delta Sector' },
];

// MOCK VIDEO FILES (Found in public/media)
const VIDEO_FILES = [
    'A_B_S1000149.MP4', 'A_B_S1000151.MP4', 'A_B_S1000188.MP4', 'A_B_S1000189.MP4',
    'A_B_S1000192.MP4', 'A_B_S1000201.MP4', 'A_B_S1000211.MP4', 'A_B_S1000220.MP4'
];

const INITIAL_CAMERAS = Array.from({ length: 16 }).map((_, i) => ({
    id: `0${i + 1}`.slice(-2),
    location: `ZONE-${['A', 'B', 'C', 'D'][Math.floor(i / 4)]}-${(i % 4) + 1}`,
    sectorId: `SEC-${['A', 'B', 'C', 'D'][Math.floor(i / 4)]}`,
    status: 'active',
    type: 'standard',
    // Assign a real video file from the list (looping)
    videoSrc: `/media/${VIDEO_FILES[i % VIDEO_FILES.length]}`,
    hasActivity: false,
    activityType: null,
    stats: { humans: 0, cars: 0, bikes: 0, trucks: 0, result: 0 }
}));

export default function Dashboard() {
    const [darkMode, setDarkMode] = useState(true);
    const toggleTheme = () => setDarkMode(!darkMode);

    const [cameras, setCameras] = useState<any[]>(INITIAL_CAMERAS);
    const [zoomLevel, setZoomLevel] = useState(4);
    const [selectedSector, setSelectedSector] = useState('ALL');
    const [currentTime, setCurrentTime] = useState(new Date());

    // --- INTERACTION STATES (Restored) ---
    const [selectedCamera, setSelectedCamera] = useState<any>(null);
    const [suspiciousAlert, setSuspiciousAlert] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [historyDate, setHistoryDate] = useState('');


    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.6) return; // Guard empty

            const randomCamIndex = Math.floor(Math.random() * cameras.length);
            const isSuspicious = Math.random() > 0.90;

            const types = ['Human', 'Vehicle', 'Cycle', 'Truck', 'Bike'];
            const activityType = isSuspicious ? 'Suspicious' : types[Math.floor(Math.random() * types.length)];
            const confidence = isSuspicious ? (80 + Math.random() * 19).toFixed(1) : (95 + Math.random() * 4).toFixed(1);

            setCameras(prev => {
                const newCams = [...prev];
                const cam = { ...newCams[randomCamIndex] };

                // Update Local Stats
                const newStats = { ...cam.stats };
                if (activityType === 'Human') newStats.humans++;
                if (activityType === 'Vehicle') newStats.cars++;
                if (activityType === 'Cycle' || activityType === 'Bike') newStats.bikes++;
                if (activityType === 'Truck') newStats.trucks++;
                if (isSuspicious) newStats.result++;

                // Update Camera State
                cam.activityType = activityType;
                cam.hasActivity = true;
                cam.status = isSuspicious ? 'warning' : 'active';
                cam.confidence = confidence;
                cam.stats = newStats;

                newCams[randomCamIndex] = cam;

                // Side Effect: Update Suspicious Alert
                if (isSuspicious && !suspiciousAlert) {
                    // Only set alert if not already viewing one to avoid spam
                    // Passing function to avoid dependency loop, but here simpler to just set
                    setSuspiciousAlert(cam);
                }

                return newCams;
            });

        }, 800);

        const clock = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
            clearInterval(interval);
            clearInterval(clock);
        };
    }, [cameras.length, suspiciousAlert]);

    const filteredCameras = selectedSector === 'ALL'
        ? cameras
        : cameras.filter(cam => cam.sectorId === selectedSector);

    // Global Stats Aggregation
    const globalStats = cameras.reduce((acc, cam) => ({
        humans: acc.humans + cam.stats.humans,
        cars: acc.cars + cam.stats.cars,
        bikes: acc.bikes + cam.stats.bikes,
        trucks: acc.trucks + cam.stats.trucks,
        suspicious: acc.suspicious + cam.stats.result
    }), { humans: 0, cars: 0, bikes: 0, trucks: 0, suspicious: 0 });

    const handleDownloadReport = (camId: string, metrics: any) => {
        const content = `
G3iAi SURVEILLANCE REPORT
=========================
CAMERA ID: ${camId}
TIMESTAMP: ${new Date().toISOString()}

DETECTED ACTIVITY METRICS:
--------------------------
• HUMANS: ${metrics.humans}
• CYCLES/BIKES: ${metrics.bikes}
• VEHICLES: ${metrics.cars}
• TRUCKS: ${metrics.trucks}
--------------------------
• ALERTS TRIGGERED: ${metrics.result}

STATUS: ${metrics.result > 0 ? 'REVIEW REQUIRED' : 'CLEAR'}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `REPORT_${camId}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };


    return (
        <div className={`h-[calc(100vh-4rem)] w-full font-mono overflow-hidden flex relative transition-colors duration-500 ${darkMode ? 'bg-[#030304] text-cyan-100/80' : 'bg-slate-50 text-slate-800'}`}>

            {/* CINEMATIC OVERLAYS - Dark Mode Only */}
            {darkMode && (
                <>
                    <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>
                    <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
                </>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col relative h-full">

                {/* HUD Header */}
                <header className={`h-16 border-b flex items-center px-6 z-30 relative shadow-lg justify-between backdrop-blur-md transition-colors duration-500 ${darkMode ? 'border-slate-800/50 bg-[#050505]/95' : 'border-slate-200 bg-white/80'}`}>
                    {/* Left: Branding */}
                    <div className="flex items-center gap-6 w-1/3">
                        <div className={`text-xl tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? 'from-cyan-400 to-blue-600' : 'from-blue-700 to-cyan-600'}`}>
                            SURVEILLANCE <span className={`font-light text-sm ml-2 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>GRID</span>
                        </div>
                    </div>

                    {/* CENTER: Selector */}
                    <div className="flex justify-center w-1/3">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>SECTOR:</span>
                            <select
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                                className={`text-xs font-bold py-1 px-4 rounded border outline-none cursor-pointer transition-all ${darkMode
                                    ? 'bg-[#0a0a0c] border-slate-700 text-cyan-400 focus:border-cyan-500'
                                    : 'bg-white border-slate-200 text-blue-600 hover:border-blue-400'}`}
                            >
                                <option value="ALL">ALL SECTORS</option>
                                {INITIAL_SECTORS.map(s => (
                                    <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* RIGHT: ACTIONS */}
                    <div className="flex items-center justify-end gap-6 w-1/3">
                        <div className={`font-mono text-sm tracking-widest border-l-2 pl-4 flex items-center gap-4 transition-colors ${darkMode ? 'text-cyan-500/80 border-cyan-500/50' : 'text-blue-600 border-blue-200'}`}>
                            <span className="animate-pulse">{currentTime.toLocaleTimeString()}</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-slate-800 text-yellow-500 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'}`}
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>
                </header>

                {/* Grid */}
                <main className={`flex-1 overflow-hidden relative transition-colors duration-500 ${darkMode ? 'bg-[#030304]' : 'bg-slate-50'}`}>
                    <div className={`absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center ${darkMode ? 'invert filter brightness-200' : 'filter brightness-90'}`}></div>

                    <div className="w-full h-full p-4 pb-24 overflow-y-auto custom-scrollbar">
                        <motion.div
                            layout
                            className="grid gap-3 w-full content-start"
                            style={{
                                gridTemplateColumns: `repeat(${zoomLevel}, minmax(0, 1fr))`
                            }}
                        >
                            {filteredCameras.slice(0, zoomLevel * zoomLevel * 2 || 64).map((cam) => (
                                <SurveillanceScreen
                                    key={cam.id}
                                    camera={cam}
                                    zoomLevel={zoomLevel}
                                    onClick={() => setSelectedCamera(cam)}
                                    darkMode={darkMode}
                                />
                            ))}
                        </motion.div>
                    </div>

                    <ZoomRail zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} darkMode={darkMode} />

                    {/* BOTTOM RIGHT: LIVE ANALYTICS HUD (Fixed Overlay) */}
                    <div className={`absolute bottom-6 right-6 z-40 hidden lg:flex items-center gap-6 px-6 py-2 rounded-full border shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors ${darkMode
                        ? 'bg-slate-900/90 border-slate-700/80 shadow-[0_0_20px_rgba(0,0,0,0.6)]'
                        : 'bg-white/90 border-slate-200 shadow-xl'
                        }`}>
                        <StatItemSimplified icon={User} count={globalStats.humans} label="HUMAN" color={darkMode ? "text-cyan-400" : "text-blue-600"} darkMode={darkMode} />
                        <StatItemSimplified icon={Bike} count={globalStats.bikes} label="CYCLE" color={darkMode ? "text-green-400" : "text-emerald-600"} darkMode={darkMode} />
                        <StatItemSimplified icon={Car} count={globalStats.cars} label="CAR" color={darkMode ? "text-blue-400" : "text-indigo-600"} darkMode={darkMode} />
                        <StatItemSimplified icon={Truck} count={globalStats.trucks} label="TRUCK" color={darkMode ? "text-orange-400" : "text-amber-600"} darkMode={darkMode} />
                        <div className={`h-6 w-px mx-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                        <StatItemSimplified icon={AlertTriangle} count={globalStats.suspicious} label="ALERTS" color={darkMode ? "text-red-500" : "text-red-600"} darkMode={darkMode} />
                    </div>
                </main>
            </div>


            {/* MODAL: Single Camera View - RESTORED */}
            <AnimatePresence>
                {selectedCamera && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCamera(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`w-full max-w-5xl border rounded-lg overflow-hidden shadow-2xl relative flex flex-col transition-all duration-300 ${darkMode
                                ? 'bg-[#0a0a0c] border-cyan-900/50 shadow-[0_0_50px_rgba(0,0,0,0.8)]'
                                : 'bg-white border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.2)]'
                                }`}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className={`h-12 flex items-center justify-between px-4 border-b ${darkMode
                                ? 'bg-gradient-to-r from-cyan-900/20 to-transparent border-cyan-500/20'
                                : 'bg-slate-50 border-slate-200'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1 border rounded ${darkMode ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-blue-200 bg-blue-50'}`}>
                                        <Activity className={`w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                                    </div>
                                    <span className={`tracking-widest text-sm font-bold ${darkMode ? 'text-cyan-100' : 'text-slate-800'}`}>FEED: {selectedCamera.id}</span>
                                    <span className={`text-xs font-mono opacity-60 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>// {selectedCamera.location}</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Date Picker (Historical) */}
                                    <div className={`hidden md:flex items-center gap-2 px-2 py-1 rounded border ${darkMode ? 'bg-black/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                                        <Calendar className={`w-3 h-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                        <input
                                            type="datetime-local"
                                            className={`bg-transparent text-[10px] font-mono outline-none ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
                                            value={historyDate}
                                            onChange={(e) => {
                                                setHistoryDate(e.target.value);
                                                console.log(`[SYSTEM] Retrieving historical logs for ${e.target.value}...`);
                                            }}
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleDownloadReport(selectedCamera.id, selectedCamera.stats)}
                                        className={`flex items-center gap-2 px-3 py-1 border rounded text-[10px] transition-all group ${darkMode
                                            ? 'bg-slate-800 hover:bg-cyan-900/50 border-slate-700 hover:border-cyan-500/50 text-cyan-400'
                                            : 'bg-white hover:bg-blue-50 border-slate-300 hover:border-blue-300 text-slate-600 hover:text-blue-600'
                                            }`}
                                    >
                                        <Download className="w-3 h-3 group-hover:scale-110" />
                                        REPORT
                                    </button>

                                    <button className={`p-1.5 rounded transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-cyan-400' : 'hover:bg-slate-100 text-slate-500 hover:text-blue-600'}`}>
                                        <Share2 className="w-4 h-4" />
                                    </button>

                                    <div className={`h-4 w-px ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                                    <X className={`w-5 h-5 cursor-pointer transition-colors ${darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`} onClick={() => setSelectedCamera(null)} />
                                </div>
                            </div>

                            {/* Video Area */}
                            <div className={`aspect-video relative flex items-center justify-center border-b group ${darkMode ? 'bg-black border-cyan-500/20' : 'bg-slate-900 border-slate-200'}`}>

                                {/* ACTUAL VIDEO PLAYER - RESTORED */}
                                {selectedCamera.videoSrc ? (
                                    <video
                                        src={selectedCamera.videoSrc}
                                        className="absolute inset-0 w-full h-full object-cover z-0"
                                        autoPlay
                                        loop
                                        muted // Muted by default for UX, controls usually handle audio if needed
                                        playsInline
                                    />
                                ) : (
                                    <Activity className={`w-16 h-16 text-slate-700 ${isPlaying ? 'animate-pulse' : ''}`} />
                                )}

                                {/* OVERLAYS (Status, Confidence, Grid) */}
                                <div className={`absolute top-4 left-4 font-bold tracking-widest text-xs flex items-center gap-2 z-10 ${isPlaying ? 'text-red-500' : 'text-slate-500'}`}>
                                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-slate-500'}`}></div>
                                    {isPlaying ? 'LIVE RECORDING' : 'PLAYBACK PAUSED'}
                                </div>

                                {/* CONFIDENCE SCORE DISPLAY IF ACTIVE */}
                                {selectedCamera.hasActivity && (
                                    <div className="absolute top-4 right-4 flex flex-col items-end z-10">
                                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/10">
                                            <Scan className="w-3 h-3 text-cyan-400" />
                                            <span className="text-[10px] font-mono text-cyan-400">
                                                CONFIDENCE: <span className="text-white font-bold">{selectedCamera.confidence || '99.9'}%</span>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className={`absolute inset-20 border rounded-lg opacity-50 ${darkMode ? 'border-cyan-500/20' : 'border-blue-500/20'}`}></div>

                                {/* INDIVIDUAL CAMERA STATS PILL - REPOSITIONED TO TOP */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center pointer-events-none">
                                    <div className={`pointer-events-auto flex items-center gap-6 px-6 py-2 rounded-full border backdrop-blur-md shadow-2xl scale-90 ${darkMode
                                        ? 'bg-[#050505]/80 border-slate-700/50'
                                        : 'bg-white/80 border-slate-200'
                                        }`}>
                                        <StatItemSimplified icon={User} count={selectedCamera.stats.humans} label="HUMAN" color={darkMode ? "text-cyan-400" : "text-blue-600"} darkMode={darkMode} />
                                        <StatItemSimplified icon={Bike} count={selectedCamera.stats.bikes} label="CYCLE" color={darkMode ? "text-green-400" : "text-emerald-600"} darkMode={darkMode} />
                                        <StatItemSimplified icon={Car} count={selectedCamera.stats.cars} label="CAR" color={darkMode ? "text-blue-400" : "text-indigo-600"} darkMode={darkMode} />
                                        <StatItemSimplified icon={Truck} count={selectedCamera.stats.trucks} label="TRUCK" color={darkMode ? "text-orange-400" : "text-amber-600"} darkMode={darkMode} />
                                        <div className={`h-6 w-px ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                                        <StatItemSimplified icon={AlertTriangle} count={selectedCamera.stats.result} label="ALERTS" color={darkMode ? "text-red-500" : "text-red-600"} darkMode={darkMode} />
                                    </div>
                                </div>
                            </div>

                            {/* NEW DEDICATED CONTROL BAR (Below Video) */}
                            <div className={`flex justify-center py-4 border-b ${darkMode ? 'bg-[#08080a] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <div className={`flex items-center gap-6 px-8 py-2 rounded-full border shadow-sm ${darkMode ? 'bg-black border-slate-700' : 'bg-white border-slate-300'}`}>
                                    <button onClick={() => setPlaybackSpeed(prev => prev === 0.5 ? 1 : 0.5)} className={`text-[10px] font-bold w-8 ${playbackSpeed === 0.5 ? (darkMode ? 'text-cyan-400' : 'text-blue-600') : (darkMode ? 'text-slate-500' : 'text-slate-600')}`}>
                                        0.5x
                                    </button>
                                    <button className={`p-2 hover:bg-slate-800/50 rounded-full transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                                        <Rewind className="w-5 h-5 fill-current" />
                                    </button>
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className={`p-4 rounded-full shadow-lg transition-transform active:scale-95 ${darkMode ? 'bg-cyan-600 text-black hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'}`}
                                    >
                                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                                    </button>
                                    <button className={`p-2 hover:bg-slate-800/50 rounded-full transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                                        <FastForward className="w-5 h-5 fill-current" />
                                    </button>
                                    <button onClick={() => setPlaybackSpeed(prev => prev === 2 ? 1 : 2)} className={`text-[10px] font-bold w-8 ${playbackSpeed === 2 ? (darkMode ? 'text-cyan-400' : 'text-blue-600') : (darkMode ? 'text-slate-500' : 'text-slate-600')}`}>
                                        2.0x
                                    </button>
                                </div>
                            </div>

                            {/* Footer Data */}
                            <div className={`p-6 flex justify-between items-center ${darkMode ? 'bg-[#050505]' : 'bg-slate-50'}`}>
                                <div className="grid grid-cols-4 gap-8">
                                    <DataBlock label="LOCATION" value={selectedCamera.location} darkMode={darkMode} />
                                    <DataBlock label="STATUS" value={selectedCamera.status} color={selectedCamera.status === 'warning' ? 'text-red-400' : 'text-green-400'} darkMode={darkMode} />
                                    <DataBlock label="ACTIVITY" value={selectedCamera.hasActivity ? (selectedCamera.activityType || 'UNKNOWN') : 'NO MOVEMENT'} darkMode={darkMode} />
                                    <DataBlock label="SESSION ID" value={`${selectedCamera.id}-SECURE`} darkMode={darkMode} />
                                </div>
                                <button className={`px-6 py-2 font-bold text-xs rounded tracking-widest transition-all ${darkMode
                                    ? 'bg-cyan-600 hover:bg-cyan-500 text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                    }`}>
                                    INITIATE DIAGNOSTIC
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )
                }
            </AnimatePresence >

            {/* ALERT POPUP - RESTORED */}
            <AnimatePresence>
                {suspiciousAlert && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        className={`fixed top-24 right-6 z-[70] w-80 border-l-4 backdrop-blur shadow-2xl ${darkMode
                            ? 'bg-[#0a0a0c]/95 border-l-red-500 shadow-[0_0_30px_rgba(220,38,38,0.2)]'
                            : 'bg-white/95 border-l-red-600 shadow-xl border-t border-r border-b border-slate-200'
                            }`}
                    >
                        <div className={`p-3 flex justify-between items-center border-b ${darkMode ? 'bg-red-900/10 border-red-500/20' : 'bg-red-50 border-red-100'
                            }`}>
                            <div className={`font-bold text-xs tracking-widest flex items-center gap-2 ${darkMode ? 'text-red-500' : 'text-red-700'}`}>
                                <AlertTriangle className="w-4 h-4" /> SUSPICION ALERT
                            </div>
                            <X className={`w-4 h-4 cursor-pointer hover:scale-110 transition-transform ${darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`} onClick={() => setSuspiciousAlert(null)} />
                        </div>
                        <div className="p-4 relative">
                            <div className={`text-xs mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Analyzing feed data...</div>
                            <div className={`text-sm font-mono mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                OBJECT: <span className={darkMode ? "text-red-400" : "text-red-600 font-bold"}>{suspiciousAlert.activityType?.toUpperCase()}</span><br />
                                CONFIDENCE: <span className={darkMode ? "text-cyan-400 font-bold" : "text-blue-600 font-bold"}>{suspiciousAlert.confidence || '98.5'}%</span>
                            </div>
                            <button
                                className={`mt-2 w-full py-2 text-xs tracking-widest transition-colors font-bold border ${darkMode
                                    ? 'bg-red-600/20 border-red-500/50 hover:bg-red-600 hover:text-white text-red-500'
                                    : 'bg-red-50 border-red-200 hover:bg-red-600 hover:text-white text-red-700'
                                    }`}
                                onClick={() => setSelectedCamera(suspiciousAlert)}
                            >
                                REVIEW FOOTAGE
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

function StatItemSimplified({ icon: IconComp, count, label, color, darkMode }: any) {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
                <IconComp className={`w-3 h-3 ${color}`} />
                <span className={`text-lg font-bold font-mono ${color}`}>{count}</span>
            </div>
            <span className={`text-[7px] tracking-widest font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
        </div>
    );
}

function DataBlock({ label, value, color, darkMode }: any) {
    return (
        <div>
            <div className={`text-[9px] mb-1 tracking-wider ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>{label}</div>
            <div className={`text-xs font-mono contents ${color || (darkMode ? 'text-white' : 'text-slate-900')}`}>{value}</div>
        </div>
    );
}
