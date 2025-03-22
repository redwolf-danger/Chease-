import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
// import { app } from "firebase.lib.js"
import { app } from "./firebase.lib.js";
const auth = getAuth(app);


//it returns the uuid else throws an error
export const email_signup = async(fullname, email, password, res) => {
    console.log("-----FIREBASE -----\n ");
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("userCredential = ", userCredential);

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error code = ", errorCode);
        console.log("error message = ", errorMessage);
        return res.status(400).json({ message: "Email already exists. Try to login instead" })
    } finally {
        return 2;
    }
}

export const email_siginin = async(email, password) => {
    console.log("-----FIREBASE -----\n ");
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        console.log("sign in  = ", userCredential);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error code = ", errorCode);
        console.log("error message = ", errorMessage);
    };
}