import cloudinary from "../lib/cloudinary.lib.js";
import { get_user, save_user, update_user } from "../lib/db/FireStore.db.lib.js";
import { GenerateToken } from "../lib/utils.lib.js";
import admin from "firebase-admin"


export const signup = async(req, res) => {
    //todo: check for fields format more strictly on the firebase backend

    //todo: check if handle is unique
    console.log("called signup function")
    const { tokenId, handle } = req.body
    console.log("token is", tokenId)
        //verify the token and if it is correct make a jwt 
    try {
        const { uid } = await admin.auth().verifyIdToken(tokenId);
        const x = await admin.auth().getUser(uid);
        const {
            photoURL: ProfilePic,
            displayName: FullName,
            email: Email,
            metadata: {
                creationTime: createdAt,
                lastSignInTime
            }
        } = x;
        const newUser = {
            ProfilePic: ProfilePic ? ProfilePic : "",
            FullName,
            Email,
            _id: uid,
            handle,
            createdAt,
            lastSignInTime
        };
        console.log("new user is ", newUser);
        await save_user(handle, newUser);

        GenerateToken(newUser, res);
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Invalid User data" })
    }
};
export const login = async(req, res) => {
    //todo: check for fields format more strictly on the firebase backend

    const { tokenId } = req.body;
    //verify the token and if it is correct make a jwt 
    try {
        const { uid } = await admin.auth().verifyIdToken(tokenId);
        const x = await admin.auth().getUser(uid);
        const {
            photoURL: ProfilePic,
            displayName: FullName,
            email: Email,
            metadata: {
                creationTime: createdAt,
                lastSignInTime
            }
        } = x;
        const newUser = {
            ProfilePic: ProfilePic ? ProfilePic : "",
            FullName,
            Email,
            _id: uid,
            createdAt,
            lastSignInTime
        };
        // console.log("new user is ", newUser);
        update_user(uid, newUser);
        GenerateToken(newUser, res);
        return res.status(201).json(newUser);
    } catch (error) {
        // console.log(error);
        return res.status(400).json({ message: "Invalid User data" })
    };
};
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        return res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async(req, res) => {
    console.log("entered updating profile fucntion");
    try {
        const { ProfilePic } = req.body;
        const uid = req.user._id;
        if (!ProfilePic) {
            return res.status(400).json({ message: "Profile Pic not given" });
        }
        const upload_resp = await cloudinary.uploader.upload(ProfilePic);
        // todo: instead of this update the user in firestore
        const updatedUser = {...req.user, ProfilePic: upload_resp.secure_url };
        await update_user(uid, updatedUser);
        GenerateToken(updatedUser, res);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = async(req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const giveCookie = (req, res) => {
    try {
        const token = GenerateToken(req.user, res);
        res.status(200).json(token);
    } catch (error) {
        console.log("Error in giveCookie controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};