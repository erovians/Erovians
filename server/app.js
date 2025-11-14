import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import locationRoutes from "./routes/location.route.js";
import sellerRoutes from "./routes/seller.routes.js";
import companyRoutes from "./routes/company.routes.js";
import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/orders.routes.js";
// import quoteRoute from "./routes/quotation.routes.js";
import inquiryRoute from "./routes/Inquiry.route.js";

const app = express();

// Enable JSON parsing for non-file routes
app.use(express.json({ limit: "10mb" }));

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.29.142:5173"],
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// Serve static files
app.use("/api/uploads", express.static("uploads"));

//locattion route
app.use("/api/location", locationRoutes);

// Verify User Route
app.use("/api/auth", authRoutes);

// Routes
app.use("/api/seller", sellerRoutes);

// Company route (multer handles files internally)
app.use("/api/company", companyRoutes);

// Product routes
app.use("/api/product", productRoutes);

//Order routes
app.use("/api/orders", orderRoutes);

//Quotation routes
// app.use("/api/inquiry", quoteRoute);

app.use("/api/inquiry", inquiryRoute);

export { app };
