import { create } from "zustand"
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js"
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    sendMessage: async(msg) => {
        const {
            selectedUser,
            messages
        } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser.handle}`, msg);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    getUsers: async() => {
        set({ isUsersLoading: true });
        try {
            const { data: res } = await axiosInstance.get("messages/users");
            set({ users: res.filteredUsers });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    // todo: change userId to userHandle wherever this is used
    getMessages: async(user2Handle) => {
        set({
            isMessagesLoading: true
        });
        try {
            const res = await axiosInstance.get(`/messages/${user2Handle}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket
            // what is get state ?


        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))