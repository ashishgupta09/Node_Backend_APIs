import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL Connected ✅ (via Prisma)");
    } catch (error) {
        console.error("PostgreSQL connection failed ❌", error);
        process.exit(1);
    }
};

export { prisma };
export default connectDB;
