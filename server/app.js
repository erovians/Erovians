import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import locationRoutes from "./routes/location.route.js";
import sellerRoutes from "./routes/seller.routes.js";
import companyRoutes from "./routes/company.routes.js";
import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import inquiryRoute from "./routes/Inquiry.route.js";
import teamRoutes from "./routes/team.routes.js";
import stocksRoutes from "./routes/stocks.routes.js";
import contractRoutes from "./routes/contracts.routes.js";
import taskAndProjectRoutes from "./routes/taskandprojects.routes.js";
import workOrders from "./routes/workorder.routes.js";
import estimateRoutes from "./routes/estimate.routes.js";

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

//inquiry routes
app.use("/api/inquiry", inquiryRoute);

// teams routes
app.use("/api/team", teamRoutes);

// stocks routes
app.use("/api/stocks", stocksRoutes);

// contracts routes
app.use("/api/contracts", contractRoutes);

// task and project routes
app.use("/api/taskandprojects", taskAndProjectRoutes);

// workorder routes
app.use("/api/workorder", workOrders);

// workorder routes
app.use("/api/transport", estimateRoutes);

export { app };
