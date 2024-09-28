import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        
        console.log("req: " , req.cookies.accessToken);

        const token = req.cookies?.accessToken || req.header
            ("Authorization")?.replace("Bearer ","")

        console.log("sercret_key: ", process.env.ACCESS_TOKEN_SECRET);

        // if (!token) {
        //     throw new ApiError(401, "unauthorized request ")
        // }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken")

        // if (!user) {
        //     throw new ApiError(401, "Invalid Access Token")
        // }
        req.user = user;
        next()
    } catch (error) {
        // throw new ApiError(401, error?.message ||
        //     "Invalid Access Token")
        res.status(500).json({
            "error_from_jwt: " : error
        })
    }

})