// //todo: get a method to add cache here

import { DefaultMetaData, DefaultSettings } from "../../../constants.js";
import { FireApp as admin } from "./firebase.db.lib.js";
const db = admin.firestore();
// todo: modify res in all 3 functions



//-------------USER FUNCTIONALITY-----------------------------
export const save_user = async(handle, user) => {
    //assuming the handle is unique
    const userRef = db.collection("users").doc(handle);
    await userRef.set(user);
    await userRef.collection("Preferences").doc("Settings").set(DefaultSettings);
    await userRef.collection("ChatData").doc("MetaData").set(DefaultMetaData);
    // console.log("User created and saved in Firestore:");
};

export const get_user = async(uid) => {
    const userDoc = await db.collection("users").where("_id", "==", uid).get();
    if (userDoc.length == 0) return {}
    const user = userDoc.docs[0].data();
    return user;
    // console.log(userDoc.map((user) => user.data()));
}

export const update_user = async(uid, user) => {

    const { handle } = await get_user(uid);
    await db.collection("users").doc(handle).update(user);
    // return ans;
    // console.log("usar now updated");

}

// todo: create this
export const fetchUsers = async(handle) => {
    console.log("handle is", handle);
    const userRef = db.collection("users").doc(handle);
    const { UsersChattedWith } = (await userRef.collection("ChatData").doc("MetaData").get()).data();
    // console.log("users is chatted with ", UsersChattedWith);
    return UsersChattedWith
}

// todo create this 
export const searchAll = async(prefix) => {
    // return all the handles that are matched by this prefix;
}

export const getUserByHandle = async(handle) => {

}


/* //todo :Make function for retrieving the user based on handle 
 */
// todo: change the logo of the app
// todo: change the box design 

export const handleIsUnique = async(handle) => {
    const userDoc = (await db.collection("users").doc(handle).get()).data();
    console.log("user Doc is", userDoc);
    if (userDoc) {
        console.log("returning false");
        return false;
    } else {
        console.log("returning true");
        return true;
    };
}

export const unique_handle = async(req, res) => {
    console.log("unique_handle called");
    const { handle } = req.body;
    console.log("handle is ", handle);
    try {
        const ans = await handleIsUnique(handle);
        console.log('ans is', ans);
        return res.status(200).json({ unique_handle: ans })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    };
}


//-------------MESSAGE FUNCTIONALITY-----------------------------
// export const