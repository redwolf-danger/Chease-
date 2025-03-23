import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import { io } from "socket.io-client"
import { auth } from "../lib/Firebase/FireAuth.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as updProf } from "firebase/auth";


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
    // todo: modify check method
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
    signup: async({ FullName, Email, Password }) => {
        set({ isSigningUp: true });
        try {
            const { user } = await createUserWithEmailAndPassword(auth, Email, Password);
            await updProf(user, {
                displayName: FullName,
            });

            // const { photoURL, uid, metadata: { creationTime: createdAt, lastSignInTime } } = auth.currentUser;
            const tokenId = await auth.currentUser.getIdToken();

            //  ProfilePic: photoURL, FullName, Email, _id: uid, createdAt, lastSignInTime, 
            const data = { tokenId };
            //todo make a query to backend to get the user and 
            // todo: modify _id to uid

            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({ authUser: res.data });
            get().connectSocket()

        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("error code is", errorCode);
            console.log("error message is ", errorMessage);
            toast.error("Error in Signing up")
            if (errorCode == "auth/email-already-in-use") {
                toast.error("Email is already in use");
            } else {
                toast.error(error.response.data.message)
            }
        } finally {
            set({ isSigningUp: false });
        }
    },
    // todo change this soon
    // signup: async(data) => {
    //     set({ isSigningUp: true });
    //     try {
    //         const res = await axiosInstance.post("/auth/signup", data);
    //         toast.success("Account created successfully");
    //         set({ authUser: res.data });
    //         get().connectSocket()
    //     } catch (error) {
    //         toast.error(error.response.data.message)
    //         console.log("Error in signing up");
    //     } finally {
    //         set({ isSigningUp: false });
    //     }
    // },
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
    login: async({ Email, Password }) => {
        set({ isLoggingIn: true });
        try {
            // const { user: { uid } } =
            // console.log("user is ", uid);
            await signInWithEmailAndPassword(auth, Email, Password)
            const tokenId = await auth.currentUser.getIdToken();
            const data = { tokenId }
            const res = await axiosInstance.post("/auth/login", data);
            toast.success("Logged In successfully")
            set({ authUser: res.data });
            get().connectSocket();

        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('error is', error);
            console.log("error code is", errorCode);
            console.log("error message is ", errorMessage);
            toast.error("Error in Signing In")
            if (errorCode == "auth/invalid-credential") {
                toast.error("Invalid Credentials");
            } else {
                toast.error(error.response.data.message)
            }
        } finally {
            set({ isLoggingIn: false });
        };
    },
    // todo: change this (uncomment this)
    // login: async(data) => {
    //     set({ isLoggingIn: true });
    //     try {
    //         const res = await axiosInstance.post("/auth/login", data);
    //         set({ authUser: res.data });
    //         get().connectSocket()
    //         toast.success("Logged In successfully");

    //     } catch {
    //         toast.error("Failed to Log In. Try Again")
    //     } finally {
    //         set({ isLoggingIn: false });
    //     }
    // },
    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });

        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            const { ProfilePic } = res.data;
            const user = auth.currentUser;
            await updProf(user, { photoURL: ProfilePic })
            set({ authUser: res.data });
            toast.success("Profile updates successfully")
        } catch (error) {
            console.log("error in updating profile")
            console.log(error);
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