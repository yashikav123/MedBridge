// middlewares/authDoctor.js
import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const token = req.headers.token;

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
        message: "Invalid token.",
      });
    }

    req.doctorId = decoded.id; // ✅ available in controllers
    next();
  } catch (error) {
    console.error("authDoctor middleware error:", error.message);
    res.status(401).json({
      success: false,
      message: "Unauthorized. Token invalid or expired.",
    });
  }
};

export default authDoctor;
