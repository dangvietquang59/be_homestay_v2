import { ReviewType } from "@/types/review";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createReview = async (review: ReviewType) => {
  const newReview = await prisma.review.create({
    data: {
      userId: review.userId,
      branchId: review.branchId,
      roomId: review.roomId,
      rating: review.rating,
      comment: review.comment,
      isDeleted: review.isDeleted || false,
    },
  });
  return newReview;
};

const getReviews = async (
  limit: number,
  page: number,
  userId?: string,
  branchId?: string,
  roomId?: string
) => {
  const whereCondition = {
    isDeleted: false,
    userId: userId || undefined,
    branchId: branchId || undefined,
    roomId: roomId || undefined,
  };

  const reviews = await prisma.review.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: whereCondition,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      branch: true,
      room: true,
    },
  });

  let averageRating = 0;

  if (roomId) {
    const roomRating = await prisma.review.aggregate({
      where: {
        roomId,
        isDeleted: false,
      },
      _avg: {
        rating: true,
      },
    });
    averageRating = roomRating._avg.rating || 0;
  } else if (branchId) {
    // Lấy rating trực tiếp của branch
    const branchDirectRating = await prisma.review.aggregate({
      where: {
        branchId,
        isDeleted: false,
      },
      _avg: {
        rating: true,
      },
    });

    const rooms = await prisma.room.findMany({
      where: {
        branchId,
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });

    const roomIds = rooms.map((room) => room.id);

    let roomsRating = 0;
    if (roomIds.length > 0) {
      const branchRoomRating = await prisma.review.aggregate({
        where: {
          roomId: {
            in: roomIds,
          },
          isDeleted: false,
        },
        _avg: {
          rating: true,
        },
      });
      roomsRating = branchRoomRating._avg.rating || 0;
    }

    const directRating = branchDirectRating._avg.rating || 0;

    if (directRating > 0 && roomsRating > 0) {
      averageRating = (directRating + roomsRating) / 2;
    } else {
      averageRating = directRating || roomsRating;
    }
  }

  return {
    reviews,
    averageRating,
  };
};

const deleteReview = async (reviewId: string) => {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { isDeleted: true },
  });
  return review;
};

const updateReview = async (reviewId: string, review: ReviewType) => {
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: review.rating || undefined,
      comment: review.comment || undefined,
      isDeleted: review.isDeleted || undefined,
    },
  });
  return updatedReview;
};

export { createReview, getReviews, deleteReview, updateReview };
