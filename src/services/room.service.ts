import { RoomType } from "@/types/room";
import { PrismaClient, RoomStatus } from "@prisma/client";

const prisma = new PrismaClient();

const createRoom = async (room: RoomType) => {
  const newRoom = await prisma.room.create({
    data: {
      roomNumber: room.roomNumber,
      type: room.type,
      status: room.status as RoomStatus,
      price: room.price,
      description: room.description,
      branch: {
        connect: {
          id: room.branchId,
        },
      },
    },
  });
  return newRoom;
};

const getRooms = async (limit: number, page: number, branchId?: string) => {
  const rooms = await prisma.room.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      branchId: branchId || undefined,
    },
    include: {
      branch: false,
    },
  });
  return rooms;
};
export { createRoom, getRooms };
