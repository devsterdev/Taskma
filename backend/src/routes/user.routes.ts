import { Router } from "express";
import { logOutUser, registerUser, signInUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/signIn").post(signInUser)
router.route("/logout").post(verifyJWT, logOutUser)


export default router