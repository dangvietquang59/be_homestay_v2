import { Request, Response } from "express";
import { createChain, getChains } from "@/services/chain.service";
import { errorResponse, successResponse } from "@/utils/response";
import { AppError } from "@/utils/error";

const createChainController = async (req: Request, res: Response) => {
  try {
    const chain = req.body;
    const newChain = await createChain(chain);
    res
      .status(201)
      .send(successResponse(newChain, "Chain created successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error", 500));
  }
};
const getChainsController = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const chains = await getChains(Number(limit), Number(page));
    const pagination = {
      limit: Number(limit),
      page: Number(page),
      total: chains.length,
    };
    res
      .status(200)
      .send(
        successResponse(chains, "Chains fetched successfully", 200, pagination)
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
export { createChainController, getChainsController };
