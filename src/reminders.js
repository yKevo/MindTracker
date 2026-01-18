export const requestReminderPermission = async () => {
    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }
};


export const scheduleDailyReminder = () => {
    if (Notification.permission !== "granted") return;


    setInterval(() => {
        new Notification("MindTracker", {
            body: "Take a moment to write today’s journal entry 💜"
        });
    }, 24 * 60 * 60 * 1000);
};