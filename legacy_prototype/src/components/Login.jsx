import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import { User, Lock, ChevronRight, Scan, Sun, Moon, Shield, Wifi } from 'lucide-react';
import loginBg from '../assets/login_sidebar_bg.png';

export default function Login({ darkMode, toggleTheme }) {
    const { login } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate network delay for effect
        setTimeout(() => {
            const result = login(formData.username, formData.password);
            if (!result.success) {
                setError(result.message);
                setLoading(false);
            }
            // Success is handled by App.jsx observing currentUser
        }, 800);
    };

    return (
        <div className={`w-full h-full flex overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-[#050505]' : 'bg-slate-50'}`}>

            {/* LEFT: FORM AREA (65%) */}
            <div className="w-full lg:w-[65%] h-full relative flex items-center justify-center p-8">

                {/* Tech Background Grid (Left Side) */}
                <div className={`absolute inset-0 pointer-events-none opacity-[0.4] ${darkMode
                    ? 'bg-[linear-gradient(rgba(0,255,204,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.03)_1px,transparent_1px)] bg-[size:40px_40px]'
                    : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]'
                    }`}></div>

                {/* Theme Toggle (Absolute Top-Right of Left Panel for Mobile, or Main layout) */}
                <button
                    onClick={toggleTheme}
                    className={`absolute top-6 right-6 p-2 rounded-full z-50 transition-all duration-300 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300 shadow-md'}`}
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`relative z-10 w-full max-w-md p-10 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all duration-500 ${darkMode
                        ? 'bg-[#0a0a0c]/80 border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.6)]'
                        : 'bg-white/90 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
                        }`}
                >
                    <div className="flex flex-col items-center mb-10">
                        <div className={`p-4 rounded-2xl mb-6 border transition-all duration-500 relative group cursor-default ${darkMode
                            ? 'bg-cyan-950/30 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                            : 'bg-blue-50 border-blue-200 shadow-lg text-blue-600'
                            }`}>
                            <Scan className={`w-10 h-10 ${darkMode ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-blue-600'} transition-colors duration-300`} />
                            {darkMode && <div className="absolute inset-0 border border-cyan-400/30 rounded-2xl animate-ping opacity-20"></div>}
                        </div>

                        <h1 className={`text-4xl font-bold tracking-tight mb-2 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            G3iAi <span className={`font-light opacity-60 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>ACCESS</span>
                        </h1>
                        <p className={`text-xs tracking-[0.2em] uppercase font-mono ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Secure Surveillance Node
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                                <input
                                    type="text"
                                    placeholder="OPERATOR ID"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className={`w-full py-3.5 pl-12 pr-4 rounded-xl outline-none border transition-all duration-300 font-mono text-sm ${darkMode
                                        ? 'bg-[#050505] border-slate-800 text-cyan-100 focus:border-cyan-500/50 focus:bg-[#0f0f12] placeholder:text-slate-700'
                                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10'
                                        }`}
                                />
                            </div>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                                <input
                                    type="password"
                                    placeholder="ACCESS KEY"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full py-3.5 pl-12 pr-4 rounded-xl outline-none border transition-all duration-300 font-mono text-sm ${darkMode
                                        ? 'bg-[#050505] border-slate-800 text-cyan-100 focus:border-cyan-500/50 focus:bg-[#0f0f12] placeholder:text-slate-700'
                                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10'
                                        }`}
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-xs font-mono text-center tracking-widest animate-pulse">
                                    [ERROR]: {error}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group ${darkMode
                                ? 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                }`}
                        >
                            {loading ? (
                                <span className="animate-pulse">AUTHENTICATING...</span>
                            ) : (
                                <>
                                    INITIATE SESSION <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className={`mt-8 flex justify-between items-center text-[10px] font-mono opacity-50 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span>V.2.4.0 (STABLE)</span>
                        <span>ENCRYPTED CONNECTION</span>
                    </div>
                </motion.div>

                {/* Background Decor (Left Side) */}
                <div className="absolute bottom-6 left-8 text-[10px] font-mono text-slate-500 opacity-50 hidden md:block">
                    SYSTEM STATUS: NORMAL<br />
                    LATENCY: 12ms
                </div>
            </div>

            {/* RIGHT: INFO/WALLPAPER AREA (35%) */}
            <div className="hidden lg:block w-[35%] h-full relative overflow-hidden bg-[#020202]">
                {/* Background Image/Effect */}
                <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${loginBg})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>

                <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
                    <div className="flex justify-end">
                        <div className="bg-white/5 backdrop-blur-md rounded-lg p-2 border border-white/10 animate-pulse">
                            <Wifi className="w-5 h-5 text-cyan-400" />
                        </div>
                    </div>

                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-6 relative overflow-hidden"
                        >
                            {/* Decorative Line */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>

                            <h3 className="text-white font-bold text-lg mb-1 tracking-wide">GLOBAL OPERATIONS</h3>
                            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                                Real-time surveillance tracking across 4 major sectors. Anomaly detection active.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[10px] text-slate-500 mb-1 font-mono uppercase">Avg. Response</div>
                                    <div className="text-xl text-cyan-400 font-mono">1.2s</div>
                                </div>
                                <div>
                                    <div className="text-xl text-white font-mono">142</div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex items-center gap-3 opacity-60">
                            <Shield className="w-4 h-4 text-cyan-600" />
                            <span className="text-[10px] font-mono text-cyan-600 tracking-widest">CYTHACK DEFENSE SYSTEMS</span>
                        </div>
                    </div>
                </div>

                {/* Tech Lines */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[size:100%_4px]"></div>
            </div>

        </div>
    );
}
