import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    // Delete file from local storage after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
