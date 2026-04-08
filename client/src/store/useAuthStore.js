import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser: null, // Starts as null because no one is logged in
    isSigningUp: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // The Logic: The "Signup" function for the UI
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data }); // Now the whole app knows who "Nandhu" is!
        } catch (error) {
            console.log("Error in signup:", error);
        } finally {
            set({ isSigningUp: false });
        }
    },
}));