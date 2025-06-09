import { Request, Response } from "express";
import userService from "../services/user.service";
import { errorResponse, successResponse } from "../utils/response";
import { AppError } from "../utils/error";
import { UserRole } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const users = await userService.getUsers(page, limit);
    const total = users.length;
    const pagination = {
      total,
      page,
      limit,
    };
    res.send(
      successResponse(users, "Users fetched successfully", 200, pagination)
    );
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }
    const result = await userService.login(email, password);
    res.send(successResponse(result, "Login successful"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }
    const user = await userService.register(name, email, password);
    res
      .status(201)
      .send(
        successResponse(
          user,
          "Registration successful. Please check your email to verify your account."
        )
      );
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      throw new AppError("Verification token is required", 400);
    }
    const result = await userService.verifyEmail(token);
    res.send(successResponse(result, "Email verified successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError("Email is required", 400);
    }
    const result = await userService.resendVerificationEmail(email);
    res.send(successResponse(result, "Verification email sent successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const token = await userService.refreshToken(refreshToken);
    res.send(successResponse(token, "Token refreshed successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError("Email is required", 400);
    }
    const result = await userService.forgotPassword(email);
    res.send(successResponse(result, "Reset password email sent successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      throw new AppError("Token and new password are required", 400);
    }
    const result = await userService.resetPassword(token, newPassword);
    res.send(successResponse(result, "Password reset successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const changePassword = async (
  req: Request & { user?: { id: string } },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    const result = await userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );
    res.send(successResponse(result, "Password changed successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, phoneNumber } = req.body;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    // Create update data object with only provided fields
    const updateData: { name?: string; phoneNumber?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    const result = await userService.updateUser(userId, updateData);

    res.send(successResponse(result, "User updated successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const softDeleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;

    if (!currentUser) {
      throw new AppError("User not authenticated", 401);
    }

    // Chỉ admin mới có thể xóa người dùng khác
    if (currentUser.role !== "ADMIN" && currentUser.id !== userId) {
      throw new AppError("You don't have permission to delete this user", 403);
    }

    const result = await userService.softDeleteUser(userId);
    res.send(successResponse(result, "User deactivated successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

export default {
  getUsers,
  login,
  register,
  verifyEmail,
  resendVerification,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
  softDeleteUser,
};
