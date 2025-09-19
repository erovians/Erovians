import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sellerRoutes from "./routes/sellerSignup.routes.js";
import fileUpload from "express-fileupload";
import createCompany from "./routes/company.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Add file upload middleware here
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static file serving
app.use(express.static("public"));

// Cookie parser
app.use(cookieParser());

// Routes
app.use("/api/seller", sellerRoutes);

// Company Routes
app.use("/api/company", createCompany);

export { app };
