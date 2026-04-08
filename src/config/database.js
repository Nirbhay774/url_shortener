const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Create a connection pool using the native pg driver
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize the Prisma adapter
const adapter = new PrismaPg(pool);

// Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter });

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = { prisma, connectDB };
