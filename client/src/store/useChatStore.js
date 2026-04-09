import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

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

    // Mark all messages from selectedUser as read (call when opening a chat)
    markAsRead: async (senderId) => {
        try {
            await axiosInstance.put(`/messages/read/${senderId}`);
            // Update local state: mark all incoming messages as read
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
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({ messages: [...get().messages, newMessage] });
        });

        // When our messages were read by the other person, update their isRead status
        socket.on("messagesRead", ({ from }) => {
            if (from !== selectedUser._id) return; // only update if it's the active conversation
            set({
                messages: get().messages.map((msg) =>
                    msg.senderId !== selectedUser._id ? { ...msg, isRead: true } : msg
                ),
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
        socket.off("messagesRead");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));