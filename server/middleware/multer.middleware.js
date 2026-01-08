import multer, { diskStorage } from "multer";
// Multer setup
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, "public/temp"),
  // filename: (req, file, cb) => cb(null, file.originalname),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
export const upload = multer({ storage });
