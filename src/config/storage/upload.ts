import { Request } from "express";
import multer from "multer";
import path from "path";
import { BadRequestError } from "routing-controllers";

const allowedMimetypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: any) => {
    let uploadPath;
    if (file.mimetype.startsWith("image/")) {
      uploadPath = path.join(__dirname, "..", "..", "..", "public", "images");
    } else {
      uploadPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        "book_files"
      );
    }
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Invalid uploaded file! Only images and PDFs are accepted"
      ),
      false
    );
  }
};

const limits: multer.Options["limits"] = {
  files: 3,
  fileSize: 5 * 1024 * 1024,
};

export const upload = multer({ storage, fileFilter, limits });
