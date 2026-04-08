import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,

    // Logic: Fetch all users from Erumeli (and everywhere else) to show in sidebar
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

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));