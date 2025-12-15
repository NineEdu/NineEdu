// db.config.js
import dotenv from "dotenv";
dotenv.config();  // Load .env ngay trong config

export default {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASS,
  DB: process.env.DB_NAME,
  DIALECT: process.env.DB_DIALECT || "mysql",
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-key",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
