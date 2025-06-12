import { Request, Response } from "express";
import { errorResponse, successResponse } from "@/utils/response";
import { AppError } from "@/utils/error";
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
} from "@/services/booking.service";

const createBookingController = async (req: Request, res: Response) => {
  try {
    const booking = req.body;
    const newBooking = await createBooking(booking);
    res
      .status(201)
      .send(successResponse(newBooking, "Booking created successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error: " + error, 500));
  }
};

const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBooking = await deleteBooking(id);
    res
      .status(200)
      .send(successResponse(deletedBooking, "Booking deleted successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error: " + error, 500));
  }
};

const getBookingsController = async (req: Request, res: Response) => {
  try {
    const { limit, page } = req.query;
    const result = await getBookings(Number(limit), Number(page));
    res
      .status(200)
      .send(
        successResponse(
          result.data,
          "Bookings fetched successfully",
          200,
          result.pagination
        )
      );
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error: " + error, 500));
  }
};

const updateBookingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = req.body;
    const updatedBooking = await updateBooking(id, booking);
    res
      .status(200)
      .send(successResponse(updatedBooking, "Booking updated successfully"));
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.status)
        .send(errorResponse(error.message, error.status, error.data));
    }
    res.status(500).send(errorResponse("Internal server error: " + error, 500));
  }
};
export {
  createBookingController,
  deleteBookingController,
  getBookingsController,
  updateBookingController,
};
