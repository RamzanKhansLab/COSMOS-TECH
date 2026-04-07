import dotenv from "dotenv";

dotenv.config();

function must(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 8080),
  mongodbUri: must("MONGODB_URI"),
  jwtSecret: must("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  adminCreds: process.env.ADMIN_CREDS ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  seedOnStart: (process.env.SEED_ON_START ?? "false").toLowerCase() === "true"
};

