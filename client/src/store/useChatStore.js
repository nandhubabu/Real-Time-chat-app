import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

let messageHandlers = {};

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
                users: get().users.map((user) =>
                    user._id === senderId ? { ...user, unreadCount: 0 } : user
                ),
            });
        } catch (error) {
            console.log("Error marking messages as read:", error);
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        // Clean up old ones just in case
        get().unsubscribeFromMessages();

        messageHandlers.handleNewMessage = (newMessage) => {
            const currentSelectedUser = get().selectedUser;
            const isMessageForActiveChat = currentSelectedUser && newMessage.senderId === currentSelectedUser._id;

            if (!isMessageForActiveChat) {
                const isUserInList = get().users.some(u => u._id === newMessage.senderId);
                if (!isUserInList) {
                    get().getUsers(); // Refresh the sidebar completely to pull in the new contact and their unread count
                } else {
                    set({
                        users: get().users.map((user) =>
                            user._id === newMessage.senderId
                                ? { ...user, unreadCount: (user.unreadCount || 0) + 1 }
                                : user
                        )
                    });
                }
                return;
            }

            set({ messages: [...get().messages, newMessage] });

            // Mark it as read immediately since we are looking at the chat!
            get().markAsRead(currentSelectedUser._id);
        };

        messageHandlers.handleMessagesRead = ({ readBy }) => {
            const currentSelectedUser = get().selectedUser;
            if (!currentSelectedUser || readBy !== currentSelectedUser._id) return;
            set({
                messages: get().messages.map((msg) =>
                    msg.senderId !== currentSelectedUser._id ? { ...msg, isRead: true } : msg
                ),
            });
        };

        messageHandlers.handleMessageDeleted = ({ messageId }) => {
            set({
                messages: get().messages.map((m) =>
                    m._id === messageId ? { ...m, isDeleted: true, text: null, image: null } : m
                ),
            });
        };

        messageHandlers.handleMessageEdited = (updatedMessage) => {
            set({
                messages: get().messages.map((m) =>
                    m._id === updatedMessage._id ? updatedMessage : m
                ),
            });
        };

        messageHandlers.handleAllMessagesDeleted = ({ fromUserId }) => {
            set({
                messages: get().messages.map((m) =>
                    m.senderId === fromUserId ? { ...m, isDeleted: true, text: null, image: null } : m
                ),
            });
        };

        socket.on("newMessage", messageHandlers.handleNewMessage);
        socket.on("messagesRead", messageHandlers.handleMessagesRead);
        socket.on("messageDeleted", messageHandlers.handleMessageDeleted);
        socket.on("messageEdited", messageHandlers.handleMessageEdited);
        socket.on("allMessagesDeleted", messageHandlers.handleAllMessagesDeleted);
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket || !Object.keys(messageHandlers).length) return;

        socket.off("newMessage", messageHandlers.handleNewMessage);
        socket.off("messagesRead", messageHandlers.handleMessagesRead);
        socket.off("messageDeleted", messageHandlers.handleMessageDeleted);
        socket.off("messageEdited", messageHandlers.handleMessageEdited);
        socket.off("allMessagesDeleted", messageHandlers.handleAllMessagesDeleted);

        messageHandlers = {};
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));