import { RequestHandler, Router } from "express";
import {
  createBranchController,
  deleteBranchController,
  getBranchesController,
  updateBranchController,
} from "@/controllers/branches.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware as RequestHandler,
  createBranchController as RequestHandler
);

router.get(
  "/",
  authMiddleware as RequestHandler,
  getBranchesController as RequestHandler
);
router.patch(
  "/:id",
  authMiddleware as RequestHandler,
  updateBranchController as RequestHandler
);
router.delete(
  "/:id",
  authMiddleware as RequestHandler,
  deleteBranchController as RequestHandler
);
export default router;
