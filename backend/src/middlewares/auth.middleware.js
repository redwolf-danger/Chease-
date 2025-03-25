import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import fs from "fs";
import path from "path";
import { get_user } from "../lib/db/FireStore.db.lib.js";


const __dirname = path.resolve();
export const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }
        const decoded = jwt.verify(token, fs.readFileSync(path.join(__dirname, "PublicKey.pub"), 'utf8'), {
            algorithms: ["RS256"]
        });
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        };
        console.log("inside protectRoute");
        // console.log("decoded is ", decoded);
        // todo: fetch the user from the firestore
        const { context: { user: { id } } } = decoded;
        const user = await get_user(id);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        req.user = user;
        console.log("Middleware passed");
        console.log("from middlewar user = , ", user)
        next();


    } catch (error) {
        // console.log("Route is not protected", error.message);
        // console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });

    }
}