// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// // import { app } from "firebase.lib.js"
// import { app } from "./FireBase.db.lib.js";
// import { addUser } from "./FireStore.db.lib.js";

// const auth = getAuth(app);

// //it returns the uuid else throws an error
// export const email_signup = async (FullName, Email, Password, res) => {
//   console.log("-----FIREBASE -----\n ");
//   let user = null;
//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       Email,
//       Password
//     );
//     console.log("userCredential = ", userCredential);
//     const user_to_save = {
//       FullName,
//       Email,
//       // todo change format here
//     };
//     //todo: use firestore to save the user in the same format as used in mongo db and update the changes in the "user" variable
//     try {
//       await addUser(user_to_save);
//       user = user_to_save;
//     } catch (error) {
//       throw error("Internal Server Error");
//     }
//   } catch (error) {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log("error code = ", errorCode);
//     console.log("error message = ", errorMessage);
//     if (errorCode) {
//       res
//         .status(400)
//         .json({ message: "Email already exists. Try to login instead" });
//     } else {
//       res.status(400).json({ message: "Internal Server Error" });
//     }
//   } finally {
//     return user;
//   }
// };

// export const email_siginin = async (email, password) => {
//   console.log("-----FIREBASE -----\n ");
//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const user = userCredential.user;
//     console.log("sign in  = ", userCredential);
//   } catch (error) {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log("error code = ", errorCode);
//     console.log("error message = ", errorMessage);
//   }
// };