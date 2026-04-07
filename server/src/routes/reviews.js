import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { Order } from "../models/Order.js";

export const reviewsRouter = express.Router();

reviewsRouter.get("/seller/me", requireAuth, requireRole("seller"), async (req, res) => {
  const reviews = await Review.find({ sellerId: req.auth.sub }).sort({ createdAt: -1 }).limit(200);
  return res.json({ reviews });
});

reviewsRouter.post("/:productId", requireAuth, requireRole("customer"), async (req, res) => {
  const schema = z.object({
    rating: z.number().int().min(1).max(5),
    title: z.string().max(80).optional(),
    comment: z.string().max(1000).optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const bought = await Order.exists({ userId: req.auth.sub, "items.productId": product._id });
  if (!bought) return res.status(403).json({ message: "Purchase required to review" });

  const existing = await Review.findOne({ productId: product._id, userId: req.auth.sub });
  if (existing) return res.status(409).json({ message: "You already reviewed this product" });

  const review = await Review.create({
    productId: product._id,
    sellerId: product.sellerId,
    userId: req.auth.sub,
    rating: parsed.data.rating,
    title: parsed.data.title || "",
    comment: parsed.data.comment || ""
  });

  const stats = await Review.aggregate([
    { $match: { productId: product._id } },
    { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, ratingsCount: { $sum: 1 } } }
  ]);
  const { avgRating = 0, ratingsCount = 0 } = stats[0] || {};
  await Product.updateOne({ _id: product._id }, { $set: { avgRating, ratingsCount } });

  return res.status(201).json({ review });
});
