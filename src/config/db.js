import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Mongoose return an obejct when connected0
        const connectionStart = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`\n MongoDB Connected !! DB HOST: ${connectionStart.connection.host}`);
    } catch (error) {
        console.error("MongoDB failed to connect with error: ", error);
        process.exit(1);
    }
}

export default connectDB;