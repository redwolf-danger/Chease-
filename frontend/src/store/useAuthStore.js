import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL =
    import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],
    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({
                authUser: res.data
            })
            get().connectSocket()
        } catch (error) {
            console.log("Error in authentication", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async(data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({ authUser: res.data });
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in signing up");
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async() => {

        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch {
            toast.error("Failed to Log Out")
        }
    },
    login: async(data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            get().connectSocket()
            toast.success("Logged In successfully");

        } catch {
            toast.error("Failed to Log In. Try Again")
        } finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });

        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updates successfully")
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message);

        } finally {
            set({ isUpdatingProfile: false });
        }

    },
    connectSocket: () => {
        const { authUser } = get()
        const already = get().socket
        if (!authUser || already && already.connected) return;


        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect();
        set({ socket });
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

    },
    disconnectSocket: () => {
        const already = get().socket
        if (already && already.connected) get().socket.disconnect();
    }

}))