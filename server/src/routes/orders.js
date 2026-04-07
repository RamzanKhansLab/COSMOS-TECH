import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

export const ordersRouter = express.Router();

ordersRouter.post("/", requireAuth, requireRole("customer"), async (req, res) => {
  const schema = z.object({
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          qty: z.number().int().min(1)
        })
      )
      .min(1)
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  let total = 0;
  for (const { productId, qty } of parsed.data.items) {
    const p = byId.get(String(productId));
    if (!p) return res.status(400).json({ message: `Invalid productId: ${productId}` });
    if (p.stock < qty) return res.status(400).json({ message: `Out of stock: ${p.name}` });
    items.push({
      productId: p._id,
      sellerId: p.sellerId,
      name: p.name,
      price: p.price,
      qty
    });
    total += p.price * qty;
  }

  for (const { productId, qty } of parsed.data.items) {
    await Product.updateOne({ _id: productId }, { $inc: { stock: -qty } });
  }

  const order = await Order.create({ userId: req.auth.sub, items, total, status: "placed" });
  return res.status(201).json({ order });
});

ordersRouter.get("/me", requireAuth, requireRole("customer"), async (req, res) => {
  const orders = await Order.find({ userId: req.auth.sub }).sort({ createdAt: -1 }).limit(100);
  return res.json({ orders });
});

ordersRouter.get("/seller/me", requireAuth, requireRole("seller"), async (req, res) => {
  const orders = await Order.find({ "items.sellerId": req.auth.sub }).sort({ createdAt: -1 }).limit(200);
  return res.json({ orders });
});
