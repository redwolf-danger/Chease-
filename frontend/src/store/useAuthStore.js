import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import { io } from "socket.io-client"
import { auth, provider } from "../lib/Firebase/FireAuth.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as updProf, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const BASE_URL =
    // TODO : CHANGE THIS TO http://localhost:5001/api
    import.meta.env.MODE === "development" ? "localhost:5001/" : "/";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: {},
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
    googleSignIn: async(handle) => {
        set({ isSigningUp: true });
        try {
            const result = await signInWithPopup(auth, provider);
            const tokenId = await result.user.getIdToken();
            // todo: add a way to get unique handle 
            const data = {
                tokenId,
                handle
            };
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({ authUser: res.data });
            get().connectSocket()
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("error code is", errorCode);
            console.log("error message is ", errorMessage);
            console.log(error);
            toast.error("Error in Signing up")
            toast.error(error.response.data.message);
            // if (errorCode == "auth/email-already-in-use") {
            //     toast.error("Email is already in use");
            // } else {
            //     toast.error(error.response.data.message)
            // }
        } finally {
            set({ isSigningUp: false });
        }
    },
    // todo: correct this function
    googleLogIn: async() => {
        set({ isLoggingIn: true });
        try {
            const result = await signInWithPopup(auth, provider);
            const tokenId = await result.user.getIdToken();
            // todo: add a way to get unique handle 
            const data = {
                tokenId,
            };
            const res = await axiosInstance.post("/auth/login", data);
            toast.success("Logged in Successfully");
            set({ authUser: res.data });
            get().connectSocket()
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("error code is", errorCode);
            console.log("error message is ", errorMessage);
            console.log(error);
            toast.error("Error in Logging In up")
                // if (errorCode == "auth/email-already-in-use") {
                //     toast.error("Email is already in use");
                // } else {
                //     toast.error(error.response.data.message)
                // }
        } finally {
            set({ isLoggingIn: false });
        }
    },
    signup: async({ FullName, Email, Password, handle }) => {
        set({ isSigningUp: true });
        try {
            const { user } = await createUserWithEmailAndPassword(auth, Email, Password);
            await updProf(user, {
                displayName: FullName,
            });
            const tokenId = await auth.currentUser.getIdToken();
            // todo: add a way to get "unique" handle 
            const data = {
                tokenId,
                handle
            };
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
            console.log(error);
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
    updateProfile: async(data) => {
        // TODO: SEE THIS FOR UPDATION
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            const { ProfilePic } = res.data;
            // console.log("new data from backend is", res.data);
            set({ authUser: res.data });
            const user = auth.currentUser;
            await updProf(user, { photoURL: ProfilePic })
            toast.success("Profile updates successfully")
        } catch (error) {
            console.log("error in updating profile")
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    // WE DON'T HAVE A PROBLEM IN OTHERS UNAUTHORISED USERS CONNECT TO IT
    // BUT WE DO HAVE A PORBLEM WHEN THEY START DOING THINGS THEY SHOULDN'T BE ABLE TO DO LIKE SENDING MESSAGES
    connectSocket: () => {
        const { authUser, onlineUsers } = get();
        const already = get().socket
            // console.log("auth user is ", authUser);
        if (!authUser || already && already.connected) return;

        // console.log("creating socket");
        // console.log("base url is ", BASE_URL);
        // console.log("supplying with ", authUser);
        const socket = io(BASE_URL, {
            query: {
                user: JSON.stringify(authUser)
            },
            ackTimeout: 4000,
            retries: 3
        });


        // console.log("connecting the socket");
        socket.connect();
        // socket.onAny((eventName, ...args) => {
        // console.log(eventName);
        // console.log(args);
        // }); socket.onAnyOutgoing((eventName, ...args) => {
        // console.log(eventName);
        // console.log(args);
        // });


        // todo: unccmment portions of code here
        socket.on('connect', () => {
            // console.log('connected to server');
        })
        set({ socket });

        socket.on("getOnlineUsers", (handle_modified) => {
            // console.log("received for ", handle_modified);
            const user = handle_modified.user;
            const { handle } = user;
            if (handle_modified.add) {
                // handle to be added
                onlineUsers[handle] = user;

            } else {
                //handled to be subtracted
                delete onlineUsers[handle];
            }
            set({ onlineUsers });
        });

    },
    disconnectSocket: () => {
        const already = get().socket
        if (already && already.connected) get().socket.disconnect();
    }

}))