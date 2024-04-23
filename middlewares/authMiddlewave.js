import jwt from "jsonwebtoken";
import User from "../models/user.js";

const login = async (req, res) => {
  try {
    // Your login logic to authenticate the user and generate a token
    // Assuming you have `user` and `token` variables after successful login

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Example expiry time
    });

    // Set cookie in the response
    res.cookie("token", token, {
      httpOnly: true, // Cookie is only accessible via HTTP(S) requests
      secure: process.env.NODE_ENV === "production", // Cookie is only sent over HTTPS in production
      sameSite: "strict", // Prevents cross-site request forgery
      maxAge: 3600000, // Example: Cookie expires after 1 hour (in milliseconds)
      path: "/", // Set the cookie path to root
    });

    res.status(200).json({ status: true, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: false, message: "Login failed" });
  }
};

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const resp = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );

      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { login, protectRoute, isAdminRoute };
