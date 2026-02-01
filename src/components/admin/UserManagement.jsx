import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Plus, Trash2, Edit2, Shield, User } from 'lucide-react';

export default function UserManagement({ darkMode }) {
    const { users, addUser, deleteUser, currentUser } = useGlobalContext();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'USER' });

    const handleSubmit = (e) => {
        e.preventDefault();
        addUser(formData);
        setIsFormOpen(false);
        setFormData({ name: '', username: '', password: '', role: 'USER' });
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>User Management</h2>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage system access and roles</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm ${darkMode ? 'bg-cyan-600 text-black hover:bg-cyan-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    <Plus className="w-4 h-4" /> ADD OPERATOR
                </button>
            </div>

            {/* List */}
            <div className={`rounded-lg border overflow-hidden ${darkMode ? 'border-slate-800 bg-[#0f0f12]' : 'border-slate-200 bg-white'}`}>
                <table className="w-full text-left">
                    <thead className={`text-xs uppercase font-mono tracking-wider ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                        {users.map(user => (
                            <tr key={user.id} className={`transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                <td className="p-4 font-bold">{user.name}</td>
                                <td className="p-4 font-mono text-sm opacity-70">{user.username}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold tracking-wide border ${user.role === 'ADMIN'
                                            ? (darkMode ? 'bg-red-900/20 text-red-400 border-red-900/50' : 'bg-red-50 text-red-600 border-red-100')
                                            : (darkMode ? 'bg-cyan-900/20 text-cyan-400 border-cyan-900/50' : 'bg-blue-50 text-blue-600 border-blue-100')
                                        }`}>
                                        {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {user.id !== currentUser.id && (
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="p-2 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Basic Add Modal (Inline for speed) */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className={`w-full max-w-md p-6 rounded-xl border shadow-2xl ${darkMode ? 'bg-[#0a0a0c] border-slate-700' : 'bg-white border-slate-200'}`}>
                        <h3 className="text-lg font-bold mb-4">Add New Operator</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                required placeholder="Full Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full p-3 rounded border bg-transparent outline-none ${darkMode ? 'border-slate-700 focus:border-cyan-500' : 'border-slate-200 focus:border-blue-500'}`}
                            />
                            <input
                                required placeholder="Username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                className={`w-full p-3 rounded border bg-transparent outline-none ${darkMode ? 'border-slate-700 focus:border-cyan-500' : 'border-slate-200 focus:border-blue-500'}`}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required placeholder="Password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full p-3 rounded border bg-transparent outline-none ${darkMode ? 'border-slate-700 focus:border-cyan-500' : 'border-slate-200 focus:border-blue-500'}`}
                                />
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className={`w-full p-3 rounded border bg-transparent outline-none ${darkMode ? 'border-slate-700 focus:border-cyan-500' : 'border-slate-200 focus:border-blue-500'}`}
                                >
                                    <option value="USER">User (Standard)</option>
                                    <option value="ADMIN">Admin (Full)</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-bold opacity-70 hover:opacity-100">CANCEL</button>
                                <button type="submit" className={`px-4 py-2 rounded text-sm font-bold ${darkMode ? 'bg-cyan-600 text-black hover:bg-cyan-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>CREATE USER</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
