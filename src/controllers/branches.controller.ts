import { Request, Response } from "express";
import {
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
} from "@/services/branchees.service";
import { errorResponse, successResponse } from "@/utils/response";
import { AppError } from "@/utils/error";

const createBranchController = async (req: Request, res: Response) => {
  try {
    const branch = req.body;
    const newBranch = await createBranch(branch);
    res
      .status(201)
      .send(successResponse(newBranch, "Branch created successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};

const getBranchesController = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1, id, chainId } = req.query;
    const branches = await getBranches(
      Number(limit),
      Number(page),
      id as string,
      chainId as string
    );
    const pagination = {
      limit: Number(limit),
      page: Number(page),
      total: branches.length,
    };
    res
      .status(200)
      .send(
        successResponse(
          branches,
          "Branches fetched successfully",
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
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};
const updateBranchController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const branch = req.body;
    const updatedBranch = await updateBranch(id, branch);
    res
      .status(200)
      .send(successResponse(updatedBranch, "Branch updated successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};
const deleteBranchController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBranch = await deleteBranch(id);
    res
      .status(200)
      .send(successResponse(deletedBranch, "Branch deleted successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error" + error, 500));
  }
};
export {
  createBranchController,
  getBranchesController,
  updateBranchController,
  deleteBranchController,
};
