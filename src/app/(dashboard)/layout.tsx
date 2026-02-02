import { redirect } from 'next/navigation';
import { getSession, logout } from '@/lib/auth'; // Ensure logout is imported if used
import Link from 'next/link';

// Async Sidebar Component to fetch session and determine visibility
async function Sidebar() {
    const session = await getSession();
    const isAdmin = session?.user?.isGlobalAdmin;

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen hidden md:block flex-shrink-0 border-r border-slate-800">
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight text-cyan-400">G3iAi Admin</h1>
            </div>
            <nav className="mt-6 px-4 space-y-2">
                {/* Only show Overview if Admin (or just hide for everyone if strictly not needed, but user said 'navigation menu' so keeping purely admin links for now) */}
                {isAdmin && <NavLink href="/dashboard">Overview</NavLink>}

                {isAdmin && (
                    <>
                        <div className="pt-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Administration</div>
                        <NavLink href="/dashboard/users">User Management</NavLink>
                        <NavLink href="/dashboard/organizations">Organizations</NavLink>
                        <NavLink href="/dashboard/audit">Audit Logs</NavLink>
                        <NavLink href="/dashboard/settings">Settings</NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block px-4 py-2 rounded-md hover:bg-slate-800 hover:text-cyan-400 transition-colors text-sm font-medium text-slate-300"
        >
            {children}
        </Link>
    );
}

function Header({ user }: { user: any }) {
    return (
        <header className="h-16 bg-[#050505] border-b border-slate-800 flex items-center justify-between px-8 text-white">
            <div className="text-sm text-slate-500 font-mono">
                ORG: <span className="font-semibold text-slate-300">GLOBAL OPERATIONS</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-xs font-mono text-cyan-500">{user.email}</div>
                <form action={async () => {
                    'use server';
                    const { logout } = await import('@/lib/auth');
                    await logout();
                }}>
                    <button className="text-xs font-bold tracking-widest text-red-500 hover:text-red-400 border border-red-900/50 px-3 py-1 bg-red-900/10 rounded hover:bg-red-900/20 transition-all">
                        LOGOUT
                    </button>
                </form>
            </div>
        </header>
    );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen bg-[#030304]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header user={session.user} />
                <main className="flex-1 p-0 overflow-auto"> {/* Removed padding to let full-bleed components work */}
                    {children}
                </main>
            </div>
        </div>
    );
}
