// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, User, Car, Bike, Truck, Wifi, Cpu } from 'lucide-react';

export default function SurveillanceScreen({ camera, zoomLevel, onClick, darkMode, isPlaying = true }) {
    // Color definitions based on status
    const statusColor = camera.status === 'warning' ? 'text-red-500' : (darkMode ? 'text-cyan-400' : 'text-blue-600');
    const borderColor = camera.status === 'warning' ? 'border-red-500' : (darkMode ? 'border-cyan-500/30' : 'border-slate-300');
    const bgColor = camera.status === 'warning' ? (darkMode ? 'bg-red-900/10' : 'bg-red-50') : (darkMode ? 'bg-black' : 'bg-white');

    return (
        <motion.div
            layoutId={`camera-${camera.id}`}
            className={`relative overflow-hidden group cursor-pointer border transition-all duration-300 ${borderColor} ${bgColor} ${zoomLevel === 1 ? 'col-span-full row-span-full h-[80vh]' : 'aspect-video rounded-sm'
                } ${darkMode ? 'shadow-none' : 'shadow-sm hover:shadow-md'}`}
            onClick={onClick}
            whileHover={{ scale: 1.02, zIndex: 10 }}
        >
            {/* Header / Info Bar */}
            <div className={`absolute top-0 left-0 right-0 p-2 flex justify-between items-start z-20 bg-gradient-to-b ${darkMode ? 'from-black/80' : 'from-white/90'} to-transparent`}>
                <div className="flex flex-col">
                    <span className={`text-[10px] font-bold tracking-widest ${statusColor} drop-shadow-md`}>
                        CAM-{camera.id}
                    </span>
                    <span className={`text-[8px] uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {camera.location}
                    </span>
                </div>
                {camera.status === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse drop-shadow-lg" />
                )}
            </div>

            {/* Main Content Area (Placeholder for Video) */}
            <div className={`w-full h-full flex items-center justify-center relative ${darkMode ? 'bg-[#050505]' : 'bg-slate-100'}`}>
                {/* Grid Overlay */}
                <div className={`absolute inset-0 opacity-20 pointer-events-none ${darkMode ? 'bg-[linear-gradient(rgba(0,255,204,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.1)_1px,transparent_1px)] bg-[size:20px_20px]' : 'bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]'}`}></div>

                {/* Central Icon */}
                <Activity className={`w-8 h-8 opacity-50 ${statusColor}`} />

                {/* Active Object Indicators */}
                {camera.hasActivity && (
                    <div className="absolute bottom-12 flex gap-2">
                        {camera.activityType === 'Human' && <User className={`w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-blue-500'}`} />}
                        {camera.activityType === 'Vehicle' && <Car className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-indigo-500'}`} />}
                        {(camera.activityType === 'Cycle' || camera.activityType === 'Bike') && <Bike className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-emerald-500'}`} />}
                        {camera.activityType === 'Truck' && <Truck className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-amber-500'}`} />}
                    </div>
                )}
            </div>

            {/* Footer / Stats Bar */}
            <div className={`absolute bottom-0 left-0 right-0 p-1.5 flex justify-between items-center z-20 backdrop-blur-sm border-t ${darkMode
                ? 'bg-black/60 border-white/10'
                : 'bg-white/80 border-slate-200'
                }`}>
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${camera.status === 'active' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'} ${isPlaying ? 'animate-pulse' : ''}`}></span>
                    <span className={`text-[8px] font-mono ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {camera.status === 'active' ? 'LIVE' : 'ALERT'}
                    </span>
                </div>

                <div className="flex gap-2 text-[8px] font-mono opacity-80">
                    <div className={`flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Wifi className="w-2 h-2" /> 5G
                    </div>
                    <div className={`flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Cpu className="w-2 h-2" /> 12%
                    </div>
                </div>
            </div>

            {/* Hover Assessment Overlay */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col items-center justify-center gap-3 backdrop-blur-[1px] ${darkMode ? 'bg-cyan-900/10' : 'bg-blue-900/5'}`}>
                <div className={`px-3 py-1 text-[10px] font-bold tracking-widest border rounded select-none ${darkMode
                    ? 'bg-black/80 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-white/90 border-blue-500 text-blue-600 shadow-sm'
                    }`}>
                    ACCESS FEED
                </div>

                {/* Dispatch Action */}
                <button
                    className={`pointer-events-auto px-4 py-1.5 flex items-center gap-2 text-[9px] font-bold tracking-widest border rounded transition-all transform hover:scale-105 active:scale-95 ${darkMode
                        ? 'bg-red-900/80 border-red-500 text-red-100 hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                        : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-600 hover:text-white shadow-sm'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        // Dispatch action logic here
                        console.log(`Dispatching inventory to CAM-${camera.id}`);
                    }}
                >
                    <AlertTriangle className="w-3 h-3" />
                    DISPATCH INVENTORY
                </button>
            </div>

        </motion.div>
    );
}
