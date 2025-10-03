import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sellerRoutes from "./routes/sellerSignup.routes.js";
import createCompany from "./routes/company.routes.js";
import productRoute from "./routes/product.route.js";

const app = express();

// Enable JSON parsing for non-file routes
app.use(express.json({ limit: "10mb" }));

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// Serve static files
app.use("/api/uploads", express.static("uploads"));

// Routes
app.use("/api/seller", sellerRoutes);

// Company route (multer handles files internally)
app.use("/api/company", createCompany);

// Product routes
app.use("/api/product", productRoute);

export { app };
