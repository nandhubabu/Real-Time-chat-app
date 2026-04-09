import { create } from "zustand";

export const useSettingsStore = create((set, get) => ({
    // Notification Settings
    messageNotifications: JSON.parse(localStorage.getItem("chat-msg-notif") ?? "true"),
    soundEnabled: JSON.parse(localStorage.getItem("chat-sound") ?? "true"),
    desktopNotifications: JSON.parse(localStorage.getItem("chat-desktop-notif") ?? "false"),

    // Chat Settings
    enterToSend: JSON.parse(localStorage.getItem("chat-enter-send") ?? "true"),
    showTimestamps: JSON.parse(localStorage.getItem("chat-timestamps") ?? "true"),
    fontSize: localStorage.getItem("chat-font-size") || "medium",

    // Privacy Settings
    showOnlineStatus: JSON.parse(localStorage.getItem("chat-show-online") ?? "true"),
    showReadReceipts: JSON.parse(localStorage.getItem("chat-read-receipts") ?? "true"),

    // Setters
    setMessageNotifications: (val) => {
        localStorage.setItem("chat-msg-notif", JSON.stringify(val));
        set({ messageNotifications: val });
    },
    setSoundEnabled: (val) => {
        localStorage.setItem("chat-sound", JSON.stringify(val));
        set({ soundEnabled: val });
    },
    setDesktopNotifications: (val) => {
        localStorage.setItem("chat-desktop-notif", JSON.stringify(val));
        set({ desktopNotifications: val });
    },
    setEnterToSend: (val) => {
        localStorage.setItem("chat-enter-send", JSON.stringify(val));
        set({ enterToSend: val });
    },
    setShowTimestamps: (val) => {
        localStorage.setItem("chat-timestamps", JSON.stringify(val));
        set({ showTimestamps: val });
    },
    setFontSize: (val) => {
        localStorage.setItem("chat-font-size", val);
        set({ fontSize: val });
    },
    setShowOnlineStatus: (val) => {
        localStorage.setItem("chat-show-online", JSON.stringify(val));
        set({ showOnlineStatus: val });
    },
    setShowReadReceipts: (val) => {
        localStorage.setItem("chat-read-receipts", JSON.stringify(val));
        set({ showReadReceipts: val });
    },
}));
