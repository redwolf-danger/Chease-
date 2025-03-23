import cloudinary from "../lib/cloudinary.lib.js";
import { get_user, save_user, update_user } from "../lib/db/FireStore.db.lib.js";
import { GenerateToken } from "../lib/utils.lib.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import admin from "firebase-admin"


export const signup = async(req, res) => {
    //todo: check for fields format more strictly on the firebase backend
    const { tokenId } = req.body
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
        console.log("new user is ", newUser);
        await save_user(newUser);

        GenerateToken(newUser, res);
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Invalid User data" })
    }
    // try {
    //    

    //     const { FullName, Email, Password } = req.body;
    //     if (!FullName || !Password || !Email) {
    //         return res.status(400).json({ message: "Fill all the fields" });
    //     }
    //     if (Password.length < 6) {
    //         return res
    //             .status(400)
    //             .json({ message: "Password must be atleast 6 characters long" });
    //     }
    //     const user = await email_signup(FullName, Email, Password, res);

    //     //todo: uncomment these for mongo db

    //     // const user = await User.findOne({ Email })
    //     // if (user) return res.status(400).json({ message: "Email already exists. Try to login instead" });

    //     // const SALT = await bcrypt.genSalt(parseInt(process.env.SALT_NUMBER));
    //     // const HashedPassword = await bcrypt.hash(Password, SALT);
    //     // const newUser = new User({
    //     //         FullName,
    //     //         Email,
    //     //         Password: HashedPassword,
    //     //     })
    //     // console.log("User is ", newUser);

    //     // if (newUser) {
    //     //     //generate jwt token
    //     //     GenerateToken(newUser, res);
    //     //     console.log("token was generated");
    //     //     await newUser.save()
    //     //     res.status(201).json({
    //     //             _id: newUser._id,
    //     //             FullName: newUser.FullName,
    //     //             Email: newUser.Email,
    //     //             ProfilePic: newUser.ProfilePic,
    //     //             updatedAt: newUser.updatedAt,
    //     //             createdAt: newUser.createdAt,
    //     //         })
    //     //         //try to see what happens if i remove it in both signup and login
    //     // } else {
    //     //     req.status(400).json({ message: "Invalid User data" });

    //     // }
    //     console.log("reached here meaning authentication done");
    //     if (user) {
    //         GenerateToken(user, res);
    //         console.log("user token created");
    //         return res.status(201).json(user);
    //         // todo : modify the user here
    //     } else {
    //         return res.status(400).json({ message: "Invalid User Data" });
    //     }
    // } catch (error) {
    //     console.log("ERROR IN SIGNUP CONTROLLER", error.message);
    //     return res.status(500).json({ message: "Internal Server Error" });
    // }
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
        console.log("new user is ", newUser);
        update_user(uid, newUser);

        GenerateToken(newUser, res);
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Invalid User data" })
    };
    // try {
    //     const { Email, Password } = req.body;
    //     if (!Email || !Password) {
    //         return res.status(400).json({ message: "Fill all the fields" });
    //     }
    //     if (Password.length < 6) {
    //         return res
    //             .status(400)
    //             .json({ message: "Password must be atleast 6 characters long" });
    //     }
    //     // const SALT = await bcrypt.genSalt(parseInt(process.env.SALT_NUMBER));
    //     // const HashedPassword = await bcrypt.hash(Password, SALT);
    //     // const user = await User.findOne({ Email, Password: HashedPassword });
    //     // don't use above as there is a chance that same salt_number returns different salt instead use

    //     const res = email_siginin(Email, Password);
    //     //todo: uncomment these for mongodb
    //     // const user = await User.findOne({ Email });
    //     // if (!user) {
    //     //     return res.status(400).json({
    //     //         message: "Invalid credentials"
    //     //     });
    //     // }

    //     // const isPasswordCorrect = await bcrypt.compare(Password, user.Password);
    //     // console.log("ispassword coorect = ", isPasswordCorrect);
    //     // if (isPasswordCorrect) {
    //     //     //login similarly
    //     //     GenerateToken(user, res);
    //     //     res.status(200).json({
    //     //         _id: user._id,
    //     //         FullName: user.FullName,
    //     //         Email: user.Email,
    //     //         ProfilePic: user.ProfilePic,
    //     //         updatedAt: user.updatedAt,
    //     //         createdAt: user.createdAt,
    //     //     })
    //     // } else {
    //     //     res.status(400).json({
    //     //         message: "Invalid credentials"
    //     //     });
    //     // }
    // } catch (error) {
    //     console.log("INTERNAL SERVER ERROR IN LOGIN CONTROLLER", error.message);
    //     res.status(500).json({ message: "Internal Server Error" });
    // }
};
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async(req, res) => {
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
        res.status(200).json({ data: updatedUser });
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