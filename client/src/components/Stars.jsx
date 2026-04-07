import React from "react";

export default function Stars({ value = 0, count = 5 }) {
  const full = Math.round(Number(value) * 2) / 2;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => {
        const idx = i + 1;
        const on = full >= idx;
        return (
          <span key={idx} className={on ? "text-amber-300" : "text-white/15"}>
            ★
          </span>
        );
      })}
    </div>
  );
}
