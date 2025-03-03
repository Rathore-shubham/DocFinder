import mongoose from "mongoose";
import dotenv from "dotenv";
import doctorModel from "./models/doctorModel.js"; // Adjust path if needed

dotenv.config(); // Load environment variables

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MongoDB connection string is missing in .env file!");
    process.exit(1);
}

const deleteAllDoctors = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("✅ Connected to MongoDB!");

        const result = await doctorModel.deleteMany(); // Delete all doctors
        console.log(`🗑️ Deleted ${result.deletedCount} doctors successfully!`);

        mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error("❌ Error deleting doctors:", error);
        process.exit(1);
    }
};

deleteAllDoctors();
