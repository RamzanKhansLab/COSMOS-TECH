import React from "react";

export function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.14),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.16),transparent_35%),radial-gradient(circle_at_40%_90%,rgba(34,197,94,0.10),transparent_45%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_35px_rgba(56,189,248,0.18)] backdrop-blur",
        "transition hover:border-white/20",
        className
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Btn({ children, variant = "primary", className = "", ...props }) {
  const styles =
    variant === "primary"
      ? "bg-sky-500/90 hover:bg-sky-400 text-slate-950"
      : variant === "danger"
        ? "bg-rose-500/90 hover:bg-rose-400 text-slate-950"
        : "bg-white/10 hover:bg-white/15 text-slate-100";
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
        "transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed",
        styles,
        className
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm",
        "outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-500/20",
        className
      ].join(" ")}
      {...props}
    />
  );
}

export function Badge({ children }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs">{children}</span>;
}
