/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { generateHistoricalLogs } from '../utils/historyGenerator';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

// Mock Data moved to internal scope or imported
// For simplicity in this fix, I will verify if I can just not export them (which I am not).
// The error usually happens if I export a non-component.
// Wait, I am NOT exporting them.
// Ah, `generateCameras` is likely being flagged because it's a function.
// Let's explicitly move these to a separate file `src/data/initialData.js` to be clean.
import { INITIAL_USERS, INITIAL_SECTORS, generateCameras } from '../utils/initialData';

export const GlobalProvider = ({ children }) => {
    // --- STATE ---
    const [users, setUsers] = useState(() => {
        try {
            const local = localStorage.getItem('g3iai_users');
            const parsed = local ? JSON.parse(local) : null;
            return Array.isArray(parsed) ? parsed : INITIAL_USERS;
        } catch {
            return INITIAL_USERS;
        }
    });

    const [sectors, setSectors] = useState(() => {
        try {
            const local = localStorage.getItem('g3iai_sectors');
            const parsed = local ? JSON.parse(local) : null;
            return Array.isArray(parsed) ? parsed : INITIAL_SECTORS;
        } catch {
            return INITIAL_SECTORS;
        }
    });

    const [cameras, setCameras] = useState(() => {
        try {
            const local = localStorage.getItem('g3iai_cameras');
            const parsed = local ? JSON.parse(local) : null;
            return Array.isArray(parsed) ? parsed : generateCameras();
        } catch {
            return generateCameras();
        }
    });

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const local = localStorage.getItem('g3iai_currentUser');
            return local ? JSON.parse(local) : null;
        } catch {
            return null;
        }
    });

    // Theme State
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const local = localStorage.getItem('g3iai_theme');
            return local ? JSON.parse(local) : true; // Default to dark
        } catch {
            return true;
        }
    });

    // --- PERSISTENCE ---
    useEffect(() => localStorage.setItem('g3iai_users', JSON.stringify(users)), [users]);
    useEffect(() => localStorage.setItem('g3iai_sectors', JSON.stringify(sectors)), [sectors]);
    useEffect(() => localStorage.setItem('g3iai_cameras', JSON.stringify(cameras)), [cameras]);
    useEffect(() => localStorage.setItem('g3iai_theme', JSON.stringify(darkMode)), [darkMode]);

    // Apply theme class side-effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('g3iai_currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('g3iai_currentUser');
        }
    }, [currentUser]);

    // --- ACTIONS ---

    // Theme
    const toggleTheme = () => setDarkMode(prev => !prev);


    // --- ACTIONS ---

    // Auth
    const login = (username, password) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            return { success: true, user };
        }
        return { success: false, message: 'Invalid Credentials' };
    };

    const logout = () => setCurrentUser(null);

    // Users
    const addUser = (newUser) => {
        setUsers(prev => [...prev, { ...newUser, id: Date.now() }]);
    };
    const updateUser = (id, updatedData) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));
    };
    const deleteUser = (id) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    // Sectors
    const addSector = (newSector) => {
        setSectors(prev => [...prev, { ...newSector, id: `sec-${Date.now()}` }]);
    };
    const deleteSector = (id) => {
        setSectors(prev => prev.filter(s => s.id !== id));
    };

    // Cameras
    const addCamera = (newCam) => {
        setCameras(prev => [...prev, { ...newCam, id: `CAM-${Date.now().toString().slice(-4)}`, timestamp: new Date().toISOString() }]);
    };
    const updateCamera = (id, data) => {
        setCameras(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    };
    const deleteCamera = (id) => {
        setCameras(prev => prev.filter(c => c.id !== id));
    };

    // History Retrieval
    const getHistoricalLogs = (date, cameraId) => {
        return Promise.resolve(generateHistoricalLogs(date, cameraId));
    };

    return (
        <GlobalContext.Provider value={{
            users, sectors, cameras, currentUser, darkMode,
            login, logout, toggleTheme,
            addUser, updateUser, deleteUser,
            addSector, deleteSector,
            addCamera, updateCamera, deleteCamera,
            getHistoricalLogs
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
