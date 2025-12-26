import { PrismaClient } from '@prisma/client';

// Create a global PrismaClient instance to prevent multiple instances in development
const globalForPrisma = globalThis;

// Initialize Prisma Client
const prisma = globalForPrisma.prisma || new PrismaClient();

// In development, set the global instance to avoid too many PrismaClient instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const connectDB = async () => {
  try {
    // Test the database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    process.exit(1);
  }
};

export default prisma;
