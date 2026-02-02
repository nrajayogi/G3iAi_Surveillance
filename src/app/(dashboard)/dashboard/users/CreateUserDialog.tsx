'use client';

import { useTransition, useState } from 'react';
import { createUserAction } from '@/actions/users';
import { Plus, ShieldAlert, BadgeCheck, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Note: Re-using Shadcn Dialog but styling interior to match theme
export default function CreateUserDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = await createUserAction(null, formData);
            if (result?.error) {
                setError(result.error);
            } else {
                setOpen(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 px-6 py-3 rounded font-bold text-xs tracking-widest bg-cyan-600 text-black hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                >
                    <Plus className="w-4 h-4" /> RECRUIT OPERATOR
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0c] border-slate-800 text-slate-200 sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-cyan-500" /> NEW OPERATOR PROFILE
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-mono text-xs">
                        Create a new secure identity. All fields are mandatory for clearance.
                    </DialogDescription>
                </DialogHeader>

                <form action={onSubmit} className="grid gap-4 py-2 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Identity</label>
                            <input name="fullName" placeholder="FULL NAME" required
                                className="w-full bg-black/50 border border-slate-800 rounded px-3 py-2 text-sm text-cyan-100 placeholder:text-slate-700 outline-none focus:border-cyan-500 transition-colors font-mono" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Badge ID</label>
                            <div className="relative">
                                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
                                <input name="badgeId" placeholder="SEC-0000" className="w-full bg-black/50 border border-slate-800 rounded pl-8 pr-3 py-2 text-sm text-cyan-100 placeholder:text-slate-700 outline-none focus:border-cyan-500 transition-colors font-mono" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Secure Contact</label>
                        <input name="email" type="email" placeholder="EMAIL ADDRESS" required
                            className="w-full bg-black/50 border border-slate-800 rounded px-3 py-2 text-sm text-cyan-100 placeholder:text-slate-700 outline-none focus:border-cyan-500 transition-colors font-mono" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Clearance</label>
                            <select name="clearanceLevel" className="w-full bg-black/50 border border-slate-800 rounded px-3 py-2 text-sm text-cyan-100 outline-none focus:border-cyan-500 transition-colors font-mono">
                                <option value="LEVEL_1">LEVEL 1 (Basic)</option>
                                <option value="LEVEL_2">LEVEL 2 (Staff)</option>
                                <option value="LEVEL_3">LEVEL 3 (Agent)</option>
                                <option value="LEVEL_4">LEVEL 4 (Senior)</option>
                                <option value="LEVEL_5">LEVEL 5 (Director)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Department</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
                                <input name="department" placeholder="DEPT CODE" className="w-full bg-black/50 border border-slate-800 rounded pl-8 pr-3 py-2 text-sm text-cyan-100 placeholder:text-slate-700 outline-none focus:border-cyan-500 transition-colors font-mono" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Initial Key</label>
                            <input name="password" type="password" placeholder="PASSWORD" required
                                className="w-full bg-black/50 border border-slate-800 rounded px-3 py-2 text-sm text-cyan-100 placeholder:text-slate-700 outline-none focus:border-cyan-500 transition-colors font-mono" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">System Role</label>
                            <select name="role" className="w-full bg-black/50 border border-slate-800 rounded px-3 py-2 text-sm text-cyan-100 outline-none focus:border-cyan-500 transition-colors font-mono">
                                <option value="USER">USER ACCESS</option>
                                <option value="ADMIN">ADMIN CONTROL</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="p-2 border border-red-900/50 bg-red-900/10 text-red-500 text-xs font-mono">{error}</div>}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-4 w-full py-3 bg-white text-black font-bold text-xs tracking-[0.2em] rounded hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50"
                    >
                        {isPending ? 'ENCRYPTING & SAVING...' : 'AUTHORIZE & CREATE USER'}
                    </button>

                </form>
            </DialogContent>
        </Dialog>
    );
}
