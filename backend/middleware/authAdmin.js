import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }
    
    const token = authHeader.split(" ")[1]; // Extract the token
    
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Access Denied. Unauthorized Admin." });
        }
    
        req.admin = token_decode;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Invalid Token. Login Again." });
    }
    
};

export default authAdmin;
