import multer from "multer";
import path from "path";

const destination = path.resolve("tmp");
const storage = multer.diskStorage({
  destination: destination,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

export default upload;
