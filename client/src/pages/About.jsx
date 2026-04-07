import React from "react";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import { Badge, Card, Shell } from "../components/Ui.jsx";

export default function About() {
  return (
    <Shell>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              About{" "}
              <span className="bg-gradient-to-r from-sky-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">COSMOS</span>
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              COSMOS Tech is a marketplace focused on tech electronics accessories and components. This project demonstrates a complete
              full-stack business model with secure role-based access.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>MERN</Badge>
              <Badge>JWT Auth</Badge>
              <Badge>RBAC</Badge>
              <Badge>Cart + Orders</Badge>
              <Badge>Ratings + Reviews</Badge>
            </div>
          </div>

          <Card className="p-6">
            <div className="text-lg font-extrabold">Business Model</div>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <div>
                <span className="font-bold text-slate-100">Admin (COSMOS Owners):</span> oversees all sellers & customers, monitors ratings and
                reviews, and can remove products.
              </div>
              <div>
                <span className="font-bold text-slate-100">Sellers (Franchise Partners):</span> list products, manage inventory, and see orders and
                reviews only for their products.
              </div>
              <div>
                <span className="font-bold text-slate-100">Customers:</span> browse products, add to cart, purchase, and post reviews after buying.
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="text-sm font-extrabold">Trust & Safety</div>
            <p className="mt-2 text-sm text-slate-300">Reviews are allowed only after purchase. Admin accounts cannot be registered from UI.</p>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-extrabold">Seller Growth</div>
            <p className="mt-2 text-sm text-slate-300">Franchise sellers get visibility to customers, plus a focused dashboard for their products.</p>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-extrabold">Customer Experience</div>
            <p className="mt-2 text-sm text-slate-300">Modern UI, fast search, cart checkout flow, and clear product pages with ratings and reviews.</p>
          </Card>
        </div>
      </main>
      <Footer />
    </Shell>
  );
}
