export const CAMERAS = Array.from({ length: 64 }, (_, i) => ({
    id: `CAM-${1000 + i}`,
    location: i % 2 === 0 ? "Sector 7G" : "Main Gate",
    status: Math.random() > 0.9 ? "warning" : "active",
    type: ["thermal", "night", "standard"][i % 3],
    hasActivity: Math.random() > 0.8,
    activityType: ["Human", "Vehicle", "Suspicious"][Math.floor(Math.random() * 3)],
    timestamp: new Date().toISOString()
}));
