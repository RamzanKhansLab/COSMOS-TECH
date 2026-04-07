import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import { Card, Shell } from "../components/Ui.jsx";
import { http } from "../api/http.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function run() {
      const res = await http.get("/orders/me");
      if (!ignore) setOrders(res.data.orders || []);
    }
    if (user?.role === "customer") run().catch(() => {});
    return () => {
      ignore = true;
    };
  }, [user]);

  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-black">My Orders</h1>
        <p className="mt-1 text-sm text-slate-300">Order history (demo checkout).</p>

        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <Card key={o._id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-bold">Order #{o._id.slice(-6).toUpperCase()}</div>
                <div className="text-xs text-slate-300">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-3 space-y-2">
                {o.items.map((i) => (
                  <div key={i.productId} className="flex items-center justify-between text-sm">
                    <div className="text-slate-200">
                      {i.name} <span className="text-slate-400">× {i.qty}</span>
                    </div>
                    <div className="font-bold text-sky-300">₹{i.price * i.qty}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
                <div className="text-slate-300">Total</div>
                <div className="text-lg font-black text-sky-300">₹{o.total}</div>
              </div>
            </Card>
          ))}
          {orders.length === 0 ? <div className="text-sm text-slate-300">No orders yet.</div> : null}
        </div>
      </main>
      <Footer />
    </Shell>
  );
}


