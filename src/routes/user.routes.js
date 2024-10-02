import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/changePassword").post(changeCurrentPassword)



export default router