import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();  // Load .env file

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;


        if (!mongoURI.startsWith("mongodb://") && !mongoURI.startsWith("mongodb+srv://")) {
            throw new Error("Invalid MongoDB URI format");
        }


        const connectionInstance = await mongoose.connect(mongoURI);

        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
};

export default connectDB;
