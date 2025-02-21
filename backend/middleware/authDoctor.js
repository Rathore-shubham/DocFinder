const authDoctor = async (req, res, next) => {
    // Get the token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token after 'Bearer'

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.docId = token_decode.id; // Attach the doctor id to request body
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authDoctor;
