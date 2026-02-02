export const INITIAL_USERS = [
    { id: 1, username: 'admin', password: '123', role: 'ADMIN', name: 'Commander Shepard' },
    { id: 2, username: 'user', password: '123', role: 'USER', name: 'Officer K' }
];

export const INITIAL_SECTORS = [
    { id: 'sec-1', name: 'Sector 7G', zone: 'North' },
    { id: 'sec-2', name: 'Main Gate', zone: 'South' },
    { id: 'sec-3', name: 'R&D Lab', zone: 'East' }
];

export const generateCameras = () => Array.from({ length: 16 }, (_, i) => ({
    id: `CAM-${1000 + i}`,
    location: i % 2 === 0 ? "Sector 7G" : "Main Gate",
    sectorId: i % 2 === 0 ? "sec-1" : "sec-2",
    status: Math.random() > 0.9 ? "warning" : "active",
    type: ["thermal", "night", "standard"][i % 3],
    ipAddress: `192.168.1.${10 + i}`,
    protocol: i % 2 === 0 ? "RTSP" : "HTTP/Secure",
    resolution: i % 3 === 0 ? "4K" : "1080p",
    installDate: "2024-01-15",
    hasActivity: Math.random() > 0.8,
    activityType: ["Human", "Vehicle", "Suspicious"][Math.floor(Math.random() * 3)],
    timestamp: new Date().toISOString()
}));
