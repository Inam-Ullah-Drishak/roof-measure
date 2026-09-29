import multer from "multer";
import path from "path";

// Allowed file extensions and the format we store in the order
export const FORMAT_BY_EXTENSION = {
  ".pdf": "pdf",
  ".esx": "esx",
  ".xml": "xml",
  ".dxf": "dxf",
  ".jpg": "image",
  ".jpeg": "image",
  ".png": "image",
};

// Cloudinary's free plan rejects raw files over 10 MB, so default lower there.
// Override with MAX_UPLOAD_MB (e.g. after upgrading the plan).
const MAX_FILE_SIZE_MB =
  Number(process.env.MAX_UPLOAD_MB) || (process.env.CLOUDINARY_URL ? 10 : 25);
const MAX_FILES = 5;

const upload = multer({
  storage: multer.memoryStorage(), // keep in memory, storage.js saves it
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: MAX_FILES,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (FORMAT_BY_EXTENSION[ext]) {
      cb(null, true);
    } else {
      cb(
        Object.assign(
          new Error(
            `File type not allowed: ${file.originalname}. Allowed: ${Object.keys(
              FORMAT_BY_EXTENSION
            ).join(", ")}`
          ),
          { statusCode: 400 }
        )
      );
    }
  },
});

// Accepts up to 5 files in a form field named "files"
// and turns multer errors into clear 400 messages
export const uploadReportFiles = (req, res, next) => {
  upload.array("files", MAX_FILES)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: `Each file must be under ${MAX_FILE_SIZE_MB} MB`,
        LIMIT_FILE_COUNT: `You can upload up to ${MAX_FILES} files at once`,
        LIMIT_UNEXPECTED_FILE: `Files must be sent in a field named "files"`,
      };
      return res
        .status(400)
        .json({ message: messages[err.code] || err.message });
    }

    next(err);
  });
};