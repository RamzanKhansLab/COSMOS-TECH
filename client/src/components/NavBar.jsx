import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { Badge, Btn } from "./Ui.jsx";

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-lg px-3 py-2 text-sm font-semibold transition",
          isActive ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/5"
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function NavBar() {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-400 via-purple-500 to-emerald-400 shadow-[0_0_35px_rgba(56,189,248,0.25)]" />
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-wide">COSMOS Tech</div>
            <div className="text-xs text-slate-300">Electronics • Accessories • Components</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Tab to="/">Shop</Tab>
          <Tab to="/about">About</Tab>
          <Tab to="/cart">Cart</Tab>
          {user?.role === "seller" && <Tab to="/seller">Seller</Tab>}
          {user?.role === "admin" && <Tab to="/admin">Admin</Tab>}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <>
              <Badge>{user?.role}</Badge>
              <Btn
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </Btn>
            </>
          ) : (
            <>
              <Btn variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Btn>
              <Btn onClick={() => navigate("/register")}>Register</Btn>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

