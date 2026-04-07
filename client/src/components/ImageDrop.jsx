import React, { useMemo, useRef, useState } from "react";
import { Btn } from "./Ui.jsx";

const MAX_BYTES = 900 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);

function formatBytes(n) {
  const kb = Math.round(n / 1024);
  return `${kb} KB`;
}

export default function ImageDrop({ value, onChange }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");

  const isDataUrl = useMemo(() => typeof value === "string" && value.startsWith("data:image/"), [value]);

  async function readFile(file) {
    setErr("");
    if (!file) return;
    if (!ALLOWED.has(file.type)) return setErr("Only PNG/JPG/WEBP images are allowed.");
    if (file.size > MAX_BYTES) return setErr(`Image too large (${formatBytes(file.size)}). Max ${formatBytes(MAX_BYTES)}.`);

    const reader = new FileReader();
    const dataUrl = await new Promise((resolve, reject) => {
      reader.onerror = () => reject(new Error("read failed"));
      reader.onload = () => resolve(String(reader.result || ""));
      reader.readAsDataURL(file);
    });

    onChange?.(dataUrl);
  }

  return (
    <div className="space-y-2">
      <div
        className={[
          "relative rounded-2xl border border-dashed p-4",
          drag ? "border-sky-400/60 bg-sky-500/10" : "border-white/15 bg-black/20"
        ].join(" ")}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(false);
          const file = e.dataTransfer?.files?.[0];
          readFile(file).catch(() => setErr("Could not read image"));
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            readFile(file).catch(() => setErr("Could not read image"));
          }}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-extrabold">Product image</div>
            <div className="mt-1 text-xs text-slate-300">
              Drag & drop an image here, or choose a file. (For deployment, prefer COSMOS Image Library URLs.)
            </div>
            <div className="mt-1 text-xs text-slate-400">Max size: {formatBytes(MAX_BYTES)} • PNG/JPG/WEBP</div>
          </div>
          <div className="flex items-center gap-2">
            <Btn
              variant="ghost"
              type="button"
              onClick={() => {
                setErr("");
                inputRef.current?.click();
              }}
            >
              Choose file
            </Btn>
            <Btn
              variant="danger"
              type="button"
              disabled={!value}
              onClick={() => {
                setErr("");
                onChange?.("");
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              Remove
            </Btn>
          </div>
        </div>

        {value ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <img src={value} alt="Preview" className="h-44 w-full object-cover" />
            <div className="px-3 py-2 text-xs text-slate-400">
              {isDataUrl ? "Local image (data URL)" : "Image URL"}
            </div>
          </div>
        ) : null}
      </div>

      {err ? <div className="text-sm text-rose-300">{err}</div> : null}
    </div>
  );
}

