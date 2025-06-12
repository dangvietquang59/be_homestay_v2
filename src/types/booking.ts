import { BookingStatus } from "@prisma/client";

export type BookingType = {
  id?: string;
  userId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  actualCheckIn?: Date | null;
  actualCheckOut?: Date | null;
  status: BookingStatus;
  totalPrice: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
