const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract and verify token
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request object
    req.userId = decoded.userId;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    // Handle any other errors
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = auth;
