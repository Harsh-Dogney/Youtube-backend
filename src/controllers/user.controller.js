import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'; // Correct JWT import

// Generate tokens function
async function generateAccessAndRefreshTokens(userId) {
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
}

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullName,avatar } = req.body;

    const user = new User({
        username,
        email,
        fullName,
        avatar,
        password, // The password will be hashed in the pre-save middleware
    });

    await user.save();
    //console.log("User registered with hashed password:", user.password); // Log hashed password

    res.status(200).json({ message: "User registered successfully" });
});



// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Find user by username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        console.log("User not found with username or email:", { username, email });
        throw new ApiError(404, "User does not exist");
    }

    // Check if password is valid
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        console.log("Invalid password for user:", username || email);
        throw new ApiError(401, "Password incorrect");
    }

    //console.log("Password validated for user:", username || email);

    // Generate tokens if password is correct
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
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

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    try {
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
        res.status(500).json({ "Error at logout:": error.message });
    }
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET

        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    // } catch (error) {
    //     throw new ApiError(401, error?.message || "Invalid refresh token")
    // }

})

const changeCurrentPassword = asyncHandler(async(req,res) =>{
    const {oldPassword,newPassword} = req.body
    const user =await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid Old Password")
    }

    user.password = newPassword
})

export { registerUser, loginUser, logoutUser, refreshAccessToken };
