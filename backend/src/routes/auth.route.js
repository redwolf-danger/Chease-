import express from "express"
import { signup, login, logout, updateProfile, checkAuth, giveCookie } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { test1, test2, test3, test4 } from "../controllers/test.controllers.js";
const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile)

router.get("/check", protectRoute, checkAuth);

router.post("/giveCookie", protectRoute, giveCookie);
router.post("/test1", test1)
router.get("/test2", protectRoute, test2)
router.post("/test3", test3)
router.post("/test4", test4)

export default router