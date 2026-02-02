
import { Activity, Shield, Users, Database, Server, Cpu, AlertTriangle, TrendingUp } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

function StatCard({ title, value, subtext, color = "text-cyan-400", border = "border-slate-800" }) {
    return (
        <div className={`p - 5 rounded - lg border bg - [#0f0f12] ${border} relative overflow - hidden group`}>
            {/* The icon was removed from props, so this section needs to be removed or changed */}
            {/* <div className={`absolute top - 0 right - 0 p - 3 opacity - 20 ${ color } `}>
                <Icon className="w-12 h-12" />
            </div> */}
            <div className="relative z-10">
                <div className={`mb - 2 opacity - 60 text - xs font - bold tracking - widest ${color} `}>{title}</div>
                <div className="text-3xl font-mono font-bold text-white mb-1">{value}</div>
                <div className="text-[10px] text-slate-500 font-mono">{subtext}</div>
            </div>
            <div className={`absolute bottom - 0 left - 0 h - 1 w - full bg - slate - 800`}>
                <div className={`h - full ${color.replace('text-', 'bg-')} w - [70 %]`} />
            </div>
        </div>
    );
}

function BarChart({ data }) {
    const max = Math.max(...data.map(d => d.value));
    return (
        <div className="flex items-end gap-2 h-full w-full pt-6">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                    <div
                        className="w-full bg-cyan-900/40 border-t border-cyan-500/50 hover:bg-cyan-500/40 transition-all relative"
                        style={{ height: `${(d.value / max) * 100}% ` }}
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.value}
                        </div>
                    </div>
                    <div className="text-[9px] text-center text-slate-500 mt-2 font-mono">{d.label}</div>
                </div>
            ))}
        </div>
    );
}

export default function MasterDashboard() {
    const { cameras, users, sectors } = useGlobalContext();

    const activeCameras = cameras.filter(c => c.status === 'active').length;
    const warningCameras = cameras.filter(c => c.status === 'warning').length;

    // Mock Chart Data
    const activityData = [
        { label: '00:00', value: 12 }, { label: '04:00', value: 8 },
        { label: '08:00', value: 45 }, { label: '12:00', value: 89 },
        { label: '16:00', value: 67 }, { label: '20:00', value: 34 }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-3">
                        <Activity className="w-6 h-6 text-cyan-400" /> MASTER CONTROL
                    </h2>
                    <p className="text-slate-400 text-xs font-mono mt-1">GLOBAL SYSTEM ANALYTICS & HEALTH</p>
                </div>
                <div className="flex gap-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> SYSTEM OPTIMAL</span>
                    <span>SERVER LOAD: 42%</span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Shield}
                    title="ACTIVE NODES"
                    value={activeCameras}
                    subtext={`${warningCameras} NODES REQUIRING ATTENTION`}
                    color={warningCameras > 0 ? "text-amber-400" : "text-cyan-400"}
                />
                <StatCard
                    icon={Users}
                    title="TOTAL OPERATORS"
                    value={users.length}
                    subtext="ACROSS 3 SHIFTS"
                    color="text-blue-400"
                />
                <StatCard
                    icon={Database}
                    title="STORAGE USED"
                    value="42.8 TB"
                    subtext="8500 HOURS RETENTION"
                    color="text-purple-400"
                />
                <StatCard
                    icon={AlertTriangle}
                    title="THREAT LEVEL"
                    value="LOW"
                    subtext="NO ACTIVE INTRUSIONS"
                    color="text-green-400"
                />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">

                {/* L: Activity Chart */}
                <div className="lg:col-span-2 p-6 rounded-lg border border-slate-800 bg-[#0f0f12]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-cyan-500" /> 24H ACTIVITY VOLUME
                        </h3>
                        <div className="flex gap-2">
                            <div className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-[10px] text-cyan-400">HUMAN</div>
                            <div className="px-2 py-0.5 rounded border border-slate-700 text-[10px] text-slate-500">VEHICLE</div>
                        </div>
                    </div>
                    <div className="h-64">
                        <BarChart data={activityData} />
                    </div>
                </div>

                {/* R: System Health */}
                <div className="p-6 rounded-lg border border-slate-800 bg-[#0f0f12] flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-500" /> NODE HEALTH
                    </h3>

                    <div className="flex-1 overflow-auto space-y-3 custom-scrollbar">
                        {sectors.map(sector => {
                            const sectorCams = cameras.filter(c => c.sectorId === sector.id);
                            const health = sectorCams.length > 0 ? Math.floor((sectorCams.filter(c => c.status === 'active').length / sectorCams.length) * 100) : 100;
                            return (
                                <div key={sector.id} className="p-3 rounded border border-slate-800 bg-black/20">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-300 font-bold">{sector.name}</span>
                                        <span className={`font - mono ${health < 100 ? 'text-amber-400' : 'text-green-400'} `}>{health}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-800 rounded overflow-hidden">
                                        <div
                                            className={`h - full ${health < 100 ? 'bg-amber-500' : 'bg-green-500'} `}
                                            style={{ width: `${health}% ` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
