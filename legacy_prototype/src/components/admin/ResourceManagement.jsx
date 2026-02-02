import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Camera, Map, Trash2 } from 'lucide-react';

export default function ResourceManagement({ darkMode }) {
    const { cameras, sectors, addCamera, deleteCamera, addSector, deleteSector } = useGlobalContext();
    const [view, setView] = useState('cameras'); // 'cameras' | 'sectors'
    const [isAddingCamera, setIsAddingCamera] = useState(false);
    const [newCamData, setNewCamData] = useState({
        ipAddress: '',
        sectorId: '',
        type: 'standard',
        resolution: '1080p',
        protocol: 'RTSP'
    });

    const handleSaveCamera = () => {
        if (!newCamData.ipAddress || !newCamData.sectorId) return alert("IP and Sector required");
        addCamera({
            ...newCamData,
            status: 'active',
            hasActivity: false,
            location: sectors.find(s => s.id === newCamData.sectorId)?.name || 'Unknown',
            installDate: new Date().toISOString().split('T')[0]
        });
        setIsAddingCamera(false);
        setNewCamData({ ipAddress: '', sectorId: '', type: 'standard', resolution: '1080p', protocol: 'RTSP' });
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Sub-Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setView('cameras')}
                    className={`pb-2 text-sm font-bold tracking-widest border-b-2 transition-all ${view === 'cameras'
                        ? (darkMode ? 'border-cyan-500 text-cyan-400' : 'border-blue-600 text-blue-600')
                        : 'border-transparent opacity-50'}`}
                >
                    CAMERAS ({cameras.length})
                </button>
                <button
                    onClick={() => setView('sectors')}
                    className={`pb-2 text-sm font-bold tracking-widest border-b-2 transition-all ${view === 'sectors'
                        ? (darkMode ? 'border-cyan-500 text-cyan-400' : 'border-blue-600 text-blue-600')
                        : 'border-transparent opacity-50'}`}
                >
                    SECTORS ({sectors.length})
                </button>
            </div>

            {view === 'cameras' && (
                <div className={`p-6 rounded-lg border ${darkMode ? 'bg-[#0f0f12] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2"><Camera className="w-4 h-4" /> Active Camera Feeds</h3>
                        <button
                            onClick={() => setIsAddingCamera(!isAddingCamera)}
                            className={`text-xs px-3 py-1.5 rounded font-bold border ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            {isAddingCamera ? 'CANCEL' : '+ ADD CAMERA'}
                        </button>
                    </div>

                    {isAddingCamera && (
                        <div className={`mb-6 p-4 rounded border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <h4 className="text-xs font-bold mb-3 opacity-70">CONFIGURE NEW NODE</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    placeholder="IP Address (e.g. 192.168.1.x)"
                                    className={`p-2 rounded text-xs border bg-transparent ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}
                                    value={newCamData.ipAddress}
                                    onChange={e => setNewCamData({ ...newCamData, ipAddress: e.target.value })}
                                />
                                <select
                                    className={`p-2 rounded text-xs border bg-transparent ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}
                                    value={newCamData.sectorId}
                                    onChange={e => setNewCamData({ ...newCamData, sectorId: e.target.value })}
                                >
                                    <option value="">Select Sector</option>
                                    {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <select
                                    className={`p-2 rounded text-xs border bg-transparent ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}
                                    value={newCamData.type}
                                    onChange={e => setNewCamData({ ...newCamData, type: e.target.value })}
                                >
                                    <option value="standard">Standard Optical</option>
                                    <option value="thermal">Thermal Imaging</option>
                                    <option value="night">Night Vision</option>
                                </select>
                                <select
                                    className={`p-2 rounded text-xs border bg-transparent ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}
                                    value={newCamData.resolution}
                                    onChange={e => setNewCamData({ ...newCamData, resolution: e.target.value })}
                                >
                                    <option value="1080p">1080p FHD</option>
                                    <option value="4K">4K UHD</option>
                                </select>
                            </div>
                            <button
                                onClick={handleSaveCamera}
                                className={`w-full py-2 rounded font-bold text-xs ${darkMode ? 'bg-cyan-600 text-black' : 'bg-blue-600 text-white'}`}
                            >
                                DEPLOY CAMERA
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[500px] overflow-auto pr-2">
                        {cameras.map(cam => (
                            <div key={cam.id} className={`p-4 rounded border flex flex-col gap-2 ${darkMode ? 'bg-black/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className={`font-mono font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{cam.id}</div>
                                        <div className="text-[10px] opacity-60 font-mono mt-0.5">{cam.ipAddress || '192.168.x.x'}</div>
                                    </div>
                                    <button onClick={() => deleteCamera(cam.id)} className="opacity-40 hover:opacity-100 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>

                                <div className="text-xs opacity-60">{sectors.find(s => s.id === cam.sectorId)?.name || 'Unassigned'}</div>

                                <div className="flex gap-2 mt-2">
                                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                                        {cam.resolution || '1080p'}
                                    </div>
                                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                                        {cam.type.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'sectors' && (
                <div className={`p-6 rounded-lg border ${darkMode ? 'bg-[#0f0f12] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2"><Map className="w-4 h-4" /> Sectors & Zones</h3>
                        <button
                            onClick={() => {
                                const name = prompt("Sector Name:");
                                if (name) addSector({ name, zone: 'General' });
                            }}
                            className={`text-xs px-3 py-1.5 rounded font-bold border ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            + ADD SECTOR
                        </button>
                    </div>
                    <div className="space-y-3">
                        {sectors.map(sec => (
                            <div key={sec.id} className={`p-4 rounded border flex justify-between items-center ${darkMode ? 'bg-black/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                        {sec.zone.substring(0, 1)}
                                    </div>
                                    <div>
                                        <div className="font-bold">{sec.name}</div>
                                        <div className="text-xs opacity-50">ID: {sec.id}</div>
                                    </div>
                                </div>
                                <button onClick={() => deleteSector(sec.id)} className="opacity-40 hover:opacity-100 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
