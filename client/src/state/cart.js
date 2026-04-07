const KEY = "cart_items";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(product, qty = 1) {
  const items = getCart();
  const idx = items.findIndex((i) => i.productId === product._id);
  if (idx >= 0) items[idx].qty += qty;
  else
    items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "",
      qty
    });
  setCart(items);
  return items;
}

export function removeFromCart(productId) {
  const items = getCart().filter((i) => i.productId !== productId);
  setCart(items);
  return items;
}

export function clearCart() {
  setCart([]);
}
