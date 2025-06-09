import { RequestHandler, Router } from "express";
import {
  createBranchController,
  getBranchesController,
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
export default router;
