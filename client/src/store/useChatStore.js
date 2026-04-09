import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            console.log("Error fetching users:", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            console.log("Error fetching messages:", error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.log("Error sending message:", error);
        }
    },

    deleteMessage: async (messageId) => {
        try {
            const res = await axiosInstance.delete(`/messages/${messageId}`);
            set({
                messages: get().messages.map((m) =>
                    m._id === messageId ? res.data : m
                ),
            });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete message");
        }
    },

    deleteSelectedMessages: async (messageIds) => {
        try {
            await Promise.all(
                messageIds.map((id) => axiosInstance.delete(`/messages/${id}`))
            );
            set({
                messages: get().messages.map((m) =>
                    messageIds.includes(m._id)
                        ? { ...m, isDeleted: true, text: null, image: null }
                        : m
                ),
            });
        } catch (error) {
            toast.error("Failed to delete some messages");
        }
    },

    deleteAllMessages: async () => {
        const { selectedUser } = get();
        try {
            await axiosInstance.delete(`/messages/all/${selectedUser._id}`);
            set({
                messages: get().messages.map((m) =>
                    m.senderId !== selectedUser._id
                        ? { ...m, isDeleted: true, text: null, image: null }
                        : m
                ),
            });
            toast.success("All your messages deleted");
        } catch (error) {
            toast.error("Failed to delete messages");
        }
    },

    clearChat: async () => {
        const { selectedUser } = get();
        try {
            await axiosInstance.delete(`/messages/clear/${selectedUser._id}`);
            set({ messages: [] });
            toast.success("Chat cleared");
        } catch (error) {
            toast.error("Failed to clear chat");
        }
    },

    editMessage: async (messageId, newText) => {
        try {
            const res = await axiosInstance.put(`/messages/${messageId}`, { text: newText });
            set({
                messages: get().messages.map((m) =>
                    m._id === messageId ? res.data : m
                ),
            });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to edit message");
        }
    },

    markAsRead: async (senderId) => {
        try {
            await axiosInstance.put(`/messages/read/${senderId}`);
            set({
                messages: get().messages.map((msg) =>
                    msg.senderId === senderId ? { ...msg, isRead: true } : msg
                ),
            });
        } catch (error) {
            console.log("Error marking messages as read:", error);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            const { selectedUser } = get();
            const isMessageForActiveChat = selectedUser && newMessage.senderId === selectedUser._id;

            // Check settings from localStorage
            const settingsStr = localStorage.getItem("chat-settings");
            const settings = settingsStr ? JSON.parse(settingsStr).state : {};

            // If we are not actively looking at this chat, show notifications
            if (!isMessageForActiveChat || document.hidden) {
                if (settings.soundEnabled ?? true) {
                    const audio = new Audio("/notification.mp3");
                    audio.play().catch(() => { });
                }
                if (settings.messageNotifications ?? true) {
                    toast(`New message: ${newMessage.text || "📷 Image"}`, {
                        icon: "💬"
                    });
                }
                if (settings.desktopNotifications && "Notification" in window && Notification.permission === "granted") {
                    new Notification("New Message", {
                        body: newMessage.text || "Sent an image",
                    });
                }
            }

            if (!isMessageForActiveChat) return;
            set({ messages: [...get().messages, newMessage] });
        });

        socket.on("messagesRead", ({ from }) => {
            if (from !== selectedUser._id) return;
            set({
                messages: get().messages.map((msg) =>
                    msg.senderId !== selectedUser._id ? { ...msg, isRead: true } : msg
                ),
            });
        });

        socket.on("messageDeleted", ({ messageId }) => {
            set({
                messages: get().messages.map((m) =>
                    m._id === messageId ? { ...m, isDeleted: true, text: null, image: null } : m
                ),
            });
        });

        socket.on("messageEdited", (updatedMessage) => {
            set({
                messages: get().messages.map((m) =>
                    m._id === updatedMessage._id ? updatedMessage : m
                ),
            });
        });

        socket.on("allMessagesDeleted", ({ fromUserId }) => {
            set({
                messages: get().messages.map((m) =>
                    m.senderId === fromUserId ? { ...m, isDeleted: true, text: null, image: null } : m
                ),
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
        socket.off("messagesRead");
        socket.off("messageDeleted");
        socket.off("messageEdited");
        socket.off("allMessagesDeleted");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));