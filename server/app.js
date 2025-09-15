import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sellerRoutes from "./routes/sellerSignup.routes.js";

const app = express();

// CORS setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static file serving
app.use(express.static("public"));

// Cookie parser
app.use(cookieParser());

// Routes
app.use("/api/seller", sellerRoutes);

export { app };
