import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Jwt } from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Access and Refresh Tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // Log the request body
    console.log("Request body:", req.body);

    // Respond with "ok" to confirm the request is received
    res.status(200).json({
        message: "ok"
    });
});


const loginUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Find the user
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Check if the password is valid
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Password incorrect");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Exclude password and refreshToken from the response
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only set secure flag in production
        sameSite: "Strict",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken,
        }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    
    try {
       
       // Ensure req.user is defined
    // if (!req.user) {
    //     throw new ApiError(401, "Unauthorized");
    // }

    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully")); 

        
    } catch (error) {
        res.status(500).json({
            "Error at logout: " : error
        })
    }

});

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const  incomingRefreshToken= req.cookie.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request ")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.ACCESS_TOKEN_SECRET
        )
        const user =await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token  ")
        }   
         
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"refresh token is expired or used ")
        }
    
        const options ={
            httpOnly: true,
            secure : true
        }
        const {newrefreshToken,accessToken}  =generateAccessAndRefreshTokens(user._id)
        return res
        .status(200)
        .Cookie("accessToken", accessToken,options)
        .Cookie("refreshToken", newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newrefreshToken},
                "Access token refressed "
    
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid  refresh token ")
    }

})

export { registerUser, loginUser, logoutUser ,refreshAccessToken};
