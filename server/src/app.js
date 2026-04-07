import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/products.js";
import { ordersRouter } from "./routes/orders.js";
import { reviewsRouter } from "./routes/reviews.js";
import { adminRouter } from "./routes/admin.js";

export function buildApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: false
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/reviews", reviewsRouter);
  app.use("/api/admin", adminRouter);

  app.use((req, res) => res.status(404).json({ message: "Not found" }));
  return app;
}
