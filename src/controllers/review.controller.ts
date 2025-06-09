import { Request, Response } from "express";
import { createReview, getReviews } from "@/services/review.service";
import { AppError } from "@/utils/error";
import { errorResponse, successResponse } from "@/utils/response";

const createReviewController = async (req: Request, res: Response) => {
  try {
    const review = req.body;
    const newReview = await createReview(review);
    res
      .status(201)
      .send(successResponse(newReview, "Review created successfully", 201));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const getReviewsController = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1, userId, branchId, roomId } = req.query;
    const reviews = await getReviews(
      Number(limit),
      Number(page),
      userId as string | undefined,
      branchId as string | undefined,
      roomId as string | undefined
    );
    const pagination = {
      total: reviews.reviews.length,
      page: Number(page),
      limit: Number(limit),
    };
    res
      .status(200)
      .send(
        successResponse(
          reviews,
          "Reviews fetched successfully",
          200,
          pagination
        )
      );
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error", 500));
  }
};

export { createReviewController, getReviewsController };
