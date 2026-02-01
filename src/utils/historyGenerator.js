export const generateHistoricalLogs = (date, cameraId) => {
    // Seed random generator with date string to ensure consistent results for same date
    // const seed = date + cameraId; // Unused for now
    const entries = [];

    // Determine number of events (random between 5 and 20)
    const numEvents = 5 + Math.floor(Math.random() * 15);

    // Parse the requested date
    const baseDate = new Date(date);

    for (let i = 0; i < numEvents; i++) {
        // Random time during that day
        const eventDate = new Date(baseDate);
        eventDate.setHours(Math.floor(Math.random() * 24));
        eventDate.setMinutes(Math.floor(Math.random() * 60));

        const type = ["Motion Detected", "Person Identified", "Vehicle Entry", "System Check"][Math.floor(Math.random() * 4)];
        const severity = type === "Person Identified" ? "High" : "Low";

        entries.push({
            id: `LOG-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: eventDate.toISOString(),
            cameraId: cameraId,
            type: type,
            severity: severity,
            details: `Automated log entry sequence #${i * 124}`
        });
    }

    // Sort by time
    return entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};
