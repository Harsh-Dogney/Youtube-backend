import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userModel = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,

        },
        Fullname: {
            type: String,
            require: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            require: true,
            unique: true,
        },
        coverimage: {
            type: String,

        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            require: [true, 'Password is required'],
        },
        refreshToken: {
            type: String,
        },

    },
    { timestamps: true })

userModel.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userModel.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userModel.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            Fullname: this.Fullname,
        },
        process.env.ACCESS_TOKEN_SCECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userModel.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userModel)