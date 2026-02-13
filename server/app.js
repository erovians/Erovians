import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import locationRoutes from "./routes/seller/location.route.js";
import sellerRoutes from "./routes/seller/seller.routes.js";
import companyRoutes from "./routes/seller/company.routes.js";
import productRoutes from "./routes/seller/product.route.js";
import authRoutes from "./routes/seller/auth.routes.js";
import orderRoutes from "./routes/seller/orders.routes.js";
import inquiryRoute from "./routes/seller/Inquiry.route.js";
import teamRoutes from "./routes/seller/team.routes.js";
import stocksRoutes from "./routes/seller/stocks.routes.js";
import contractRoutes from "./routes/seller/contracts.routes.js";
import taskAndProjectRoutes from "./routes/seller/taskandprojects.routes.js";
import workOrders from "./routes/seller/workorder.routes.js";
import estimateRoutes from "./routes/seller/estimate.routes.js";
import globalErrorHandler from "./middleware/buyer/globalErrorHandler.js";
import userAuthRoutes from "./routes/buyer/auth.route.js";
import companyBuyerRoutes from "./routes/buyer/company.route.js";
import categoryRoutes from "./routes/category.routes.js";
import quotationRoutes from "./routes/buyer/quotation.route.js";
import authAdminRoutes from "./routes/admin/auth.routes.js";
import adminManagementRoutes from "./routes/admin/adminManagement.routes.js";
import adminVerificationRoutes from "./routes/admin/Admin.verification.routes.js";

const app = express();

// Enable JSON parsing for non-file routes
app.use(express.json({ limit: "10mb" }));

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://192.168.29.142:5173",
      "http://192.168.29.80:5173",
      "http://192.168.29.80:5174",
      "https://erovians.vercel.app",
    ],
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

//seller routes
app.use("/api/uploads", express.static("uploads"));
app.use("/api/v2/location", locationRoutes);
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/seller", sellerRoutes);
app.use("/api/v2/company", companyRoutes);
app.use("/api/v2/product", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inquiry", inquiryRoute);
app.use("/api/team", teamRoutes);
app.use("/api/stocks", stocksRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/taskandprojects", taskAndProjectRoutes);
app.use("/api/workorder", workOrders);
app.use("/api/transport", estimateRoutes);
//buyer routes
app.use("/api/v2/auth", userAuthRoutes);
app.use("/api/v2/company", companyBuyerRoutes);

app.use("/api/v2/quotation", quotationRoutes);
//admin routes
app.use("/api/v2/admin/manage", adminManagementRoutes);
app.use("/api/v2/admin", adminVerificationRoutes);
app.use("/api/v2/admin/auth", authAdminRoutes);
//common routes
app.use("/api/v2/category", categoryRoutes);
app.use(globalErrorHandler);
export { app };
