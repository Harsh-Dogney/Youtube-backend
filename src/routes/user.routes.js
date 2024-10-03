import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

//     getUserChannelProfile,
//     getWatchHistory
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/changePassword").post(changeCurrentPassword)

router.route("/changepassword").post(verifyJWT, changeCurrentPassword)
router.route("/currentuser").get(verifyJWT,getCurrentUser)
router.route("/updateaccount").patch(updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("coverimage").patch(verifyJWT,upload.single("coverimage"),updateUserCoverImage)
router.route("/c/:channelprofile").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)



export default router