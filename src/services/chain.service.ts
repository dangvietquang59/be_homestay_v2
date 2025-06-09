import { ChainType } from "@/types/chain";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createChain = async (chain: ChainType) => {
  const newChain = await prisma.chain.create({
    data: {
      name: chain.name,
      description: chain.description,
    },
  });
  return newChain;
};

const getChains = async (limit: number, page: number) => {
  const chains = await prisma.chain.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      isDeleted: false,
    },
  });
  return chains;
};
const updateChain = async (id: string, chain: ChainType) => {
  const updatedChain = await prisma.chain.update({
    where: { id },
    data: {
      name: chain.name || undefined,
      description: chain.description || undefined,
      isDeleted: false,
    },
  });
  return updatedChain;
};

const deleteChain = async (id: string) => {
  const chain = await prisma.chain.update({
    where: { id },
    data: { isDeleted: true },
  });
  return chain;
};
export { createChain, getChains, deleteChain, updateChain };
