import React from "react";
import { Link } from "react-router-dom";
import logoUrl from "../assets/cosmos-logo.svg";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <img src={logoUrl} alt="COSMOS Tech" className="h-9 w-9" />
            <div>
              <div className="text-sm font-extrabold tracking-wide">COSMOS Tech</div>
              <div className="text-xs text-slate-300">A modern full-stack electronics marketplace</div>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            COSMOS Tech connects franchise sellers with customers looking for reliable tech accessories, laptops and components — with secure
            role-based access for Admin, Seller and Customer.
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-extrabold">Company</div>
          <div className="space-y-1 text-sm text-slate-300">
            <Link className="block hover:text-white" to="/about">
              About us
            </Link>
            <a className="block hover:text-white" href="https://github.com/RamzanKhansLab/COSMOS-TECH" target="_blank" rel="noreferrer">
              GitHub (project)
            </a>
            <a className="block hover:text-white" href="mailto:support@cosmostech.example">
              support@cosmostech.example
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-extrabold">Project</div>
          <div className="space-y-1 text-sm text-slate-300">
            <div>Stack: MERN</div>
            <div>RBAC: Admin / Seller / Customer</div>
            <div>Features: Cart, Orders, Reviews</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} COSMOS Tech. All rights reserved.</div>
          <div className="text-slate-500">Demo project for Business Model Development evaluation.</div>
        </div>
      </div>
    </footer>
  );
}

