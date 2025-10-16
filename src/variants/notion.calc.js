// ============================
// File: src/variants/notion.calc.js
// ============================
import { registerCalculator } from "./registry";
import { findKey, splitComma, splitSlashKeepHoles, makeCommon, normalizePrice } from "./helpers";

function buildVariantsPayload_notion(row) {
  if (!row) return [];

  const handleKey = findKey(row, "Handle");
  const optNameKey = findKey(row, "Option Name");
  const optValueKey = findKey(row, "Option Value");
  const optSkuKey = findKey(row, "Option SKU");
  const optPriceKey = findKey(row, "Option price(USD)") || findKey(row, "Option Price(USD)");

  const handle = String(row?.[handleKey] ?? "").trim();
  if (!handle) return [];

  const optionNames = splitComma(row?.[optNameKey]).slice(0, 3);
  const needLen = Math.max(optionNames.length, 1);

  const products = splitComma(row?.[optValueKey]).map((p) => splitSlashKeepHoles(p, needLen));
  const skuList = splitComma(row?.[optSkuKey]);
  const priceList = splitComma(row?.[optPriceKey]);

  const rowCount = Math.max(products.length, skuList.length, priceList.length);
  if (rowCount === 0) return [];

  const common = makeCommon(row);

  const optNameFields = {
    "Option1 Name": optionNames[0] ?? "",
    "Option2 Name": optionNames[1] ?? "",
    "Option3 Name": optionNames[2] ?? "",
  };

  const out = [];
  for (let i = 0; i < rowCount; i++) {
    const vals = products[i] ?? Array.from({ length: needLen }, () => null);
    const variantName = vals.filter(Boolean).join(" / ");
    const optValueFields = {
      "Option1 Value": vals[0] ?? "",
      "Option2 Value": vals[1] ?? "",
      "Option3 Value": vals[2] ?? "",
    };
   const price = normalizePrice(priceList[i]);

    out.push({
      ...common,
      ...optNameFields,
      ...optValueFields,
      Variant: variantName,
      "Variant SKU": skuList[i] ?? "",
      "Variant Price": price,
      "Price(USD)": price,
    });
  }
  return out;
}

registerCalculator({
  id: "notion",
  label: "Notion 多變體",
  buildForRow: buildVariantsPayload_notion,
});