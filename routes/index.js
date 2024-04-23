import express from "express";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";

const router = express.Router();

// Define route handler for the root path
router.get("/", (req, res) => {
  // Log a message to indicate that the handler is being reached
  console.log("Handling request for the root path (/) - Route found");

  // Send a response indicating that the route was found
  res.send("Route found");
});

router.use("/user", userRoutes); //api/user/login
router.use("/task", taskRoutes);

export default router;
