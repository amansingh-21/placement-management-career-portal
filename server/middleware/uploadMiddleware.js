import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: "uploads/resumes/",

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(
      null,
      `${req.user.userId}-${crypto.randomBytes(8).toString("hex")}${ext}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];

  const ext = path
    .extname(file.originalname)
    .toLowerCase();

  if (!allowed.includes(ext)) {
    return cb(
      new Error(
        "Only PDF, DOC and DOCX files are allowed"
      )
    );
  }

  cb(null, true);
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});