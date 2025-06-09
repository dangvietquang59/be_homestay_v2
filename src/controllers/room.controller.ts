import { Request, Response } from "express";
import { createRoom, getRooms } from "@/services/room.service";
import { errorResponse, successResponse } from "@/utils/response";
import { AppError } from "@/utils/error";

const createRoomController = async (req: Request, res: Response) => {
  try {
    const room = req.body;
    const newRoom = await createRoom(room);
    res
      .status(201)
      .send(successResponse(newRoom, "Room created successfully", 201));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error", 500));
  }
};
const getRoomsController = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1, branchId } = req.query;
    const rooms = await getRooms(
      Number(limit),
      Number(page),
      branchId as string
    );
    const pagination = {
      limit: Number(limit),
      page: Number(page),
      total: rooms.length,
    };
    res
      .status(200)
      .send(
        successResponse(rooms, "Rooms fetched successfully", 200, pagination)
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
export { createRoomController, getRoomsController };
