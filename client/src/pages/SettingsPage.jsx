import { useNavigate } from "react-router-dom";
import { Send, Bell, MessageCircle, Shield, Palette, Volume2, Monitor, Clock, Type, Eye, CheckCheck, ArrowLeft } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useSettingsStore } from "../store/useSettingsStore";

const THEMES = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween",
    "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
    "wireframe", "black", "luxury", "dracula", "cmyk", "autumn",
    "business", "acid", "lemonade", "night", "coffee", "winter",
    "dim", "nord", "sunset",
];

const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey! How's it going?", isSent: false },
    { id: 2, content: "I'm doing great! Just working on some new features 🚀", isSent: true },
];

const SettingsPage = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useThemeStore();
    const {
        messageNotifications, setMessageNotifications,
        soundEnabled, setSoundEnabled,
        desktopNotifications, setDesktopNotifications,
        enterToSend, setEnterToSend,
        showTimestamps, setShowTimestamps,
        fontSize, setFontSize,
        showOnlineStatus, setShowOnlineStatus,
        showReadReceipts, setShowReadReceipts,
    } = useSettingsStore();

    return (
        <div className="min-h-screen pt-20 pb-10 container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                {/* ═══════════════════════════════════════════ */}
                {/* NOTIFICATION SETTINGS */}
                {/* ═══════════════════════════════════════════ */}
                <section className="bg-base-300 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Notification Settings</h2>
                            <p className="text-sm text-base-content/60">Manage how you receive notifications</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Message Notifications */}
                        <div className="flex items-center justify-between py-3 border-b border-base-200">
                            <div className="flex items-center gap-3">
                                <MessageCircle className="w-4 h-4 text-base-content/60" />
                                <div>
                                    <p className="font-medium text-sm">Message Notifications</p>
                                    <p className="text-xs text-base-content/50">Get notified when you receive a new message</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary toggle-sm"
                                checked={messageNotifications}
                                onChange={(e) => setMessageNotifications(e.target.checked)}
                            />
                        </div>

                        {/* Sound */}
                        <div className="flex items-center justify-between py-3 border-b border-base-200">
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-4 h-4 text-base-content/60" />
                                <div>
                                    <p className="font-medium text-sm">Notification Sound</p>
                                    <p className="text-xs text-base-content/50">Play a sound for incoming messages</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary toggle-sm"
                                checked={soundEnabled}
                                onChange={(e) => setSoundEnabled(e.target.checked)}
                            />
                        </div>

                        {/* Desktop Notifications */}
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <Monitor className="w-4 h-4 text-base-content/60" />
                                <div>
                                    <p className="font-medium text-sm">Desktop Notifications</p>
                                    <p className="text-xs text-base-content/50">Show browser push notifications</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary toggle-sm"
                                checked={desktopNotifications}
                                onChange={(e) => {
                                    setDesktopNotifications(e.target.checked);
                                    if (e.target.checked && "Notification" in window && Notification.permission !== "granted") {
                                        Notification.requestPermission();
                                    }
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* CHAT SETTINGS */}
                {/* ═══════════════════════════════════════════ */}
                <section className="bg-base-300 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-secondary/10 rounded-lg">
                            <MessageCircle className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Chat Settings</h2>
                            <p className="text-sm text-base-content/60">Customize your chat experience</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Enter to Send */}
                        <div className="flex items-center justify-between py-3 border-b border-base-200">
                            <div className="flex items-center gap-3">
                                <Send className="w-4 h-4 text-base-content/60" />
                                <div>
                                    <p className="font-medium text-sm">Enter to Send</p>
                                    <p className="text-xs text-base-content/50">Press Enter to send messages instead of clicking the button</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-secondary toggle-sm"
                                checked={enterToSend}
                                onChange={(e) => setEnterToSend(e.target.checked)}
                            />
                        </div>

                        {/* Show Timestamps */}
                        <div className="flex items-center justify-between py-3 border-b border-base-200">
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-base-content/60" />
                                <div>
                                    <p className="font-medium text-sm">Show Timestamps</p>
                                    <p className="text-xs text-base-content/50">Display time on each message</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-secondary toggle-sm"
                                checked={showTimestamps}
                                onChange={(e) => setShowTimestamps(e.target.checked)}
                            />
                        </div>

                        {/* Font Size */}
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <Type className="w-4 h-4 text-base-content/60" />
                                <div>
                                    <p className="font-medium text-sm">Font Size</p>
                                    <p className="text-xs text-base-content/50">Adjust the chat text size</p>
                                </div>
                            </div>
                            <select
                                className="select select-bordered select-sm w-32"
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value)}
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* PRIVACY SETTINGS */}
                {/* ═══════════════════════════════════════════ */}
                <section className="bg-base-300 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <Shield className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Privacy Settings</h2>
                            <p className="text-sm text-base-content/60">Control your privacy preferences</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Show Online Status */}
                        <div className="flex items-center justify-between py-3 border-b border-base-200">
                            <div className="flex items-center gap-3">
                                <Eye className="w-4 h-4 text-base-content/60" />
                                <div>
                                    <p className="font-medium text-sm">Show Online Status</p>
                                    <p className="text-xs text-base-content/50">Let others see when you are online</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-accent toggle-sm"
                                checked={showOnlineStatus}
                                onChange={(e) => setShowOnlineStatus(e.target.checked)}
                            />
                        </div>

                        {/* Read Receipts */}
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <CheckCheck className="w-4 h-4 text-base-content/60" />
                                <div>
                                    <p className="font-medium text-sm">Read Receipts</p>
                                    <p className="text-xs text-base-content/50">Let others know when you've read their messages</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-accent toggle-sm"
                                checked={showReadReceipts}
                                onChange={(e) => setShowReadReceipts(e.target.checked)}
                            />
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* THEME SETTINGS */}
                {/* ═══════════════════════════════════════════ */}
                <section className="bg-base-300 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-warning/10 rounded-lg">
                            <Palette className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Theme</h2>
                            <p className="text-sm text-base-content/60">Choose a theme for your chat interface</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {THEMES.map((t) => (
                            <button
                                key={t}
                                className={`
                  group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                  ${theme === t ? "bg-base-200 ring-2 ring-primary" : "hover:bg-base-200/50"}
                `}
                                onClick={() => setTheme(t)}
                            >
                                <div
                                    className="relative h-8 w-full rounded-md overflow-hidden"
                                    data-theme={t}
                                >
                                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                                        <div className="rounded bg-primary"></div>
                                        <div className="rounded bg-secondary"></div>
                                        <div className="rounded bg-accent"></div>
                                        <div className="rounded bg-neutral"></div>
                                    </div>
                                </div>
                                <span className="text-[11px] font-medium truncate w-full text-center">
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Preview */}
                    <h3 className="text-lg font-semibold mt-6 mb-3">Preview</h3>
                    <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
                        <div className="p-4 bg-base-200">
                            <div className="max-w-lg mx-auto">
                                <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                                    {/* Chat Header */}
                                    <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                                                J
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-sm">John Doe</h3>
                                                <p className="text-xs text-base-content/70">Online</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat Messages */}
                                    <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                                        {PREVIEW_MESSAGES.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`
                            max-w-[80%] rounded-xl p-3 shadow-sm
                            ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                          `}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                    <p
                                                        className={`
                              text-[10px] mt-1.5
                              ${message.isSent ? "text-primary-content/70" : "text-base-content/50"}
                            `}
                                                    >
                                                        12:00 PM
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chat Input */}
                                    <div className="p-4 border-t border-base-300 bg-base-100">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="input input-bordered flex-1 text-sm h-10"
                                                placeholder="Type a message..."
                                                value="This is a preview"
                                                readOnly
                                            />
                                            <button className="btn btn-primary h-10 min-h-0">
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
export default SettingsPage;
