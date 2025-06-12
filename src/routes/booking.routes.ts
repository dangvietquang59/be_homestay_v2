import { RequestHandler, Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  createBookingController,
  deleteBookingController,
  getBookingsController,
  updateBookingController,
} from "@/controllers/booking.controller";

const router = Router();

router.post(
  "/",
  authMiddleware as RequestHandler,
  createBookingController as RequestHandler
);

router.get(
  "/",
  authMiddleware as RequestHandler,
  getBookingsController as RequestHandler
);

router.delete(
  "/:id",
  authMiddleware as RequestHandler,
  deleteBookingController as RequestHandler
);

router.patch(
  "/:id",
  authMiddleware as RequestHandler,
  updateBookingController as RequestHandler
);

export default router;
