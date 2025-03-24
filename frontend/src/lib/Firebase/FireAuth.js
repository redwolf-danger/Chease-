import { app } from "./FireApp.js";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();