// ============================
// File: src/utils/fiberPatchCableTable.js
// ============================
import { parseCsvFile } from "./parseCsv";

const url = `${import.meta.env.BASE_URL}/csv/FiberPatchCablePrice.csv`;

/** 取前 5 碼（大寫） */
function prefix5(sku = "") {
  return String(sku).trim().toUpperCase().slice(0, 5);
}
/** 第 15–16 碼是否為 NP（1-based → slice(14,16)） */
function isNP(baseSku = "") {
  return String(baseSku).toUpperCase().slice(14, 16) === "NP";
}

/** 讀 CSV → 產生 variants（簡版，欄名堅持使用固定值：option / SKU / <PREFIX5>(-NP)） */
export async function fiberPatchCableTable(baseSku) {
  const res = await fetch(url);
  const text = await res.text();
  const { rows } = await parseCsvFile(text);

  // 從第一列反推表頭
  const headers = rows && rows[0] ? Object.keys(rows[0]) : [];

  // 必要欄位：option、SKU
  const OPTION_KEY = "option";
  const LENGTH_CODE_KEY = "SKU";
  if (!headers.includes(OPTION_KEY) || !headers.includes(LENGTH_CODE_KEY)) {
    console.warn("[fiberPatch] 缺少必要欄位(option 或 SKU)", { headers });
    return { baseSku, variants: [] };
  }

  // 價格欄：前 5 碼；若為 NP 則用 <PREFIX5>-NP
  const p5 = prefix5(baseSku);
  const headerNP = `${p5}-NP`;
  const headerSTD = `${p5}`;

  const priceHeader = isNP(baseSku)
    ? (headers.includes(headerNP) ? headerNP : null)
    : (headers.includes(headerSTD) ? headerSTD : null);

  if (!priceHeader) {
    console.warn("[fiberPatch] 找不到價格欄", { baseSku, p5, isNP: isNP(baseSku), headers });
    return { baseSku, variants: [] };
  }

  const variants = rows.reduce((acc, row) => {
    const optionText = row[OPTION_KEY];
    const lengthCode = row[LENGTH_CODE_KEY];
    const priceRaw   = row[priceHeader];

    if (!optionText || !lengthCode) return acc;
    if (priceRaw == null || String(priceRaw).trim() === "") return acc;

    const price = Number(String(priceRaw).replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(price)) return acc;

    acc.push({
      // 這三個欄位供 calc 組 Shopify 欄位
      option1Name: "Length",
      option1Value: String(optionText).trim(),
      variantSKU: `${baseSku}-${String(lengthCode).trim()}`,
      variantPrice: price,
    });
    return acc;
  }, []);
  console.log({baseSku, variants});
  return { baseSku, variants };
}
