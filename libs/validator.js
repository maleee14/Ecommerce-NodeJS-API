import fs from "fs";
import path from "path";

export const isRequired = (value, fieldName) => {
  if (value == undefined || value == null || value == "") {
    throw { code: 400, message: `${fieldName.toUpperCase()}_IS_REQUIRED` };
  }
};

export const validateEmail = (email) => {
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(email)) {
    throw { code: 400, message: "INVALID_EMAIL" };
  }
};

export const minimumChar = (value, num, fieldName) => {
  if (!value || value.length < num) {
    throw {
      code: 400,
      message: `${fieldName.toUpperCase()}_MINIMUM_${num}_CHARACTERS`,
    };
  }
};

export const removeImage = (filename, folder) => {
  if (!filename) return; // kalau kosong, langsung keluar

  const imagePath = path.join(process.cwd(), "images", folder, filename);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log(`Image ${filename} berhasil dihapus`);
  }
};
