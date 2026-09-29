import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

// server/uploads (two levels up from server/src/utils)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");

// Save a file buffer and return a storage key like "reports/9f3a...c1.pdf"
export const saveFile = async (buffer, originalName, folder = "reports") => {
  const ext = path.extname(originalName).toLowerCase();
  const fileName = `${crypto.randomBytes(16).toString("hex")}${ext}`;
  const key = `${folder}/${fileName}`;

  const fullPath = path.join(UPLOAD_ROOT, key);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);

  return { key };
};

// Delete a file by its key (ignores files that are already gone)
export const deleteFile = async (key) => {
  if (!key) return;
  try {
    await fs.unlink(resolveKey(key));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
};

// Send a file to the browser as a download with a friendly name
export const sendFile = (res, key, downloadName) => {
  res.download(resolveKey(key), downloadName);
};

// Convert a key to a full path, and block tricks like "../../.env"
const resolveKey = (key) => {
  const fullPath = path.resolve(UPLOAD_ROOT, key);
  if (!fullPath.startsWith(UPLOAD_ROOT + path.sep)) {
    throw Object.assign(new Error("Invalid file path"), { statusCode: 400 });
  }
  return fullPath;
};