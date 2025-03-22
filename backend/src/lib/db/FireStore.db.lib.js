// import { getFirestore, collection, addDoc } from "firebase/firestore";
// import { app } from "./FireBase.db.lib.js";
// const db = getFirestore(app);
// //todo: get a method to add cache here

// export const addUser = async (user) => {
//   const docRef = await addDoc(collection(db, "users"), user);
//   // console.log("Document written with ID: ", docRef.id);
//   return docRef.id;
// };
import { getFirestore } from "firebase-admin/firestore"