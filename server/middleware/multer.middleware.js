// multer.middleware.js
import multer, { diskStorage } from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/temp");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // ✅ Add random string to make it unique
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
