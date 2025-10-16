// src/utils/parseCsv.js
import Papa from "papaparse";

/**
 * 解析 CSV 檔，回傳 { rows, meta, errors }
 * - header: true
 * - dynamicTyping: true
 * - skipEmptyLines: "greedy"
 * - transformHeader: trim
 * - 自動過濾純空白列
 */
export function parseCsvFile(file, options = {}) {
  const defaultOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => String(h ?? "").trim(),
  };
  const opts = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      ...opts,
      complete: (results) => {
        const raw = results?.data ?? [];
        const rows = raw.filter((r) =>
          r && Object.values(r).some((v) => String(v ?? "").trim() !== "")
        );
        resolve({ rows, meta: results?.meta ?? {}, errors: results?.errors ?? [] });
      },
      error: reject,
    });
  });
}

// 將 rows(array of objects) 依 columns(欄位順序) 輸出為 CSV 字串
export function toCsv(rows, columns) {
  const escape = (val) => {
    const s = val === undefined || val === null ? "" : String(val);
    // 若包含逗號、引號、換行，就用雙引號包起來，內部引號轉成兩個引號
    if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const header = columns.map(escape).join(",");
  const body = rows.map(r => columns.map(c => escape(r[c])).join(",")).join("\r\n");
  return header + "\r\n" + body;
}

// 下載 CSV（加入 BOM 讓 Excel 正常顯示中文）
export function downloadCsv(filename, csvString) {
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

