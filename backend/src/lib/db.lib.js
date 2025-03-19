import mongoose from "mongoose"

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`mongodb connected successfully ${conn.connection.host}`)
    } catch (error) {
        console.log("MONGODB Connection error: ", error);
    }
};
//note how we don't need to import dotenv here since we already have imported it in the entry index.js