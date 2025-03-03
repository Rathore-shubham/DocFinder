import multer from "multer";

const storage = multer.memoryStorage(); // ✅ Use memory instead of disk

const upload = multer({ storage });

export default upload;
