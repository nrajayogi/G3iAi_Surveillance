
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function ZoomRail({ zoomLevel, setZoomLevel, darkMode }) {
    // Calculate percentage for visual fill based on zoom level (1-8)
    const fillWidth = ((zoomLevel - 1) / 7) * 100;

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[400px] h-16 flex flex-col items-center justify-center select-none z-40 group">
            {/* Label */}
            <div className={`mb-2 text-[10px] font-mono tracking-[0.2em] transition-colors ${darkMode ? 'text-cyan-500/50 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-blue-600'}`}>
                // GRID DENSITY CONTROL //
            </div>

            {/* The Rail */}
            <div className={`relative w-full h-2 rounded-full overflow-hidden shadow-inner transition-colors ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                {/* Scanline pattern on rail */}
                <div className={`absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_4px)]`}></div>

                {/* Active Fill */}
                <motion.div
                    className={`absolute top-0 left-0 h-full ${darkMode ? 'bg-gradient-to-r from-cyan-900 to-cyan-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`}
                    initial={{ width: `${fillWidth}%` }}
                    animate={{ width: `${fillWidth}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
            </div>

            {/* The Draggable Thumb/Throttle */}
            <div className="absolute top-6 w-full px-0">
                <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(Number(e.target.value))}
                    className="w-full h-8 opacity-0 cursor-ew-resize absolute top-[-12px] z-50"
                />

                {/* Visual Handle that follows the value */}
                <motion.div
                    className={`absolute top-[-14px] w-6 h-10 border shadow-lg flex items-center justify-center pointer-events-none transition-colors ${darkMode
                        ? 'bg-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                        : 'bg-white border-blue-600 shadow-md'
                        }`}
                    initial={{ left: `${fillWidth}%` }}
                    animate={{ left: `calc(${fillWidth}% - 12px)` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                >
                    <div className={`w-0.5 h-4 ${darkMode ? 'bg-cyan-500/50' : 'bg-blue-300'}`}></div>
                    {/* Glow effect */}
                    {darkMode && <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>}
                </motion.div>
            </div>

            {/* Tick Marks */}
            <div className="w-full flex justify-between mt-2 px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <motion.div
                        key={i}
                        className={`h-1 w-px transition-colors duration-300 ${zoomLevel >= i
                            ? (darkMode ? 'bg-cyan-500/50' : 'bg-blue-400')
                            : (darkMode ? 'bg-slate-800' : 'bg-slate-300')
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
