// src/component/CsvUploadButton.jsx
import { useRef, useState } from "react";
import { parseCsvFile } from "../utils/parseCsv";
import { useCsv } from "../stores/useCsv";

export default function CsvUploadButton({ className = "", children = "選擇檔案", onLoaded }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const { loadCsv } = useCsv();

  const trigger = () => inputRef.current?.click();

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { rows } = await parseCsvFile(file);
      loadCsv({ rows, fileName: file.name });
      onLoaded?.();
    } catch (err) {
      console.error("CSV 解析錯誤：", err);
      alert("CSV 解析失敗，請確認檔案格式");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={trigger}
        disabled={busy}
        className={
          "inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 " +
          className
        }
      >
        {busy ? "解析中…" : children}
      </button>
      <input ref={inputRef} type="file" accept=".csv" hidden onChange={onChange} />
    </>
  );
}
