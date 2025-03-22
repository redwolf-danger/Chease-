import { getFirestore } from "firebase-admin/firestore"
import admin from "firebase-admin"
import { GenerateToken } from "../lib/utils.lib.js";


export const test1 = async(req, res) => {
    console.log("test function called");
    try {
        const firestore = getFirestore();
        const answer = await firestore.collection("messages").get();
        answer.forEach(doc => {
            console.log(`Document ID: ${doc.id}`, doc.data());
        });
        return res.status(200).json({
            message: "everything worked fine",
            data: answer
        })
    } catch (error) {
        console.log("Some Error Occured in Test function", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const test2 = async(req, res) => {

}
export const test3 = async(req, res) => {

}

//for signup 
export const test4 = async(req, res) => {
    //todo: check for fields format more strictly on the firebase backend
    const { ProfilePic, FullName, Email, _id, createdAt, lastSignInTime, tokenId } = req.body
    const newUser = { ProfilePic, FullName, Email, _id, createdAt, lastSignInTime };

    //verify the token and if it is correct make a jwt 
    try {
        const decodedToken = await admin.auth().verifyIdToken(tokenId);
        //valid token
        GenerateToken(newUser, res);
        return res.status(201).json(newUser);
    } catch (error) {
        //invalid token
        console.log(error);
        return req.status(400).json({ message: "Invalid User data" })
    }

}