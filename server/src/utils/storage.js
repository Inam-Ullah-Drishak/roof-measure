import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v2 as cloudinary } from "cloudinary";

// Three storage drivers with the same functions, picked from .env:
//  - Cloudinary: used when CLOUDINARY_URL is set. Files are stored as private
//    "raw" files, so nobody can open them without going through our API.
//  - S3: used when S3_BUCKET is set. Works with AWS S3, Cloudflare R2,
//    DigitalOcean Spaces, Backblaze B2 (set S3_ENDPOINT for non-AWS).
//  - Local disk (development): server/uploads. Most hosts wipe this on redeploy,
//    so don't use it in production.
export const STORAGE_DRIVER = process.env.CLOUDINARY_URL
  ? "cloudinary"
  : process.env.S3_BUCKET
    ? "s3"
    : "local";

const useCloudinary = STORAGE_DRIVER === "cloudinary";
const useS3 = STORAGE_DRIVER === "s3";

if (useCloudinary) {
  cloudinary.config({ secure: true }); // reads CLOUDINARY_URL from .env
}

if (STORAGE_DRIVER === "local" && process.env.NODE_ENV === "production") {
  console.warn(
    "No CLOUDINARY_URL or S3_BUCKET set: report files are stored on local disk and may be lost on redeploy"
  );
}

// Private raw files: only reachable with a signed, short-lived API link
const CLOUDINARY_OPTIONS = { resource_type: "raw", type: "private" };

let s3;
const getS3 = () => {
  if (!s3) {
    s3 = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3;
};

const notFound = () =>
  Object.assign(new Error("File not found"), { statusCode: 404 });

// Only keys we created are allowed, e.g. "reports/9f3a...c1.pdf".
// Blocks tricks like "../../.env" for both drivers.
const assertValidKey = (key) => {
  if (!/^[a-z0-9_-]+\/[a-f0-9]{32}(\.[a-z0-9]{1,10})?$/.test(key)) {
    throw Object.assign(new Error("Invalid file path"), { statusCode: 400 });
  }
};

// ---------- Local disk ----------

// server/uploads (two levels up from server/src/utils)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");

const localPath = (key) => {
  assertValidKey(key);
  return path.join(UPLOAD_ROOT, key);
};

// ---------- Public functions ----------

// Save a file buffer and return a storage key like "reports/9f3a...c1.pdf"
export const saveFile = async (buffer, originalName, folder = "reports") => {
  const ext = path.extname(originalName).toLowerCase();
  const key = `${folder}/${crypto.randomBytes(16).toString("hex")}${ext}`;

  if (useCloudinary) {
    await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { ...CLOUDINARY_OPTIONS, public_id: key, overwrite: false },
          (err, result) => (err ? reject(cloudinaryError(err)) : resolve(result))
        )
        .end(buffer);
    });
  } else if (useS3) {
    await getS3().send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buffer,
      })
    );
  } else {
    const fullPath = localPath(key);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
  }

  return { key };
};

// Delete a file by its key (ignores files that are already gone)
export const deleteFile = async (key) => {
  if (!key) return;

  if (useCloudinary) {
    assertValidKey(key);
    // Returns "not found" for missing files, which is fine
    await cloudinary.uploader.destroy(key, {
      ...CLOUDINARY_OPTIONS,
      invalidate: true,
    });
    return;
  }

  if (useS3) {
    assertValidKey(key);
    // S3 delete succeeds even if the file doesn't exist
    await getS3().send(
      new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key })
    );
    return;
  }

  try {
    await fs.unlink(localPath(key));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
};

// Send a file to the browser as a download with a friendly name.
// Files are streamed through the API so the owner/payment checks always apply.
export const sendFile = async (res, key, downloadName) => {
  if (useCloudinary) {
    assertValidKey(key);

    // Signed link valid for 1 minute, only used by our server
    const url = cloudinary.utils.private_download_url(key, "", {
      ...CLOUDINARY_OPTIONS,
      expires_at: Math.floor(Date.now() / 1000) + 60,
    });

    const upstream = await fetch(url);
    if (upstream.status === 404) throw notFound();
    if (!upstream.ok) {
      throw Object.assign(
        new Error(`File storage error (${upstream.status})`),
        { statusCode: 502 }
      );
    }

    return streamToResponse(
      res,
      Readable.fromWeb(upstream.body),
      upstream.headers.get("content-length"),
      downloadName,
      key
    );
  }

  if (!useS3) {
    const fullPath = localPath(key);
    await new Promise((resolve, reject) => {
      res.download(fullPath, downloadName, (err) => {
        if (!err || res.headersSent) return resolve();
        reject(err.code === "ENOENT" || err.status === 404 ? notFound() : err);
      });
    });
    return;
  }

  assertValidKey(key);

  let object;
  try {
    object = await getS3().send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key })
    );
  } catch (err) {
    if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
      throw notFound();
    }
    throw err;
  }

  return streamToResponse(res, object.Body, object.ContentLength, downloadName, key);
};

const streamToResponse = async (res, body, length, downloadName, key) => {
  res.attachment(downloadName); // sets Content-Disposition and Content-Type
  if (length) res.setHeader("Content-Length", length);

  try {
    await pipeline(body, res);
  } catch (err) {
    // Usually the user cancelled the download; nothing more to send
    if (!res.headersSent) throw err;
    console.error(`Download of ${key} interrupted: ${err.message}`);
  }
};

// Cloudinary errors are plain objects like { message, http_code }
const cloudinaryError = (err) =>
  Object.assign(new Error(`File storage error: ${err.message}`), {
    statusCode: err.http_code === 400 ? 400 : 502,
  });
