import { RequestHandler, Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  createRoomController,
  getRoomsController,
} from "@/controllers/room.controller";

const router = Router();

router.post(
  "/",
  authMiddleware as RequestHandler,
  createRoomController as RequestHandler
);
router.get(
  "/",
  authMiddleware as RequestHandler,
  getRoomsController as RequestHandler
);

export default router;
