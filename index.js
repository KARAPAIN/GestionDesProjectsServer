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
const crypto = require("crypto");

// Generate a secure random string for session secret
const sessionSecret = crypto.randomBytes(64).toString("hex");


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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 604800000, // one week
      sameSite: "none",
      secure: true,
    },
    store: store,
  })
);


app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
