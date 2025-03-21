import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import fs from "fs";
import path from "path";


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
        console.log("decoded is ", decoded);
        const user = await User.findById(decoded.context.user.id).select("-Password");
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        req.user = user;
        next();

    } catch (error) {
        console.log("Route is not protected", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        });

    }
}