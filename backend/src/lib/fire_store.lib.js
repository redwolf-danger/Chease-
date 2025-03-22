import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./firebase.lib";
const db = getFirestore(app);