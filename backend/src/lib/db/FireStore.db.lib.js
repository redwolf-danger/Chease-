// //todo: get a method to add cache here

import { FireApp as admin } from "./firebase.db.lib.js";
const db = admin.firestore();

// todo: modify res in all 3 functions

export const save_user = async(user) => {
    await db.collection("users").doc(user._id).set(user);
    console.log("User created and saved in Firestore:");
};

export const get_user = async(uid) => {
    const userDoc = await db.collection("users").doc(uid).get();
    console.log("user document from firestore is ", userDoc.data());
    return userDoc.data();
}

export const update_user = async(uid, user) => {
    await db.collection("users").doc(uid).update(user);
    console.log("usar now updated");
}