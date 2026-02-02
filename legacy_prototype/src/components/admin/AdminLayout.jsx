import { useState } from 'react';
import { Users, Server, LogOut, ChevronLeft, Shield, Activity, Database } from 'lucide-react';
import UserManagement from './UserManagement';
import ResourceManagement from './ResourceManagement';
import MasterDashboard from './MasterDashboard';
import ArchiveRetrieval from './ArchiveRetrieval';

export default function AdminLayout({ onNavigateBack, onLogout, darkMode }) {
    const [activeTab, setActiveTab] = useState('master'); // 'master' | 'users' | 'resources' | 'archive'

    return (
        <div className={`h-screen w-screen overflow-hidden flex flex-col ${darkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>

            {/* Admin Header */}
            <header className={`h-16 border-b flex items-center px-6 justify-between ${darkMode ? 'border-slate-800 bg-[#050505]' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={onNavigateBack} className="flex items-center gap-2 text-sm font-mono opacity-60 hover:opacity-100 transition-opacity">
                        <ChevronLeft className="w-4 h-4" /> DASHBOARD
                    </button>
                    <div className="h-6 w-px bg-slate-700/50 mx-2"></div>
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-red-500" />
                        <h1 className="font-bold tracking-widest text-lg">ADMIN <span className="text-red-500">PORTAL</span></h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-slate-500">SECURE SESSION ACTIVE</div>
                    <button
                        onClick={onLogout}
                        className={`px-4 py-2 rounded text-xs font-bold tracking-widest border transition-all ${darkMode ? 'border-red-900 text-red-500 hover:bg-red-900/20' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                    >
                        LOGOUT
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className={`w-64 border-r flex flex-col p-4 ${darkMode ? 'border-slate-800 bg-[#0a0a0c]' : 'border-slate-200 bg-white'}`}>
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('master')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-wide transition-all ${activeTab === 'master'
                                ? (darkMode ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200')
                                : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                        >
                            <Activity className="w-4 h-4" /> MASTER DASHBOARD
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-wide transition-all ${activeTab === 'users'
                                ? (darkMode ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200')
                                : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                        >
                            <Users className="w-4 h-4" /> USER MANAGEMENT
                        </button>
                        <button
                            onClick={() => setActiveTab('resources')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-wide transition-all ${activeTab === 'resources'
                                ? (darkMode ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200')
                                : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                        >
                            <Server className="w-4 h-4" /> RESOURCES
                        </button>
                        <button
                            onClick={() => setActiveTab('archive')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-wide transition-all ${activeTab === 'archive'
                                ? (darkMode ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200')
                                : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                        >
                            <Database className="w-4 h-4" /> ARCHIVE RETRIEVAL
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-8 relative">
                    {activeTab === 'master' && <MasterDashboard darkMode={darkMode} />}
                    {activeTab === 'users' && <UserManagement darkMode={darkMode} />}
                    {activeTab === 'resources' && <ResourceManagement darkMode={darkMode} />}
                    {activeTab === 'archive' && <ArchiveRetrieval darkMode={darkMode} />}
                </main>
            </div>
        </div>
    );
}
