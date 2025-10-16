// ============================
// File: src/utils/aoc_transceiver.js
// ============================
import { parseCsvFile } from "./parseCsv";

const CSV_URL = "/csv/AOC_Transceiver.csv";

/** 小工具：正規化表頭（去 BOM / NBSP / 異體 dash / 大小寫） */
function normHeader(s = "") {
  return String(s)
    .replace(/^\uFEFF/, "")   // BOM
    .replace(/\u00A0/g, " ")  // NBSP -> space
    .replace(/[–—]/g, "-")    // 破折號 -> -
    .trim()
    .toLowerCase();
}

/** 讀 AOC_Transceiver.csv → 產生 variants
 * 規則：
 *  - 以「使用者載入 CSV 的 SKU（baseSku）」去比對價目表「表頭」相等（不分大小寫與常見隱形字元）。
 *  - 命中該表頭欄位就取該欄之價格。
 *  - option 欄固定使用價目表的 `option`（大小寫不拘）；長度代碼用價目表 `SKU` 欄。
 * 回傳：
 *  { baseSku, priceHeader, optionHeader, variants: [{ option1Value, variantSKU, variantPrice }] }
 */
export async function aocTransceiverTable(baseSku) {
  // 破快取（避免 Chrome/代理吃舊檔），開發時很有用
  const res = await fetch(`${CSV_URL}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) {
    console.error("[aoc] CSV 載入失敗", res.status, res.statusText);
    return { baseSku, priceHeader: null, optionHeader: null, variants: [] };
  }
  const text = await res.text();

  // 簡單防呆：避免載到 HTML 錯誤頁
  const head = text.slice(0, 120).toLowerCase();
  if (head.includes("<!doctype html") || head.includes("<html")) {
    console.error("[aoc] 取得到的不是 CSV，可能是路徑錯誤頁");
    return { baseSku, priceHeader: null, optionHeader: null, variants: [] };
  }

  const parsed = await parseCsvFile(text);
  const rows = parsed?.rows ?? (Array.isArray(parsed) ? parsed : []);
  let headers = parsed?.headers;
  if (!headers || !headers.length) headers = rows[0] ? Object.keys(rows[0]) : [];

  if (!rows.length || !headers.length) {
    console.warn("[aoc] CSV 為空或無表頭");
    return { baseSku, priceHeader: null, optionHeader: null, variants: [] };
  }

  // 建立「正規化 → 原始表頭」映射
  const norm2raw = new Map(headers.map(h => [normHeader(h), h]));

  // 1) 找 option 欄（僅 option；若你有別名再加）
  const optionHeader =
    norm2raw.get(normHeader("option")) ??
    norm2raw.get(normHeader("length spec")) ??
    norm2raw.get(normHeader("length")) ??
    null;

  // 2) 找長度代碼欄（固定用 SKU）
  const lengthCodeHeader = headers.includes("SKU")
    ? "SKU"
    : norm2raw.get(normHeader("SKU")) ?? null;

  // 3) 以 baseSku 的「原字串」當作價格表頭（不分大小寫匹配）
  const priceHeader =
    norm2raw.get(normHeader(baseSku)) ?? null;

  if (!optionHeader || !lengthCodeHeader || !priceHeader) {
    console.warn("[aoc] 缺少必要欄位或找不到對應價格欄", {
      baseSku,
      optionHeader,
      lengthCodeHeader,
      priceHeader,
      headersPreview: headers.slice(0, 12)
    });
    return { baseSku, priceHeader, optionHeader, variants: [] };
  }

  // 4) 組 variants：Option1 Value 取 option 欄；Variant SKU = <baseSku>-<長度代碼>；價格來自命中欄
  const variants = rows.reduce((acc, row) => {
    const optionText = row[optionHeader];
    const lengthCode = row[lengthCodeHeader];
    const priceRaw   = row[priceHeader];

    if (!optionText || !lengthCode) return acc;
    if (priceRaw == null || String(priceRaw).trim() === "") return acc;

    const priceNum = Number(String(priceRaw).replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(priceNum)) return acc;

    acc.push({
      option1Value: String(optionText).trim(),
      variantSKU: `${baseSku}-${String(lengthCode).trim()}`,
      variantPrice: priceNum,
      _matchedHeader: priceHeader, // 除錯用
    });
    return acc;
  }, []);

  console.log("[aoc] sample:", variants[0]);
  return { baseSku, priceHeader, optionHeader, variants };
}
