import { useRef, useMemo, useContext } from "react";
import { CsvContext } from "../stores/csvContext";

export default function Variants() {
  const selectRef = useRef(null);
  const {
    variantMode,
    setVariantMode,
    variantCatalog,
    currentVariantsFromList: variantRows,
  } = useContext(CsvContext);

  // 由變體列抽 Option 名稱（最多 3 個）
  const optionNames = useMemo(() => {
    const names = [];
    const seen = new Set();
    for (const r of variantRows || []) {
      for (let i = 1; i <= 3; i++) {
        const label = (r?.[`Option${i} Name`] ?? "").toString().trim();
        if (label && !seen.has(label)) {
          seen.add(label);
          names.push(label);
        }
      }
      if (names.length >= 3) break;
    }
    if (names.length === 0) {
      const hasSingleDim = (variantRows || []).some(
        (r) => r?.["Option1 Value"] || r?.Variant
      );
      if (hasSingleDim) names.push("Length");
    }
    return names.slice(0, 3);
  }, [variantRows]);

  // 每個 Option 的值（chips 用）
  const optionValues = useMemo(() => {
    if (!optionNames.length) return [];
    const groups = optionNames.map(() => new Set());
    for (const r of (variantRows || [])) {
      for (let i = 0; i < optionNames.length; i++) {
        const idx = i + 1;
        let v = r?.[`Option${idx} Value`];
        if ((v == null || String(v).trim() === "") && optionNames.length === 1) {
          v = r?.Variant; // 單一維度時退回 Variant
        }
        if (v != null && String(v).trim() !== "") groups[i].add(String(v).trim());
      }
    }
    return groups.map((s) => Array.from(s));
  }, [variantRows, optionNames]);

  // 表格 rows（完全根據 calculator 的輸出）
  const tableRows = useMemo(() => {
    return (variantRows || []).map((r) => {
      const label =
        r?.Variant ??
        [r?.["Option1 Value"], r?.["Option2 Value"], r?.["Option3 Value"]]
          .filter(Boolean)
          .join(" / ");
      return {
        variant: label ?? "",
        sku:   r?.["Variant SKU"] ?? r?.variantSKU ?? r?.SKU ?? "",
        price: r?.["Price(USD)"]   ?? r?.["Variant Price"] ?? r?.variantPrice ?? "",
      };
    });
  }, [variantRows]);

  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-slate-700">變體</h3>

        <label htmlFor="variantMode">類別</label>
        <select
          id="variantMode"
          ref={selectRef}
          value={variantMode}
          onChange={(e) => setVariantMode(e.target.value)}
        >
          {variantCatalog.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 gap-4">
          {/* 無變體時隱藏 chips；其餘按 calculator 結果顯示 */}
          {variantMode !== "novariants" && (
            optionNames.length > 0 ? (
              <div>
                {optionNames.map((name, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-semibold">{name}</p>
                    <div className="flex flex-wrap gap-2">
                      {(optionValues[i] || []).map((v, j) => (
                        <span key={j} className="inline-block rounded bg-gray-200 px-2 py-1 text-sm">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">尚無可顯示的選項。</p>
            )
          )}

          <section className="mt-2">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Variants</h4>
            <div className="overflow-x-auto rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-700">Variant</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-700">Variant SKU</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-700">Price(USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tableRows.length > 0 ? (
                    tableRows.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-100">
                        <td className="px-3 py-2 whitespace-pre-wrap">{r.variant}</td>
                        <td className="px-3 py-2">{r.sku}</td>
                        <td className="px-3 py-2">{r.price}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-2 text-slate-500" colSpan={3}>
                        尚無變體資料
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
