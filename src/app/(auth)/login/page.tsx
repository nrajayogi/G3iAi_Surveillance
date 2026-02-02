'use client';

import { useActionState, useState } from 'react';
import { loginAction } from '@/actions/auth';
import { motion } from 'framer-motion';
import { User, Lock, ChevronRight, Scan, Sun, Moon, ShieldCheck, Cpu } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, null);

    // Default to dark for Cyberpunk feel
    const [darkMode, setDarkMode] = useState(true);
    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <div className={`w-full min-h-screen lg:grid lg:grid-cols-2 transition-colors duration-500 ${darkMode ? 'bg-[#030304]' : 'bg-slate-50'}`}>

            {/* LEFT PANEL: LOGIN FORM */}
            <div className="flex items-center justify-center py-12 px-8 relative overflow-hidden">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`absolute top-6 left-6 p-2 rounded-full z-50 transition-all duration-300 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300 shadow-md'}`}
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto grid w-[350px] gap-6"
                >
                    <div className="grid gap-2 text-center">
                        <div className={`mx-auto p-3 rounded-xl border mb-4 relative group cursor-default transition-all duration-500 ${darkMode
                            ? 'bg-cyan-950/30 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                            : 'bg-blue-50 border-blue-200 shadow-lg text-blue-600'
                            }`}>
                            <Scan className={`w-8 h-8 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                            {darkMode && <div className="absolute inset-0 border border-cyan-400/30 rounded-xl animate-ping opacity-20"></div>}
                        </div>
                        <h1 className={`text-3xl font-bold tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            G3iAi <span className={`${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>ACCESS</span>
                        </h1>
                        <p className={`text-xs tracking-[0.2em] font-mono ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            SECURE SURVEILLANCE NODE
                        </p>
                    </div>

                    <form action={formAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="relative group">
                                <User className={`absolute left-3 top-3 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="OPERATOR ID"
                                    required
                                    className={`w-full h-10 pl-10 pr-3 rounded border text-sm font-mono outline-none transition-all ${darkMode
                                        ? 'bg-[#0a0a0c] border-slate-800 text-cyan-100 focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                                        }`}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <div className="relative group">
                                <Lock className={`absolute left-3 top-3 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="ACCESS KEY"
                                    required
                                    className={`w-full h-10 pl-10 pr-3 rounded border text-sm font-mono outline-none transition-all ${darkMode
                                        ? 'bg-[#0a0a0c] border-slate-800 text-cyan-100 focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                                        }`}
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="text-red-500 text-xs font-mono text-center tracking-widest animate-pulse border border-red-500/20 p-2 rounded bg-red-500/5">
                                [ERROR]: {state.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className={`h-10 rounded font-bold text-xs tracking-[0.1em] transition-all flex items-center justify-center gap-2 group ${darkMode
                                ? 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                                }`}
                        >
                            {isPending ? 'AUTHENTICATING...' : <>INITIATE SESSION <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* RIGHT PANEL: VISUALS */}
            <div className="hidden lg:block relative bg-black overflow-hidden border-l border-slate-800/50">
                {/* WALLPAPER BACKGROUND */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/login_sidebar_bg.png"
                        alt="Cyberpunk Background"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col items-start justify-end p-20 text-white">
                    <div className="mb-8 p-4 border border-slate-800 bg-black/50 backdrop-blur rounded max-w-sm">
                        <div className="flex items-center gap-3 mb-2 text-cyan-400">
                            <Cpu className="w-5 h-5" />
                            <span className="text-xs font-bold tracking-widest">SYSTEM STATUS</span>
                        </div>
                        <div className="space-y-1 font-mono text-[10px] text-slate-400">
                            <div className="flex justify-between"><span>NODES_ACTIVE</span> <span className="text-white">16/16</span></div>
                            <div className="flex justify-between"><span>NET_KEY_HASH</span> <span className="text-white">VERIFIED</span></div>
                            <div className="flex justify-between"><span>ENCRYPTION</span> <span className="text-white">AES-256</span></div>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold tracking-tight mb-4">
                        Global Eyes.<br />
                        <span className="text-cyan-400">Instant Intelligence.</span>
                    </h2>
                    <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                        Advanced AI-driven surveillance grid with real-time anomaly detection and predictive threat analysis. Authorized personnel only.
                    </p>
                </div>
            </div>
        </div>
    );
}
