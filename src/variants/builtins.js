// src/variants/builtins.js
import { registerCalculator } from "./registry.js";
import {
  buildVariantsPayload_notion,
  buildVariantsPayload_loopback,
  buildVariantsPayload_noVariants,
  // 注意：MTP/MPO 已是 async 整批版
  buildVariantsPayload_MTPMPO as build_MTPMPO_rows,
} from "../utils/buildPayload";

/** notion */
registerCalculator({
  id: "notion",
  label: "notion",
  async: false,
  buildForRow: (row) => buildVariantsPayload_notion(row)
});

/** loopback */
registerCalculator({
  id: "loopback",
  label: "Loopback",
  async: false,
  buildForRow: (row) => buildVariantsPayload_loopback(row)
});

/** 無變體 */
registerCalculator({
  id: "novariants",
  label: "無變體",
  async: false,
  buildForRow: (row) => buildVariantsPayload_noVariants(row)
});

/** MTP/MPO（你現有的是整批 rows 的 async 版本） */
registerCalculator({
  id: "mtpmpo",
  label: "MTPMPO",
  async: true,
  buildForRows: async (rows) => {
    // 直接沿用你現有的整批版本
    return await build_MTPMPO_rows(rows);
  },
  // 若之後想做單筆版，也可以補 buildForRow(row)
});
