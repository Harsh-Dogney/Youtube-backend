import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// Removed bcrypt since hashing is not required

const userModel = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        Fullname: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
            // unique: true,
        },
        coverimage: {
            type: String,
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

// Removed password hashing from pre-save hook
userModel.methods.isPasswordCorrect = async function (password) {
    // Compare plain text passwords directly
    return password === this.password;
};

userModel.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            Fullname: this.Fullname,
        },
        process.env.ACCESS_TOKEN_SECRET, // Fixed typo: SCECRET -> SECRET
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userModel.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userModel);
