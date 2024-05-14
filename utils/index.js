import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connection established");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Log the token
  console.log("Generated token:", token);

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Set to true in production
    sameSite: "None", // Allow cross-site requests
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  };

  // Set the cookie
  res.cookie("token", token, cookieOptions);

  return token;
};



};
