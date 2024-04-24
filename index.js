import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/index.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://karapain.github.io",
      "https://karapain.github.io/GestionDesProjectsPFE/",
      "https://karapain.github.io/GestionDesProjectsPFE",
            ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
// Set CORS headers middleware
app.use((req, res, next) => {
  // Allow requests from specified origin
  // res.setHeader('Access-Control-Allow-Origin', 'https://karapain.github.io');
  res.setHeader('Access-Control-Allow-Origin', 'https://karapain.github.io/GestionDesProjectsPFE/');

  // Allow credentials to be sent with cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Allow only specific methods to be used for CORS
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');

  // Set other CORS headers as needed
  // res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Continue to the next middleware
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
