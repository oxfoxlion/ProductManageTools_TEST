// // src/stores/CsvProvider.jsx
// import { useEffect, useMemo, useReducer, useState } from "react";
// import { CsvContext } from "./csvContext";
// import { initial, csvReducer } from "./reducer";

// // 依你的專案路徑調整
// import {
//   buildProductsPayload,
//   buildMetafieldsPayload,
//   buildTranslationPayload,
//   buildVariantsPayloads_loopback,
//   buildVariantsPayloads_notion,
//   buildVariantsPayloads_noVariants,
//   buildVariantsPayloads_MTPMPO as buildMTPMPO,
// } from "../utils/buildPayload";

// /** 將當前 row 依 customMap 解析成 table.custom_N 預覽值（只做當前列） */
// function resolveCustomTable(row, customMap = {}) {
//   if (!row) return {};
//   const out = {};
//   Object.entries(customMap || {}).forEach(([slot, header]) => {
//     if (!header) return;
//     const key = typeof header === "string" ? header.trim() : header;
//     const raw = row?.[key];
//     if (raw === undefined || raw === null) return;
//     const str = String(raw);
//     if (str.trim() === "") return;
//     out[`table.${slot}`] = str;
//   });
//   return out;
// }

// export function CsvProvider({ children }) {
//   const [state, dispatch] = useReducer(csvReducer, initial, (init) => {
//     try {
//       const saved = JSON.parse(localStorage.getItem("csv_state_v1") || "{}");
//       const map = JSON.parse(localStorage.getItem("customMap_v1") || "{}");
//       return { ...init, ...saved, customMap: map || {} };
//     } catch {
//       return init;
//     }
//   });

//   // 永續化：檔名與游標
//   useEffect(() => {
//     localStorage.setItem(
//       "csv_state_v1",
//       JSON.stringify({ fileName: state.fileName, selectedIndex: state.selectedIndex })
//     );
//   }, [state.fileName, state.selectedIndex]);

//   // 永續化：customMap
//   useEffect(() => {
//     localStorage.setItem("customMap_v1", JSON.stringify(state.customMap));
//   }, [state.customMap]);

//   // 安全索引 + 原始 currentRow（CSV 當前列）
//   const safeIndex = useMemo(() => {
//     if (!state.rows.length) return -1;
//     return Math.min(Math.max(0, state.selectedIndex), state.rows.length - 1);
//   }, [state.rows.length, state.selectedIndex]);

//   const currentRow = safeIndex >= 0 ? state.rows[safeIndex] : null;

//   // ---------- 整批 payload（每筆附帶 __rowIndex 方便回推） ----------
//   const productPayloads = useMemo(() => {
//     const rows = state.rows ?? [];
//     return rows
//       .map((row, i) => {
//         const base = buildProductsPayload(row);
//         return base?.handle ? { __rowIndex: i, ...base } : null;
//       })
//       .filter(Boolean);
//   }, [state.rows]);

//   const metafieldPayloads = useMemo(() => {
//     const rows = state.rows ?? [];
//     const map = state.customMap ?? {};
//     return rows
//       .map((row, i) => {
//         const base = buildMetafieldsPayload(row, map);
//         return base?.handle ? { __rowIndex: i, ...base } : null;
//       })
//       .filter(Boolean);
//   }, [state.rows, state.customMap]);

//   const translationPayloads = useMemo(() => {
//     const rows = state.rows ?? [];
//     return rows
//       .map((row, i) => {
//         const base = buildTranslationPayload(row);
//         return base?.handle ? { __rowIndex: i, ...base } : null;
//       })
//       .filter(Boolean);
//   }, [state.rows]);

//   // 展開所有 rows 為「變體列」並攤平（每筆附 __rowIndex/__variantIndex）
//   const variantsPayloads = useMemo(() => {
//     const rows = state.rows ?? [];
//     return buildVariantsPayloads_notion(rows);
//   }, [state.rows]);

//   const variantsPayloads_loopback = useMemo(() => {
//     const rows = state.rows ?? [];
//     return buildVariantsPayloads_loopback(rows);
//   }, [state.rows]);

//   const variantsPayloads_noVariants = useMemo(() => {
//     const rows = state.rows ?? [];
//     return buildVariantsPayloads_noVariants(rows);
//   }, [state.rows]);

//   const [variantsPayloads_MTPMPO, setVariantsPayloads_MTPMPO] = useState([]);
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       const rows = state.rows ?? [];
//       if (!rows.length) { setVariantsPayloads_MTPMPO([]); return; }
//       const list = await buildMTPMPO(rows); // 已映射好的 payload
//       if (!alive) return;
//       console.log("[MTPMPO payload] sample:", list[0]);
//       setVariantsPayloads_MTPMPO(list);
//     })().catch(console.error);
//     return () => { alive = false; };
//   }, [state.rows]);

//   // ---------- 當前單筆 payload（直接用 currentRow 計算，與 UI 游標一致） ----------
//   const currentProductPayload = useMemo(() => {
//     return currentRow ? buildProductsPayload(currentRow) : null;
//   }, [currentRow]);

//   const currentMetafieldPayload = useMemo(() => {
//     return currentRow ? buildMetafieldsPayload(currentRow, state.customMap) : null;
//   }, [currentRow, state.customMap]);

//   const currentTranslationPayload = useMemo(() => {
//     return currentRow ? buildTranslationPayload(currentRow) : null;
//   }, [currentRow]);

//   // ---------- 當前單筆 payload（從「整批已過濾」清單找，跟實際送單一致） ----------
//   const currentProductFromList = useMemo(() => {
//     return productPayloads.find((p) => p.__rowIndex === safeIndex) ?? null;
//   }, [productPayloads, safeIndex]);

//   const currentMetafieldFromList = useMemo(() => {
//     return metafieldPayloads.find((p) => p.__rowIndex === safeIndex) ?? null;
//   }, [metafieldPayloads, safeIndex]);

//   const currentTranslationFromList = useMemo(() => {
//     return translationPayloads.find((p) => p.__rowIndex === safeIndex) ?? null;
//   }, [translationPayloads, safeIndex]);

//   // 當前列的「所有變體列」
//   const currentVariantsFromList = useMemo(() => {
//     return variantsPayloads.filter((v) => v.__rowIndex === safeIndex);
//   }, [variantsPayloads, safeIndex]);

//   // 當前列的 table.custom_* 預覽
//   const currentResolvedCustoms = useMemo(() => {
//     return resolveCustomTable(currentRow, state.customMap);
//   }, [currentRow, state.customMap]);

//   // 一次打包（預設用 notion 版本）
//   const allBody = useMemo(() => {
//     return {
//       products: productPayloads,
//       metafields: metafieldPayloads,
//       translations: translationPayloads,
//       variants: variantsPayloads,
//     };
//   }, [productPayloads, metafieldPayloads, translationPayloads, variantsPayloads]);

//   // 提供給外部使用的值與操作
//   const value = useMemo(
//     () => ({
//       // 原始狀態
//       ...state,
//       currentRow,

//       // 對應預覽（table.custom_*）
//       currentResolvedCustoms,

//       // 整批 payload（含 __rowIndex）
//       productPayloads,
//       metafieldPayloads,
//       translationPayloads,
//       variantsPayloads_loopback,
//       variantsPayloads,
//       variantsPayloads_noVariants,
//       variantsPayloads_MTPMPO,

//       // 當前單筆（兩種口味）
//       currentProductPayload,
//       currentMetafieldPayload,
//       currentTranslationPayload,

//       currentProductFromList,
//       currentMetafieldFromList,
//       currentTranslationFromList,
//       currentVariantsFromList,

//       // 一次打包
//       allBody,

//       // actions
//       setIndex: (i) => dispatch({ type: "SET_INDEX", payload: i }),
//       setCustomMap: (next) => {
//         const resolved = typeof next === "function" ? next(state.customMap) : next;
//         dispatch({ type: "SET_CUSTOM_MAP", payload: resolved || {} });
//       },
//       loadCsv: ({ rows, fileName }) =>
//         dispatch({ type: "LOAD_CSV", payload: { rows, fileName } }),
//     }),
//     [
//       state,
//       currentRow,
//       currentResolvedCustoms,
//       productPayloads,
//       metafieldPayloads,
//       translationPayloads,
//       variantsPayloads_loopback,
//       variantsPayloads,
//       variantsPayloads_noVariants,
//       variantsPayloads_MTPMPO,
//       currentProductPayload,
//       currentMetafieldPayload,
//       currentTranslationPayload,
//       currentProductFromList,
//       currentMetafieldFromList,
//       currentTranslationFromList,
//       currentVariantsFromList,
//       allBody,
//     ]
//   );

//   return <CsvContext.Provider value={value}>{children}</CsvContext.Provider>;
// }
import { useEffect, useMemo, useReducer, useState } from "react";
import { CsvContext } from "./csvContext";
import { initial, csvReducer } from "./reducer";

// utils
import {
  buildProductsPayload,
  buildMetafieldsPayload,
  buildTranslationPayload,
} from "../utils/buildPayload";

// variants registry（單一註冊入口）
import { buildVariantsById, listCalculators } from "../variants";

/** 將當前 row 依 customMap 解析成 table.custom_N 預覽值（只做當前列） */
function resolveCustomTable(row, customMap = {}) {
  if (!row) return {};
  const out = {};
  Object.entries(customMap || {}).forEach(([slot, header]) => {
    if (!header) return;
    const key = typeof header === "string" ? header.trim() : header;
    const raw = row?.[key];
    if (raw === undefined || raw === null) return;
    const str = String(raw);
    if (str.trim() === "") return;
    out[`table.${slot}`] = str;
  });
  return out;
}

export function CsvProvider({ children }) {
  // ---------- 基礎狀態（含 localStorage 初始化） ----------
  const [state, dispatch] = useReducer(csvReducer, initial, (init) => {
    try {
      const saved = JSON.parse(localStorage.getItem("csv_state_v1") || "{}");
      const map = JSON.parse(localStorage.getItem("customMap_v1") || "{}");
      return { ...init, ...saved, customMap: map || {} };
    } catch {
      return init;
    }
  });

  // 變體模式（對應 registry 的 calculator id）
  const [variantMode, setVariantMode] = useState(() => {
    try {
      return localStorage.getItem("variantMode_v1") || "notion";
    } catch {
      return "notion";
    }
  });

  // 永續化：檔名、游標、customMap、variantMode
  useEffect(() => {
    localStorage.setItem(
      "csv_state_v1",
      JSON.stringify({ fileName: state.fileName, selectedIndex: state.selectedIndex })
    );
  }, [state.fileName, state.selectedIndex]);

  useEffect(() => {
    localStorage.setItem("customMap_v1", JSON.stringify(state.customMap));
  }, [state.customMap]);

  useEffect(() => {
    localStorage.setItem("variantMode_v1", variantMode);
  }, [variantMode]);

  // ---------- 安全索引 + 原始 currentRow（CSV 當前列） ----------
  const safeIndex = useMemo(() => {
    if (!state.rows.length) return -1;
    return Math.min(Math.max(0, state.selectedIndex), state.rows.length - 1);
  }, [state.rows.length, state.selectedIndex]);

  const currentRow = safeIndex >= 0 ? state.rows[safeIndex] : null;

  // ---------- 整批 payload（每筆附帶 __rowIndex 方便回推） ----------
  const productPayloads = useMemo(() => {
    const rows = state.rows ?? [];
    return rows
      .map((row, i) => {
        const base = buildProductsPayload(row);
        return base?.handle ? { __rowIndex: i, ...base } : null;
      })
      .filter(Boolean);
  }, [state.rows]);

  const metafieldPayloads = useMemo(() => {
    const rows = state.rows ?? [];
    const map = state.customMap ?? {};
    return rows
      .map((row, i) => {
        const base = buildMetafieldsPayload(row, map);
        return base?.handle ? { __rowIndex: i, ...base } : null;
      })
      .filter(Boolean);
  }, [state.rows, state.customMap]);

  const translationPayloads = useMemo(() => {
    const rows = state.rows ?? [];
    return rows
      .map((row, i) => {
        const base = buildTranslationPayload(row);
        return base?.handle ? { __rowIndex: i, ...base } : null;
      })
      .filter(Boolean);
  }, [state.rows]);

  // ---------- 以 registry 模式統一計算變體（唯一來源） ----------
  const [variantsActive, setVariantsActive] = useState([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      const rows = state.rows ?? [];
      if (!rows.length) { setVariantsActive([]); return; }
      const list = await buildVariantsById(variantMode, rows, {
        // 需要時可放入共用上下文（價表快取、語系、設定…）
      });
      if (!alive) return;
      setVariantsActive(list);
    })().catch(console.error);
    return () => { alive = false; };
  }, [state.rows, variantMode]);

  // ---------- 當前單筆 payload（直接用 currentRow 計算） ----------
  const currentProductPayload = useMemo(() => {
    return currentRow ? buildProductsPayload(currentRow) : null;
  }, [currentRow]);

  const currentMetafieldPayload = useMemo(() => {
    return currentRow ? buildMetafieldsPayload(currentRow, state.customMap) : null;
  }, [currentRow, state.customMap]);

  const currentTranslationPayload = useMemo(() => {
    return currentRow ? buildTranslationPayload(currentRow) : null;
  }, [currentRow]);

  // ---------- 當前單筆（從整批清單找） ----------
  const currentProductFromList = useMemo(() => {
    return productPayloads.find((p) => p.__rowIndex === safeIndex) ?? null;
  }, [productPayloads, safeIndex]);

  const currentMetafieldFromList = useMemo(() => {
    return metafieldPayloads.find((p) => p.__rowIndex === safeIndex) ?? null;
  }, [metafieldPayloads, safeIndex]);

  const currentTranslationFromList = useMemo(() => {
    return translationPayloads.find((p) => p.__rowIndex === safeIndex) ?? null;
  }, [translationPayloads, safeIndex]);

  // 當前列的「所有變體列」（統一取自 variantsActive）
  const currentVariantsFromList = useMemo(() => {
    return variantsActive.filter((v) => v.__rowIndex === safeIndex);
  }, [variantsActive, safeIndex]);

  // 當前列的 table.custom_* 預覽
  const currentResolvedCustoms = useMemo(() => {
    return resolveCustomTable(currentRow, state.customMap);
  }, [currentRow, state.customMap]);

  // 一次打包（變體用統一的 variantsActive）
  const allBody = useMemo(() => {
    return {
      products: productPayloads,
      metafields: metafieldPayloads,
      translations: translationPayloads,
      variants: variantsActive,
    };
  }, [productPayloads, metafieldPayloads, translationPayloads, variantsActive]);

  // 提供 UI 使用的可用算法清單（給下拉選單）
  const variantCatalog = useMemo(() => listCalculators(), []);

  // ---------- 封裝 context value ----------
  const value = useMemo(
    () => ({
      // 原始狀態
      ...state,
      currentRow,

      // custom 預覽
      currentResolvedCustoms,

      // 整批 payload（附 __rowIndex）
      productPayloads,
      metafieldPayloads,
      translationPayloads,

      // 變體（單一真實來源）
      variantMode,
      setVariantMode,
      variantCatalog,
      variantsActive,

      // 當前單筆（即時計算）
      currentProductPayload,
      currentMetafieldPayload,
      currentTranslationPayload,

      // 當前單筆（從整批找）
      currentProductFromList,
      currentMetafieldFromList,
      currentTranslationFromList,
      currentVariantsFromList,

      // 一次打包
      allBody,

      // actions
      setIndex: (i) => dispatch({ type: "SET_INDEX", payload: i }),
      setCustomMap: (next) => {
        const resolved = typeof next === "function" ? next(state.customMap) : next;
        dispatch({ type: "SET_CUSTOM_MAP", payload: resolved || {} });
      },
      loadCsv: ({ rows, fileName }) =>
        dispatch({ type: "LOAD_CSV", payload: { rows, fileName } }),
    }),
    [
      state,
      currentRow,
      currentResolvedCustoms,
      productPayloads,
      metafieldPayloads,
      translationPayloads,
      variantMode,
      variantCatalog,
      variantsActive,
      currentProductPayload,
      currentMetafieldPayload,
      currentTranslationPayload,
      currentProductFromList,
      currentMetafieldFromList,
      currentTranslationFromList,
      currentVariantsFromList,
      allBody,
    ]
  );

  return <CsvContext.Provider value={value}>{children}</CsvContext.Provider>;
}
