import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    // Log the token received
    console.log("Received Token:", atoken);

    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: "Token missing. Please login again.",
      });
    }

    // Verify token
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);
    console.log("Expected:", `${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD}`);

    if (decoded.data !== `${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD}`) {
      return res.status(401).json({
        success: false,
        message: "Invalid token data. Access denied.",
      });
    }

    // Optionally store decoded admin info in request for use in other routes
    req.admin = decoded;

    next();
  } catch (error) {
    console.error("Error in authAdmin middleware:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token is invalid or expired.",
    });
  }
};

export default authAdmin;
