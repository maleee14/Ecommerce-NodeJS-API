import multer from "multer";
import fs from "fs";
import path from "path";

const upload = (folder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(process.cwd(), "images", folder);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const safeName = file.originalname.replace(/\s+/g, "_").toLowerCase();
      cb(null, uniqueSuffix + "_" + safeName);
    },
  });

  const imageFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("INVALID_FILE_TYPE"), false);
    }
  };

  return multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, //2mb
  });
};

export const productImage = () => upload("products").single("image");

export const profileImage = () => upload("profiles").single("profile_image");
