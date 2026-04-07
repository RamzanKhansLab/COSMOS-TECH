import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { Product } from "../models/Product.js";

function pickRepoImage(product) {
  const name = String(product.name || "").toLowerCase();
  const category = String(product.category || "").toLowerCase();

  if (name.includes("keyboard") || category.includes("keyboard")) return "/products/keyboard.svg";
  if (name.includes("mouse") || category === "mouse") return "/products/mouse.svg";
  if (name.includes("laptop") || category.includes("laptop")) return "/products/laptop.svg";
  if (name.includes("cooler") || category.includes("component")) return "/products/cooler.svg";
  if (name.includes("ssd") || name.includes("nvme") || category.includes("storage")) return "/products/ssd.svg";
  if (name.includes("monitor") || category.includes("monitor")) return "/products/monitor.svg";
  if (name.includes("headphone") || category.includes("headphone")) return "/products/headphones.svg";
  if (name.includes("hub")) return "/products/hub.svg";
  if (name.includes("charger") || name.includes("gan") || category.includes("charger")) return "/products/charger.svg";
  if (name.includes("webcam")) return "/products/webcam.svg";
  if (name.includes("cable") || category.includes("cable")) return "/products/cable.svg";
  if (name.includes("router") || name.includes("wifi") || category.includes("network")) return "/products/router.svg";

  if (category.includes("accessor")) return "/products/hub.svg";
  return "/products/keyboard.svg";
}

async function main() {
  await connectDb();

  const products = await Product.find({});
  let updated = 0;

  for (const p of products) {
    const raw = String(p.imageUrl || "").trim();

    let next = raw;
    if (next.startsWith("https:///products/")) next = next.replace("https:///products/", "/products/");
    if (next.startsWith("localhost/products/")) next = next.replace("localhost/products/", "/products/");

    const needsRepoOnly = next.includes("unsplash.com") || next.includes("http://") || next.includes("https://");
    if (!next || needsRepoOnly) next = pickRepoImage(p);

    if (next !== raw) {
      p.imageUrl = next;
      await p.save();
      updated += 1;
    }
  }

  console.log(`Done. Updated ${updated}/${products.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
