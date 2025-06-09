export type ChainType = {
  id?: string;
  name: string;
  description?: string;
  branches?: string[] | null;
  isDeleted?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};
