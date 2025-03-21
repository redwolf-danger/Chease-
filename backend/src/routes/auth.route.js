import express from "express"
import { signup, login, logout, updateProfile, checkAuth, giveCookie } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile)

router.get("/check", protectRoute, checkAuth);
//to see if route is protected or

router.post("/giveCookie", protectRoute, giveCookie);

export default router