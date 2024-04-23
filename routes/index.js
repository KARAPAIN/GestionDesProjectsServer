import express from "express";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";

const router = express.Router();

// Define route handler for the root path
router.get("/", (req, res) => {
  // Define JSON data to be returned
  const jsonData = {
    message: "Backend is working fine!",
    timestamp: new Date().toISOString(),
  };

  // Return JSON response
  res.json(jsonData);
});

router.use("/user", userRoutes); //api/user/login
router.use("/task", taskRoutes);

export default router;
