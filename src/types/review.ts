export type ReviewType = {
  id?: string;
  userId: string;
  branchId?: string;
  roomId?: string;
  rating: number;
  comment?: string;
  isDeleted?: boolean;
};
