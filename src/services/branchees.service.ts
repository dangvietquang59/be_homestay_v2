import { BranchType } from "@/types/branch";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createBranch = async (branch: BranchType) => {
  const newBranch = await prisma.branch.create({
    data: {
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      chainId: branch.chainId,
    },
  });
  return newBranch;
};
const getBranchesById = async (id: string) => {
  const branch = await prisma.branch.findUnique({
    where: {
      id,
    },
    include: {
      chain: true,
    },
  });
  return branch;
};

const getBranches = async (
  limit: number,
  page: number,
  branchId?: string,
  chainId?: string
) => {
  const branches = await prisma.branch.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      id: branchId || undefined,
      chainId: chainId || undefined,
    },
    include: {
      chain: true,
    },
  });
  return branches;
};

const updateBranch = async (id: string, branch: Partial<BranchType>) => {
  const updatedBranch = await prisma.branch.update({
    where: { id },
    data: {
      name: branch.name || undefined,
      address: branch.address || undefined,
      phone: branch.phone || undefined,
      chainId: branch.chainId || undefined,
      isDeleted: branch.isDeleted !== undefined ? branch.isDeleted : undefined,
    },
  });
  return updatedBranch;
};

const deleteBranch = async (id: string) => {
  const deletedBranch = await prisma.branch.update({
    where: { id },
    data: { isDeleted: true },
  });
  return deletedBranch;
};
export {
  createBranch,
  getBranchesById,
  getBranches,
  updateBranch,
  deleteBranch,
};
