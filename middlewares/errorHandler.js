import multer from "multer";

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ status: false, message: "MAXIMUM_FILE_SIZE_2MB" });
    }
  } else if (err.message === "INVALID_FILE_TYPE") {
    return res
      .status(400)
      .json({ status: false, message: "INVALID_FILE_TYPE" });
  }
  next(err);
};
