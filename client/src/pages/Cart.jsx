import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import { Btn, Card, Shell } from "../components/Ui.jsx";
import { clearCart, getCart, removeFromCart, setCart } from "../state/cart.js";
import { useAuth } from "../state/AuthContext.jsx";
import { http } from "../api/http.js";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState(() => getCart());
  const [err, setErr] = useState("");

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  function updateQty(productId, qty) {
    const next = items.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, Number(qty) || 1) } : i));
    setItems(next);
    setCart(next);
  }

  async function checkout() {
    if (!user) return navigate("/login");
    if (user.role !== "customer") return setErr("Only customers can purchase.");
    try {
      setErr("");
      await http.post("/orders", { items: items.map((i) => ({ productId: i.productId, qty: i.qty })) });
      clearCart();
      setItems([]);
      navigate("/orders");
    } catch (e) {
      setErr(e?.response?.data?.message || "Checkout failed");
    }
  }

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black">Cart</h1>
            <p className="mt-1 text-sm text-slate-300">Fast checkout (demo payments). Reviews unlock after purchase.</p>
          </div>
          <Link to="/" className="text-sm text-slate-300 hover:text-white">
            Continue shopping →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="p-5 md:col-span-2">
            {items.length === 0 ? (
              <div className="text-sm text-slate-300">Your cart is empty.</div>
            ) : (
              <div className="space-y-3">
                {items.map((i) => (
                  <div key={i.productId} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="h-14 w-20 overflow-hidden rounded-lg bg-white/5">
                      {i.imageUrl ? <img src={i.imageUrl} alt={i.name} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-1 text-sm font-bold">{i.name}</div>
                      <div className="text-xs text-slate-300">₹{i.price} each</div>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={i.qty}
                      onChange={(e) => updateQty(i.productId, e.target.value)}
                      className="w-16 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
                    />
                    <div className="w-24 text-right text-sm font-bold text-sky-300">₹{i.price * i.qty}</div>
                    <Btn
                      variant="danger"
                      onClick={() => {
                        removeFromCart(i.productId);
                        setItems(getCart());
                      }}
                    >
                      Remove
                    </Btn>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="text-lg font-extrabold">Summary</div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-slate-300">Total</div>
              <div className="text-xl font-black text-sky-300">₹{total}</div>
            </div>
            <Btn className="mt-4 w-full" disabled={items.length === 0} onClick={checkout}>
              Checkout
            </Btn>
            <Btn
              variant="ghost"
              className="mt-2 w-full"
              disabled={items.length === 0}
              onClick={() => {
                clearCart();
                setItems([]);
              }}
            >
              Clear cart
            </Btn>
            {err ? <div className="mt-3 text-sm text-rose-300">{err}</div> : null}
          </Card>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}


