import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/error";
import { PrismaClient, UserRole } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Invalid token format", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token", status: 401 });
    }
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .json({ message: error.message, status: error.status });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", status: 500 });
  }
};
