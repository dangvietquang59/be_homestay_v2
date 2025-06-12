import { BookingStatus, PrismaClient, RoomStatus } from "@prisma/client";
import { BookingType } from "@/types/booking";
import { AppError } from "@/utils/error";

const prisma = new PrismaClient();

const createBooking = async (booking: BookingType) => {
  let totalPrice = 0;
  const room = await prisma.room.findUnique({
    where: {
      id: booking.roomId,
    },
  });
  if (!room) {
    throw new AppError("Room not found", 404);
  }
  if (room.status === RoomStatus.OCCUPIED) {
    throw new AppError("Room is not available", 400);
  }
  if (room.isDeleted) {
    throw new AppError("Room is deleted", 400);
  }

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const currentDate = new Date();

  if (checkInDate >= checkOutDate) {
    throw new AppError("Check-in date must be before check-out date", 400);
  }
  if (checkInDate < currentDate) {
    throw new AppError("Check-in date must be in the future", 400);
  }
  if (checkOutDate < currentDate) {
    throw new AppError("Check-out date must be in the future", 400);
  }
  if (booking.totalPrice <= 0) {
    throw new AppError("Total price must be greater than 0", 400);
  }
  if (booking.status !== BookingStatus.BOOKED) {
    throw new AppError("Invalid booking status", 400);
  }

  const findRoomBooking = await prisma.booking.findMany({
    where: {
      roomId: booking.roomId,
      checkIn: {
        lte: checkInDate,
      },
      checkOut: {
        gte: checkOutDate,
      },
    },
  });
  if (findRoomBooking.length > 0) {
    throw new AppError("Room is already booked", 400);
  }

  // Calculate total price based on room price and duration
  const durationInHours =
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
  totalPrice = room.price * durationInHours;

  const newBooking = await prisma.booking.create({
    data: {
      userId: booking.userId,
      roomId: booking.roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      status: booking.status,
      totalPrice: totalPrice,
      isDeleted: booking.isDeleted || false,
    },
  });
  return newBooking;
};

const deleteBooking = async (bookingId: string) => {
  const deletedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { isDeleted: true },
  });
  return deletedBooking;
};

const getBookings = async (limit?: number, page?: number) => {
  const take = limit && Number(limit) > 0 ? Number(limit) : 10;
  const skip = page && Number(page) > 0 ? (Number(page) - 1) * take : 0;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      skip,
      take,
      where: {
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        room: {
          select: {
            id: true,
            roomNumber: true,
            type: true,
            price: true,
            branch: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.booking.count({
      where: {
        isDeleted: false,
      },
    }),
  ]);

  return {
    data: bookings,
    pagination: {
      total,
      page: page ? Number(page) : 1,
      limit: take,
    },
  };
};

const updateBooking = async (
  bookingId: string,
  booking: Partial<BookingType>
) => {
  const findBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });
  if (!findBooking) {
    throw new AppError("Booking not found", 404);
  }
  if (findBooking.status === BookingStatus.CANCELLED) {
    throw new AppError("Booking is cancelled", 400);
  }
  if (findBooking.status === BookingStatus.CHECKED_IN) {
    throw new AppError("Booking is checked in", 400);
  }
  if (findBooking.status === BookingStatus.CHECKED_OUT) {
    throw new AppError("Booking is checked out", 400);
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: booking,
  });
  return updatedBooking;
};

export { createBooking, deleteBooking, getBookings, updateBooking };
