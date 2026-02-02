import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { User, Shield, Trash2, Edit2, Plus, AlertTriangle } from 'lucide-react';
import CreateUserDialog from './CreateUserDialog'; // We will create this updated client component

export default async function UsersPage() {
    await requireAdmin();

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="w-full max-w-6xl mx-auto p-8 text-slate-200">
            <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">USER MANAGEMENT</h2>
                    <p className="text-xs font-mono text-cyan-500/70 tracking-widest uppercase">
                        // Security Clearance & Access Control
                    </p>
                </div>
                <CreateUserDialog />
            </div>

            {/* Legacy-style Cyberpunk Table */}
            <div className="rounded-xl border border-slate-800 bg-[#0a0a0c] overflow-hidden shadow-2xl relative">
                {/* Decorative Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(0,255,204,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <table className="w-full text-left relative z-10">
                    <thead className="text-[10px] uppercase font-mono tracking-widest bg-slate-900/50 text-slate-500">
                        <tr>
                            <th className="p-5 font-normal">Operator Identity</th>
                            <th className="p-5 font-normal">Role / Access</th>
                            <th className="p-5 font-normal">Clearance</th>
                            <th className="p-5 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {users.map((user) => (
                            <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${user.isGlobalAdmin
                                                ? 'bg-red-900/20 border-red-500/30 text-red-500'
                                                : 'bg-cyan-900/20 border-cyan-500/30 text-cyan-500'
                                            }`}>
                                            <span className="font-bold text-xs">{user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">
                                                {user.fullName || 'Unknown Operator'}
                                            </div>
                                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                                                ID: {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold tracking-wide border ${user.isGlobalAdmin
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                        }`}>
                                        {user.isGlobalAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        {user.isGlobalAdmin ? 'GLOBAL ADMIN' : 'STANDARD USER'}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs font-mono text-slate-400">
                                            {user.clearanceLevel}
                                        </div>
                                        {user.badgeId && (
                                            <div className="text-[9px] text-slate-600 font-mono tracking-tighter">
                                                BADGE: {user.badgeId}
                                            </div>
                                        )}
                                        {user.department && (
                                            <div className="text-[9px] text-slate-600 font-mono tracking-tighter">
                                                DEPT: {user.department}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {!user.isGlobalAdmin && (
                                            <button className="p-2 rounded hover:bg-red-900/20 text-slate-600 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
