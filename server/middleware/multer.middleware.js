import multer, { diskStorage } from "multer";
import path from "path";
import { fileURLToPath } from "url";

// ES module me __dirname nahi hota, manually banao
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = diskStorage({
  destination: (req, file, cb) => {
    // Absolute path bana do
    const uploadPath = path.join(__dirname, "../public/temp");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
