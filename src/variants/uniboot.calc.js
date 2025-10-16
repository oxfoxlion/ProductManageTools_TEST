// ============================
// File: src/variants/fiberPatch.calc.js
// ============================
import { registerCalculator } from "./registry";
import { findKey, makeCommon } from "./helpers";
import { unibootCableTable } from "../utils/unibootTable.js";

async function buildVariantsPayload_uniboot_row(row) {
  if (!row) return [];

  const handleKey = findKey(row, "Handle");
  const skuKey = findKey(row, "SKU") || findKey(row, "Variant SKU");

  const handle = String(row?.[handleKey] ?? "").trim();
  const baseSku = String(row?.[skuKey] ?? "").trim();
  if (!handle || !baseSku) return [];

  const common = makeCommon(row);

  const opt1Name =
    row?.[findKey(row, "Option1 Name")] ??
    row?.[findKey(row, "Option Name")] ??
    "Length";
  const opt2Name = row?.[findKey(row, "Option2 Name")] ?? "";
  const opt3Name = row?.[findKey(row, "Option3 Name")] ?? "";

  const { variants } = await unibootCableTable(baseSku);

  return (variants || []).map((v) => {
    const priceStr = String(v.variantPrice ?? "");
    return {
      ...common,
      "Option1 Name": opt1Name,
      "Option2 Name": opt2Name,
      "Option3 Name": opt3Name,
      "Option1 Value": v.option1Value ?? "",
      "Option2 Value": "",
      "Option3 Value": "",
      Variant: v.option1Value ?? "",
      "Variant SKU": v.variantSKU ?? "",
      "Variant Price": priceStr,
      "Price(USD)": priceStr,
    };
  });
}

async function buildVariantsPayload_uniboot_rows(rows) {
  const lists = await Promise.all((rows ?? []).map(buildVariantsPayload_uniboot_row));
  const out = [];
  lists.forEach((list, i) => (list || []).forEach((v, j) => out.push({ __rowIndex: i, __variantIndex: j, ...v })));
  return out;
}

registerCalculator({
  id: "uniboot",
  label: "Uniboot",
  buildForRow: buildVariantsPayload_uniboot_row,
  buildForRows: buildVariantsPayload_uniboot_rows,
});
