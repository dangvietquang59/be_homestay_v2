import { RequestHandler, Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  createRoomController,
  getRoomsController,
  deleteRoomController,
  updateRoomController,
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
router.patch(
  "/:id",
  authMiddleware as RequestHandler,
  updateRoomController as RequestHandler
);
router.delete(
  "/:id",
  authMiddleware as RequestHandler,
  deleteRoomController as RequestHandler
);
export default router;
