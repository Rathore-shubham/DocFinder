import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Multer Storage for Cloudinary
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "doctor_images", // Folder in Cloudinary
    });

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
});

export default router;
