import { RequestHandler, Router } from "express";
import {
  createChainController,
  getChainsController,
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

export default router;
