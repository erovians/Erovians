import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sellerRoutes from "./routes/sellerSignup.routes.js";
import fileUpload from "express-fileupload";

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
app.use('/api/uploads', express.static('uploads'))

// Cookie parser
app.use(cookieParser());

// Routes
app.use("/api/seller", sellerRoutes);

export { app };
