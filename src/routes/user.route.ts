import { Router, RequestHandler } from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/register", userController.register as RequestHandler);
router.post("/login", userController.login as RequestHandler);
router.get("/verify-email", userController.verifyEmail as RequestHandler);
router.post(
  "/resend-verification",
  userController.resendVerification as RequestHandler
);
router.post("/refresh-token", userController.refreshToken as RequestHandler);
router.post(
  "/forgot-password",
  userController.forgotPassword as RequestHandler
);
router.post("/reset-password", userController.resetPassword as RequestHandler);

// Protected routes
router.get(
  "/",
  authMiddleware as RequestHandler,
  userController.getUsers as RequestHandler
);
router.post(
  "/change-password",
  authMiddleware as RequestHandler,
  userController.changePassword as RequestHandler
);
router.patch(
  "/",
  authMiddleware as RequestHandler,
  userController.updateUser as RequestHandler
);
router.delete(
  "/:id",
  authMiddleware as RequestHandler,
  userController.softDeleteUser as RequestHandler
);

export default router;
