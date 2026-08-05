/**
 * uploadRouter.ts
 * Express route for product/logo image uploads.
 * POST /api/upload/image  — multipart/form-data, field "file"
 * Validates: jpg, jpeg, png, webp; max 5 MB
 * Returns: { url: "/manus-storage/..." }
 */
import { Router } from "express";
import type { Request, Response, Express } from "express";
import multer from "multer";
import type { FileFilterCallback } from "multer";
import sharp from "sharp";
import { storagePut } from "./storage";
import { sdk } from "./_core/sdk";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Store in memory so we can process with sharp before uploading
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (ALLOWED_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, png, and webp images are allowed"));
    }
  },
});

async function requireAdmin(req: Request, res: Response): Promise<boolean> {
  try {
    const user = await sdk.authenticateRequest(req);
    if (user.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return false;
    }
    return true;
  } catch {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
}

export function registerUploadRoutes(app: Express) {
  const uploadRouter = Router();

  uploadRouter.post(
    "/image",
    upload.single("file"),
    async (req: Request, res: Response) => {
      // Auth check
      const ok = await requireAdmin(req, res);
      if (!ok) return;

      const file = (req as any).file as Express.Multer.File | undefined;
      if (!file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      try {
        // Compress/resize: max 1200px wide, quality 85, convert to webp
        const processed = await sharp(file.buffer)
          .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

        // Build storage key from original filename
        const baseName = (file.originalname || "product")
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-zA-Z0-9-_]/g, "-")
          .slice(0, 40)
          .toLowerCase();

        const key = `products/${baseName}.webp`;
        const { url } = await storagePut(key, processed, "image/webp");

        res.json({ url });
      } catch (err: any) {
        console.error("[upload] Error:", err);
        res.status(500).json({ error: err.message || "Upload failed" });
      }
    }
  );

  app.use("/api/upload", uploadRouter);
}
