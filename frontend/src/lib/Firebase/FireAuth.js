import { app } from "./FireApp.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
export const auth = getAuth(app);