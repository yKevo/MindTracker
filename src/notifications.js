export const requestNotifications = async () => {
  if (!("Notification" in window)) {
    alert("Notifications not supported");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Notifications disabled");
    return;
  }

  localStorage.setItem("mt-notifs", "true");
  alert("Daily reminders enabled 💜");
};

export const scheduleDailyNotification = () => {
  if (Notification.permission !== "granted") return;

  const now = new Date();
  const next = new Date();
  next.setHours(20, 0, 0, 0); // 8 PM

  if (next < now) next.setDate(next.getDate() + 1);

  const timeout = next.getTime() - now.getTime();

  setTimeout(() => {
    new Notification("MindTracker 💜", {
      body: "How are you feeling today?",
      icon: process.env.PUBLIC_URL + "/icon.png"
    });

    setInterval(() => {
      new Notification("MindTracker 💜", {
        body: "Take a moment to journal 🌱",
        icon: process.env.PUBLIC_URL + "/icon.png"
      });
    }, 24 * 60 * 60 * 1000);
  }, timeout);
};
