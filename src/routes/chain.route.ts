import { RequestHandler, Router } from "express";
import {
  createChainController,
  deleteChainController,
  getChainsController,
  updateChainController,
} from "@/controllers/chain.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware as RequestHandler,
  createChainController as RequestHandler
);
router.get(
  "/",
  authMiddleware as RequestHandler,
  getChainsController as RequestHandler
);
router.patch(
  "/:id",
  authMiddleware as RequestHandler,
  updateChainController as RequestHandler
);
router.delete(
  "/:id",
  authMiddleware as RequestHandler,
  deleteChainController as RequestHandler
);

export default router;
