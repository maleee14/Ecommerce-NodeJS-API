import fs from "fs";
import path from "path";

const formattedField = (field) => {
  return field.replace(/\s+/g, "_").toUpperCase();
};

export const isRequired = (value, fieldName) => {
  if (value == undefined || value == null || value == "") {
    const formatted = formattedField(fieldName);
    throw { code: 400, message: `${formatted}_IS_REQUIRED` };
  }
};

export const validateEmail = (email) => {
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(email)) {
    throw { code: 400, message: "INVALID_EMAIL" };
  }
};

export const minimumChar = (value, num, fieldName) => {
  if (!value || value.length < num) {
    const formatted = formattedField(fieldName);
    throw {
      code: 400,
      message: `${formatted}_MINIMUM_${num}_CHARACTERS`,
    };
  }
};

export const removeImage = (filename, folder) => {
  if (!filename) return; // kalau kosong, langsung keluar

  const imagePath = path.join(process.cwd(), "images", folder, filename);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};
