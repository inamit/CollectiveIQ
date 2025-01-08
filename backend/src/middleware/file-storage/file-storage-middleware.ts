import multer, { StorageEngine } from "multer";

const createStorage = (uploadDir: string): StorageEngine => multer.diskStorage({
    destination: (req, file, cb) => cb(null, `uploads/${uploadDir}/`),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.split('.').filter(Boolean).slice(-2).join('.')}`)
})

export const userPostsUpload = multer({ storage: createStorage("posts") });
export const userAvatarUpload = multer({ storage: createStorage("avatars") });
