import multer, { FileFilterCallback, StorageEngine } from "multer";
import { Request, Response } from "express";
import { fileStorageErrorHandler } from "./file-storage-error-handler";
import path from "path";
import fs from "fs";

const destinationDir: string = "uploads";
const createStorage = (uploadDir: string): StorageEngine => {
  const absoluteUploadDir = path.join(
    __dirname,
    "..",
    "..",
    destinationDir,
    uploadDir
  );

  if (!fs.existsSync(absoluteUploadDir)) {
    fs.mkdirSync(absoluteUploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, `${destinationDir}/${uploadDir}/`),
    filename: (req, file, cb) =>
      cb(
        null,
        `${Date.now()}-${file.originalname
          .split(".")
          .filter(Boolean)
          .slice(-2)
          .join(".")}`
      ),
  });
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
  }
};

const uploadWithConfig = (uploadDir: string) =>
  multer({
    storage: createStorage(uploadDir),
    limits: {
      fileSize: Number(process.env.FILE_SIZE_LIMIT),
    },
    fileFilter,
  });

export const userPostsUpload = uploadWithConfig("posts");
export const userAvatarUpload = uploadWithConfig("avatars");

export const saveFile = (req: Request, res: Response): void => {
  try {
    res.status(200).send({ url: process.env.BASE_URL! + req.file?.path });
  } catch (err: any) {
    console.warn(`Error saving file: `, err);
    fileStorageErrorHandler(err, req, res, () => {});
  }
};
