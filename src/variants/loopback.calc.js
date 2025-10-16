// ============================
// File: src/variants/loopback.calc.js
// ============================
import { registerCalculator } from "./registry";
import { findKey, splitComma, stripQuotes, makeCommon } from "./helpers";

function buildVariantsPayload_loopback(row) {
  if (!row) return [];

  const handleKey = findKey(row, "Handle");
  const optNameKey = findKey(row, "Option Name");
  const optValueKey = findKey(row, "Option Value");
  const optSkuKey = findKey(row, "Option SKU");
  const optPriceKey = findKey(row, "Option price(USD)") || findKey(row, "Option Price(USD)");

  const handle = String(row?.[handleKey] ?? "").trim();
  if (!handle) return [];

  const optionNames = splitComma(row?.[optNameKey]).slice(0, 1);
  const optNameFields = {
    "Option1 Name": optionNames[0] ?? "Option",
    "Option2 Name": "",
    "Option3 Name": "",
  };

  const tokens = splitComma(row?.[optValueKey]).map(stripQuotes);
  const skuList = splitComma(row?.[optSkuKey]);
  const priceList = splitComma(row?.[optPriceKey]);

  const rowCount = Math.max(tokens.length, skuList.length, priceList.length);
  if (rowCount === 0) return [];

  const common = makeCommon(row);

  const out = [];
  for (let i = 0; i < rowCount; i++) {
    const value = tokens[i] ?? "";
    const price = priceList[i] ?? "";
    out.push({
      ...common,
      ...optNameFields,
      "Option1 Value": value,
      "Option2 Value": "",
      "Option3 Value": "",
      Variant: value,
      "Variant SKU": skuList[i] ?? "",
      "Variant Price": price,
      "Price(USD)": price,
    });
  }
  return out;
}

registerCalculator({
  id: "loopback",
  label: "Loopback",
  buildForRow: buildVariantsPayload_loopback,
});