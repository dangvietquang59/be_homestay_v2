export type BranchType = {
  id?: string;
  chainId: string;
  name: string;
  address: string;
  phone: string;
  isDeleted?: boolean;
  managerId?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};
