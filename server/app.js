import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sellerRoutes from "./routes/sellerSignup.routes.js";
import uploadRoute from "./routes/upload.routes.js";
import fileUpload from "express-fileupload";

const app = express();

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Add file upload middleware here, before other route-specific middleware.
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Recommended for better temp file management
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
app.use("/api", uploadRoute); // This route will now receive the processed file

export { app };
