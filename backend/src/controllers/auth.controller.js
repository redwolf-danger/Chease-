import cloudinary from "../lib/cloudinary.lib.js";
import { get_user, handleIsUnique, save_user, update_user } from "../lib/db/FireStore.db.lib.js";
import { GenerateToken } from "../lib/utils.lib.js";
import admin from "firebase-admin"


export const signup = async(req, res) => {
    //todo: check for fields format more strictly on the firebase backend

    // console.log("called signup function")
    //verify the token and if it is correct make a jwt 
    let id_user;
    try {
        const { tokenId, handle } = req.body
            // console.log("token is", tokenId)
            // console.log("handle is", handle);
        if (!tokenId) {
            return res.status(400).json({ message: "Invalid Token Provided" })
        }
        const { uid } = await admin.auth().verifyIdToken(tokenId);
        id_user = uid;
        // console.log("id_user is ", id_user);
        const uq = await handleIsUnique(handle);
        // console.log("uq is ", uq);
        if (!handle || (!uq)) {
            // console.log("entered here for user deletion");
            await admin.auth().deleteUser(id_user);
            return res.status(400).json({ message: "Handle is Invalid" })
        }

        //todo: just in case check in db if there exists a same email in use if providers are getting used
        try {
            let ans = await get_user(uid)
                // console.log("ans is ", ans);
            if (!(Object.keys(ans).length === 0)) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        } catch (error) {
            console.log("error is", error)
            return res.status(400).json({ message: "Internal Server Error" });
        }

        let x;
        try {
            x = await admin.auth().getUser(uid);
            // console.log("x is", x);
        } catch (error) {
            await admin.auth().deleteUser(id_user);
            return res.status(400).json({ message: "Internal Server Error" })
        }
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

        // todo:if time change the profilePic link

        // console.log("new user is ", newUser);
        try {
            await save_user(handle, newUser);
        } catch (error) {
            await admin.auth().deleteUser(id_user);
            return res.status(400).json({ message: "Internal Server Error" });
        }
        GenerateToken(newUser, res);
        // console.log("new user is ", newUser);
        if (newUser._id) {
            delete newUser._id;
        }
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        await admin.auth().deleteUser(id_user);
        return res.status(400).json({ message: "Invalid User Data" })
    }
};
export const login = async(req, res) => {
    const { tokenId } = req.body;
    if (!tokenId) {
        return res.status(400).json({ message: "Invalid Token Provided" })
    }
    //verify the token and if it is correct make a jwt 
    try {
        const { uid } = await admin.auth().verifyIdToken(tokenId);
        let x;
        try {
            x = await admin.auth().getUser(uid);
        } catch (error) {
            res.status(400).json({ message: "Internal Server Error" })
        }
        const {
            photoURL: ProfilePic,
            displayName: FullName,
            email: Email,
            metadata: {
                creationTime: createdAt,
                lastSignInTime
            }
        } = x;
        let newUser = {
            ProfilePic: ProfilePic ? ProfilePic : "",
            FullName,
            Email,
            _id: uid,
            createdAt,
            lastSignInTime
        };
        // console.log("new user is ", newUser);
        newUser = await update_user(uid, newUser);
        GenerateToken(newUser, res);
        if (newUser._id) {
            delete newUser._id;
        }
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
        // console.log("Error in logout controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async(req, res) => {
    // console.log("entered updating profile fucntion");
    try {
        const { ProfilePic } = req.body;
        const uid = req.user._id;
        if (!ProfilePic) {
            return res.status(400).json({ message: "Profile Pic not given" });
        }
        const upload_resp = await cloudinary.uploader.upload(ProfilePic);
        // todo: instead of this update the user in firestore
        let updatedUser = {...req.user, ProfilePic: upload_resp.secure_url };
        updatedUser = await update_user(uid, updatedUser);
        GenerateToken(updatedUser, res);
        if (newUser._id) {
            delete newUser._id;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        // console.log("error in update profile", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = async(req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        // console.log("Error in checkAuth controller", message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const giveCookie = (req, res) => {
    try {
        const token = GenerateToken(req.user, res);
        res.status(200).json(token);
    } catch (error) {
        // console.log("Error in giveCookie controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};