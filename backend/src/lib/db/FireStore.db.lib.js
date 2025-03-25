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
    // todo: if time change metadata to contacts for more appropriate naming
    await userRef.collection("ChatData").doc("MetaData").set(DefaultMetaData);
    const newMessage = ({
        senderHandle: handle,
        receiverHandle: handle,
        text: "Don't forget to say Chease📸 Send yourself important messages here ✅",
        image: "",
        sentAt: Date.now(),
        sent: true,
        admin: false,
    });
    save_message(newMessage);
    // console.log("User created and saved in Firestore:");
};


export const save_message = async(msg) => {
    const {
        senderHandle,
        receiverHandle
    } = msg;
    console.log("senderHandle is", senderHandle);
    console.log("receiverHandle is", receiverHandle);
    const userRef = db.collection("users").doc(senderHandle);
    console.log("reached here");
    await userRef.collection(receiverHandle).add(msg);
}

export const get_user = async(uid) => {
    const userDoc = await db.collection("users").where("_id", "==", uid).get();
    if (userDoc._size == 0) {
        return ({})
    }
    const user = userDoc.docs[0].data();
    return user;
    // console.log(userDoc.map((user) => user.data()));
}

export const get_conversation = async(user1Handle, user2Handle) => {
    let messages = [];
    // console.log("user1Handle = ", user1Handle);
    // console.log("user2Handle = ", user2Handle);
    const userRef1 = db.collection("users").doc(user1Handle);
    // console.log("fethcing data");
    const messages1Snapshot = await userRef1.collection(user2Handle).get();
    // console.log("got all the data");
    if (messages1Snapshot._size > 0) {
        messages1Snapshot.forEach((doc) => {
            messages.push(doc.data());
        })
    }
    if (user1Handle === user2Handle) return messages;
    const userRef2 = db.collection("users").doc(user2Handle);
    const messages2Snapshot = await userRef2.collection(user1Handle).get();
    if (messages2Snapshot._size > 0) {
        messages2Snapshot.forEach((doc) => {
            messages.push(doc.data);
        })
    }
    return messages;
}


export const update_user = async(uid, user) => {

    const { handle } = await get_user(uid);
    await db.collection("users").doc(handle).update(user);
    return get_user(uid);
    // return ans;
    // console.log("usar now updated");

}

// todo: create this
export const fetchUsers = async(user) => {
    const { handle } = user;
    // console.log("handle is", handle);
    const userRef = db.collection("users").doc(handle);
    const { UsersChattedWith } = (await userRef.collection("ChatData").doc("MetaData").get()).data();
    UsersChattedWith.push(user);
    // console.log("users is chatted with ", UsersChattedWith);
    return UsersChattedWith;
}

// todo create this 
export const searchAll = async(prefix) => {
    // return all the handles that are matched by this prefix;
}

/* //todo :Make function for retrieving the user based on handle 
 */
// todo: change the logo of the app
// todo: change the box design 

export const handleIsUnique = async(handle) => {
    const userDoc = (await db.collection("users").doc(handle).get()).data();
    // console.log("user Doc is", userDoc);
    if (userDoc) {
        // console.log("returning false");
        return false;
    } else {
        // console.log("returning true");
        return true;
    };
}

export const unique_handle = async(req, res) => {
    // console.log("unique_handle called");
    const { handle } = req.body;
    // console.log("handle is ", handle);
    try {
        const ans = await handleIsUnique(handle);
        // console.log('ans is', ans);
        return res.status(200).json({ unique_handle: ans })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    };
}



//-------------MESSAGE FUNCTIONALITY-----------------------------
// export const