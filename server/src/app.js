import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/products.js";
import { ordersRouter } from "./routes/orders.js";
import { reviewsRouter } from "./routes/reviews.js";
import { adminRouter } from "./routes/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function buildApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: false
    })
  );

  // Allow data-URL images from the seller drag-drop widget (still size-limited on the client).
  app.use(express.json({ limit: "5mb" }));

  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/reviews", reviewsRouter);
  app.use("/api/admin", adminRouter);

  // Production deployment: serve the built React app from the same server.
  if (env.nodeEnv === "production") {
    const distPath = path.resolve(__dirname, "../../client/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use((req, res) => res.status(404).json({ message: "Not found" }));
  return app;
}
