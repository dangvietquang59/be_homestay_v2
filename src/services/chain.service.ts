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
  });
  return chains;
};

export { createChain, getChains };
