import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const fileStorageErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                return res.status(400).json({ error: "File size exceeds the allowed limit." });
            default:
                return res.status(400).json({ error: "File upload error." });
        }
    } else if (err) {
        return res.status(400).json({ error: err.message || "Unknown error occurred during file upload." });
    }
    next();
};
