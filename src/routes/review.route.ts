import { RequestHandler, Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  createReviewController,
  getReviewsController,
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

export default router;
