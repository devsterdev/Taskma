import { Router } from "express";
import { logOutUser, registerUser, signInUser, getUserProfile } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";



const router = Router()

router.route("/register").post(registerUser)
router.route("/signIn").post(signInUser)
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/profile").get(verifyJWT, getUserProfile)


export default router