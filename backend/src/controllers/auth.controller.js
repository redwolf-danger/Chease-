import cloudinary from "../lib/cloudinary.lib.js";
import { GenerateToken } from "../lib/utils.lib.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { email_signup, email_siginin } from "../lib/firebase_auth.lib.js";
export const signup = async(req, res) => {

    try {

        //todo: check for fields format more strictly

        const { FullName, Email, Password } = req.body;
        if (!FullName || !Password || !Email) {
            return res.status(400).json({ message: "Fill all the fields" });
        }
        if (Password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters long" });
        }
        const res = await email_signup(FullName, Email, Password, res);

        //todo: uncomment these for mongo db

        // const user = await User.findOne({ Email })
        // if (user) return res.status(400).json({ message: "Email already exists. Try to login instead" });

        // const SALT = await bcrypt.genSalt(parseInt(process.env.SALT_NUMBER));
        // const HashedPassword = await bcrypt.hash(Password, SALT);
        // const newUser = new User({
        //         FullName,
        //         Email,
        //         Password: HashedPassword,
        //     })
        // console.log("User is ", newUser);

        // if (newUser) {
        //     //generate jwt token
        //     GenerateToken(newUser, res);
        //     console.log("token was generated");
        //     await newUser.save()
        //     res.status(201).json({
        //             _id: newUser._id,
        //             FullName: newUser.FullName,
        //             Email: newUser.Email,
        //             ProfilePic: newUser.ProfilePic,
        //             updatedAt: newUser.updatedAt,
        //             createdAt: newUser.createdAt,
        //         })
        //         //try to see what happens if i remove it in both signup and login
        // } else {
        //     req.status(400).json({ message: "Invalid User data" });

        // }
    } catch (error) {
        console.log('ERROR IN SIGNUP CONTROLLER', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const login = async(req, res) => {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            return res.status(400).json({ message: "Fill all the fields" });
        }
        if (Password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters long" });
        }
        // const SALT = await bcrypt.genSalt(parseInt(process.env.SALT_NUMBER));
        // const HashedPassword = await bcrypt.hash(Password, SALT);
        // const user = await User.findOne({ Email, Password: HashedPassword });
        // don't use above as there is a chance that same salt_number returns different salt instead use

        const res = email_siginin(Email, Password);
        //todo: uncomment these for mongodb 
        // const user = await User.findOne({ Email });
        // if (!user) {
        //     return res.status(400).json({
        //         message: "Invalid credentials"
        //     });
        // }


        // const isPasswordCorrect = await bcrypt.compare(Password, user.Password);
        // console.log("ispassword coorect = ", isPasswordCorrect);
        // if (isPasswordCorrect) {
        //     //login similarly
        //     GenerateToken(user, res);
        //     res.status(200).json({
        //         _id: user._id,
        //         FullName: user.FullName,
        //         Email: user.Email,
        //         ProfilePic: user.ProfilePic,
        //         updatedAt: user.updatedAt,
        //         createdAt: user.createdAt,
        //     })
        // } else {
        //     res.status(400).json({
        //         message: "Invalid credentials"
        //     });
        // }


    } catch (error) {
        console.log("INTERNAL SERVER ERROR IN LOGIN CONTROLLER", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        });
        res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async(req, res) => {
    try {
        const { ProfilePic } = req.body;
        const UserID = req.user._id;
        if (!ProfilePic) {
            return res.status(400).json({ message: "Profile Pic not given" })
        }
        const upload_resp = await cloudinary.uploader.upload(ProfilePic);
        const updatedUser = await User.findByIdAndUpdate(UserID, { ProfilePic: upload_resp.secure_url }, { new: true });
        // new = true is neceassary because by default findByIdAndUpdate returns old documnet before update
        res.status(200).json({ updatedUser });
        GenerateToken(updatedUser, res);
    } catch (error) {
        console.log("error in update profile", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkAuth = async(req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const giveCookie = (req, res) => {
    // console.log("inside giveCookie");
    try {
        const token = GenerateToken(req.user, res);
        res.status(200).json(token);
    } catch (error) {
        console.log("Error in giveCookie controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};