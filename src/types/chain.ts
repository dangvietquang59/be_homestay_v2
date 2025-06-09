export type ChainType = {
  id?: string;
  name: string;
  description?: string;
  branches?: string[] | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};
