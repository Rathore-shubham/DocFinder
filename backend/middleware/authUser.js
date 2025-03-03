import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }

        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Set user object with ID
        req.user = { id: decoded.id };

        // console.log("✅ Authenticated User ID:", req.user.id);

        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

export default authUser;
