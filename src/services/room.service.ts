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

const updateRoom = async (id: string, room: Partial<RoomType>) => {
  const updatedRoom = await prisma.room.update({
    where: { id },
    data: {
      roomNumber: room.roomNumber || undefined,
      type: room.type || undefined,
      status: (room.status as RoomStatus) || undefined,
      price: room.price || undefined,
      description: room.description || undefined,
    },
  });
  return updatedRoom;
};

const deleteRoom = async (id: string) => {
  const deletedRoom = await prisma.room.update({
    where: { id },
    data: { isDeleted: true },
  });
  return deletedRoom;
};
export { createRoom, getRooms, updateRoom, deleteRoom };
