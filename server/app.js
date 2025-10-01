import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sellerRoutes from "./routes/sellerSignup.routes.js";
import fileUpload from "express-fileupload";
import createCompany from "./routes/company.routes.js";
import productRoute from "./routes/product.route.js";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Static file serving
app.use("/api/uploads", express.static("uploads"));

// Cookie parser
app.use(cookieParser());

// Routes
app.use("/api/seller", sellerRoutes);

// Company Routes
app.use("/api/company", createCompany);

//Product ROute
app.use("/api/product", productRoute);

export { app };
