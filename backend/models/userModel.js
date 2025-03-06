import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // phone: { type: String, required: true },
    // dob: { type: String, required: true },
    // gender: { type: String, required: true },
    // address: { 
    //     line1: { type: String, default: "" }, 
    //     line2: { type: String, default: "" } 
    // },
    image: { type: String, default: "" }  // ✅ Add image field
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
