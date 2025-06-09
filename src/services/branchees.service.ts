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
export { createBranch, getBranchesById, getBranches };
