import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";

async function seed() {
  await connectDb();

  await Promise.all([Review.deleteMany({}), Product.deleteMany({}), User.deleteMany({})]);

  const sellerPass = await bcrypt.hash("Seller@123", 10);
  const customerPass = await bcrypt.hash("Customer@123", 10);

  const [seller1, seller2, customer1, customer2, customer3] = await User.create([
    {
      name: "NovaGear Seller",
      email: "seller1@demo.com",
      passwordHash: sellerPass,
      role: "seller",
      sellerStoreName: "NovaGear Electronics"
    },
    {
      name: "ByteHub Seller",
      email: "seller2@demo.com",
      passwordHash: sellerPass,
      role: "seller",
      sellerStoreName: "ByteHub Tech Store"
    },
    { name: "Aarav Customer", email: "customer1@demo.com", passwordHash: customerPass, role: "customer" },
    { name: "Isha Customer", email: "customer2@demo.com", passwordHash: customerPass, role: "customer" },
    { name: "Kabir Customer", email: "customer3@demo.com", passwordHash: customerPass, role: "customer" }
  ]);

  const products = await Product.create([
    {
      sellerId: seller1._id,
      name: "NovaGear Mech Keyboard K87 (Hot‑Swap)",
      description:
        "Compact 87‑key mechanical keyboard with hot‑swappable switches, RGB per‑key lighting, and a solid aluminum top plate.",
      category: "Keyboards",
      price: 4999,
      stock: 25,
      imageUrl: "/products/keyboard.svg"
    },
    {
      sellerId: seller1._id,
      name: "NovaGear Precision Mouse M8 (26K DPI)",
      description:
        "Ultra‑light ergonomic mouse with a 26K DPI sensor, 1000Hz polling, and customizable side buttons for productivity & gaming.",
      category: "Mouse",
      price: 1999,
      stock: 60,
      imageUrl: "/products/mouse.svg"
    },
    {
      sellerId: seller1._id,
      name: "NovaGear USB‑C Hub 8‑in‑1 (4K HDMI)",
      description:
        "One hub for everything: 4K HDMI, USB 3.0, SD card, and fast USB‑C PD charging. Perfect for laptops and work setups.",
      category: "Accessories",
      price: 1799,
      stock: 45,
      imageUrl: "/products/hub.svg"
    },
    {
      sellerId: seller1._id,
      name: "NovaGear Type‑C Fast Charger 65W (GaN)",
      description:
        "Compact 65W GaN charger with dual ports for laptop + phone. Built-in protections for safe charging.",
      category: "Chargers",
      price: 1499,
      stock: 80,
      imageUrl: "/products/charger.svg"
    },
    {
      sellerId: seller2._id,
      name: "ByteHub Laptop Pro 14 (i7 / 16GB / 512GB)",
      description:
        "Premium 14-inch laptop for coding and design: i7-class performance, 16GB RAM, fast 512GB SSD, and a color-accurate display.",
      category: "Laptops",
      price: 79999,
      stock: 10,
      imageUrl: "/products/laptop.svg"
    },
    {
      sellerId: seller2._id,
      name: "ByteHub CPU Cooler X120 (ARGB)",
      description:
        "High airflow 120mm tower cooler with ARGB, quiet PWM fan, and a copper heatpipe design for sustained boosts.",
      category: "Components",
      price: 2499,
      stock: 35,
      imageUrl: "/products/cooler.svg"
    },
    {
      sellerId: seller2._id,
      name: "ByteHub NVMe SSD 1TB (Gen3)",
      description:
        "Fast boot and load times with a 1TB NVMe SSD. Great for laptops and desktops. High endurance for daily work.",
      category: "Storage",
      price: 5799,
      stock: 40,
      imageUrl: "/products/ssd.svg"
    },
    {
      sellerId: seller2._id,
      name: "ByteHub Monitor UltraSharp 27 (2K / 144Hz)",
      description:
        "Crisp 2K display with 144Hz refresh for smooth work and gaming. Thin bezels, adjustable stand, and vivid colors.",
      category: "Monitors",
      price: 21999,
      stock: 12,
      imageUrl: "/products/monitor.svg"
    },
    {
      sellerId: seller2._id,
      name: "ByteHub Studio Headphones H1 (Over‑Ear)",
      description:
        "Comfortable over-ear headphones with deep bass, clean vocals, and long listening comfort for classes and editing.",
      category: "Headphones",
      price: 2999,
      stock: 28,
      imageUrl: "/products/headphones.svg"
    },
    {
      sellerId: seller1._id,
      name: "NovaGear 1080p Webcam W2 (Auto Focus)",
      description:
        "Sharp 1080p webcam with auto focus and a built-in mic. Ideal for meetings, classes, and streaming.",
      category: "Accessories",
      price: 1599,
      stock: 34,
      imageUrl: "/products/webcam.svg"
    },
    {
      sellerId: seller1._id,
      name: "NovaGear Braided USB‑C Cable 2m (60W)",
      description:
        "Durable braided USB‑C cable with 60W PD support. Tested for reliable charging and data transfer.",
      category: "Cables",
      price: 399,
      stock: 120,
      imageUrl: "/products/cable.svg"
    },
    {
      sellerId: seller2._id,
      name: "ByteHub Wi‑Fi Router R6 (Dual Band)",
      description:
        "Stable dual-band router for smooth browsing and streaming. Great coverage for home and hostel rooms.",
      category: "Networking",
      price: 1899,
      stock: 22,
      imageUrl: "/products/router.svg"
    }
  ]);

  const byName = new Map(products.map((p) => [p.name, p]));

  await Review.create([
    {
      productId: byName.get("NovaGear Mech Keyboard K87 (Hot‑Swap)")._id,
      sellerId: byName.get("NovaGear Mech Keyboard K87 (Hot‑Swap)").sellerId,
      userId: customer1._id,
      rating: 5,
      title: "Feels premium",
      comment: "Keys feel amazing, hot-swap is a lifesaver for experimenting."
    },
    {
      productId: byName.get("NovaGear Precision Mouse M8 (26K DPI)")._id,
      sellerId: byName.get("NovaGear Precision Mouse M8 (26K DPI)").sellerId,
      userId: customer2._id,
      rating: 4,
      title: "Super light",
      comment: "Very smooth sensor and comfortable grip. Battery life could be a bit better."
    },
    {
      productId: byName.get("ByteHub Monitor UltraSharp 27 (2K / 144Hz)")._id,
      sellerId: byName.get("ByteHub Monitor UltraSharp 27 (2K / 144Hz)").sellerId,
      userId: customer3._id,
      rating: 5,
      title: "Great for coding",
      comment: "Sharp text and buttery smooth 144Hz. Big upgrade for my setup."
    },
    {
      productId: byName.get("ByteHub Studio Headphones H1 (Over‑Ear)")._id,
      sellerId: byName.get("ByteHub Studio Headphones H1 (Over‑Ear)").sellerId,
      userId: customer1._id,
      rating: 4,
      title: "Comfortable",
      comment: "Good sound and comfy for long sessions."
    }
  ]);

  const stats = await Review.aggregate([
    { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, ratingsCount: { $sum: 1 } } }
  ]);
  for (const s of stats) {
    await Product.updateOne({ _id: s._id }, { $set: { avgRating: s.avgRating, ratingsCount: s.ratingsCount } });
  }

  console.log("Seed complete.");
  console.log("Demo seller login: seller1@demo.com / Seller@123");
  console.log("Demo customer login: customer1@demo.com / Customer@123");
  console.log("More customers: customer2@demo.com, customer3@demo.com (same password Customer@123)");
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });


