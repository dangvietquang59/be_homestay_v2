import { RequestHandler, Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  createReviewController,
  deleteReviewController,
  getReviewsController,
  updateReviewController,
} from "@/controllers/review.controller";

const router = Router();

router.post(
  "/",
  authMiddleware as RequestHandler,
  createReviewController as RequestHandler
);
router.get(
  "/",
  authMiddleware as RequestHandler,
  getReviewsController as RequestHandler
);
router.delete(
  "/:id",
  authMiddleware as RequestHandler,
  deleteReviewController as RequestHandler
);
router.patch(
  "/:id",
  authMiddleware as RequestHandler,
  updateReviewController as RequestHandler
);
export default router;
