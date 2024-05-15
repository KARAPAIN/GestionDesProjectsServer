import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ status: false, message: "No token provided. Please log in." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId).select("isAdmin email");

    if (!user) {
      return res.status(401).json({ status: false, message: "User not found." });
    }

    req.user = {
      email: user.email,
      isAdmin: user.isAdmin,
      userId: decodedToken.userId,
    };

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ status: false, message: "Invalid token. Please log in again." });
    }
    return res.status(401).json({ status: false, message: "Authentication failed. Please log in again." });
  }
};


const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) { // Ensure isAdmin is explicitly true
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Please login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };
