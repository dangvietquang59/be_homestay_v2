import app from "@/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;
export const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  }
};
