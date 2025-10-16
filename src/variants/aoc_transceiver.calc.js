// ============================
// File: src/variants/aoc_transceiver.calc.js
// ============================
import { registerCalculator } from "./registry";
import { findKey, makeCommon } from "./helpers";
import { aocTransceiverTable } from "../utils/aoc_transceiver";

/** 單列：用 AOC_Transceiver.csv 的結果直接映射（不重組） */
async function buildVariantsPayload_AOC_row(row) {
  if (!row) return [];

  // 使用者載入表的基本欄位
  const handleKey = findKey(row, "Handle");
  const skuKey    = findKey(row, "SKU") || findKey(row, "Variant SKU");

  const handle  = String(row?.[handleKey] ?? "").trim();
  const baseSku = String(row?.[skuKey] ?? "").trim();
  if (!handle || !baseSku) return [];

  const common = makeCommon(row);

  // 從 AOC_Transceiver.csv 取到對應 variants
  const { variants } = await aocTransceiverTable(baseSku);

  // 直接 passthrough：Option1 Name 固定 Length，其餘用 table 的欄位
  return (variants || []).map((v) => {
    const option1Value = String(v.option1Value ?? "").trim();
    const variantSKU   = String(v.variantSKU   ?? "").trim();
    const priceNum     = Number(String(v.variantPrice).replace?.(/[^\d.-]/g, "") ?? v.variantPrice);
    const priceStr     = Number.isFinite(priceNum) ? priceNum.toFixed(2) : "";

    return {
      ...common,
      "Option1 Name": "Length",
      "Option2 Name": "",
      "Option3 Name": "",
      "Option1 Value": option1Value,
      "Option2 Value": "",
      "Option3 Value": "",
      Variant: option1Value,
      "Variant SKU": variantSKU,
      "Variant Price": priceStr,
      "Price(USD)": priceStr,
    };
  }).filter(r => r["Option1 Value"] && r["Variant SKU"] && r["Price(USD)"] !== "");
}

/** 多列 */
async function buildVariantsPayload_AOC_rows(rows) {
  const lists = await Promise.all((rows ?? []).map(buildVariantsPayload_AOC_row));
  const out = [];
  lists.forEach((list, i) => (list || []).forEach((v, j) => out.push({ __rowIndex: i, __variantIndex: j, ...v })));
  return out;
}

// 註冊成一個新的 calculator
registerCalculator({
  id: "aocTransceiver",
  label: "AOC Transceiver",
  buildForRow: buildVariantsPayload_AOC_row,
  buildForRows: buildVariantsPayload_AOC_rows,
});
