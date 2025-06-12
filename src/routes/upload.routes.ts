import { Router, Request, Response } from "express";
import multer from "multer";
import { uploadImage, uploadMultipleImages } from "../utils/uploadImage";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload single image
router.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const result = await uploadImage(req.file);
      res.json(result);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Error uploading file" });
    }
  }
);

// Upload multiple images
router.post(
  "/upload-multiple",
  upload.array("images", 10),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      const results = await uploadMultipleImages(files);

      // Calculate summary
      const summary = {
        total: results.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      };

      res.json({
        summary,
        results,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Error processing upload request" });
    }
  }
);

export default router;
