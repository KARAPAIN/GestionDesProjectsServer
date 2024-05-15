import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decodedToken.userId).select("isAdmin email");

      if (!user) {
        return res.status(401).json({
          status: false,
          message: "User not found. Please login again.",
        });
      }

      req.user = {
        email: user.email,
        isAdmin: user.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "Not authorized. Please login again.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      status: false,
      message: "Not authorized. Please login again.",
    });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Please login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };
