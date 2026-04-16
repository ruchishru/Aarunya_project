import jwt from "jsonwebtoken"

// admin authentication middleware
// backend/middleware/authAdmin.js
const authAdmin = async (req, res, next) => {
    try {
        // Express auto-lowercases headers, so 'atoken' is usually correct
        const { atoken } = req.headers;

        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }

        next();
    } catch (error) {
        res.json({ success: false, message: "Session Expired" });
    }
}

export default authAdmin;