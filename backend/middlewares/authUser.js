// middlewares/authUser.js
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    console.log("Token sent to backend:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }

    req.userId = decoded.id; // ✅ Use this key throughout your controllers
    next();
  } catch (error) {
    console.error("authUser middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token is invalid or expired.",
    });
  }
};

export default authUser;
