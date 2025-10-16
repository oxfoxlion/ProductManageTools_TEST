// ============================
// File: src/variants/registry.js
// ============================
const _calculators = new Map();

/**
 * 註冊變體算法
 * @param {object} calc
 * @param {string} calc.id
 * @param {string} calc.label
 * @param {(row:object, ctx?:object)=>Promise<object[]>|object[]} calc.buildForRow
 * @param {(rows:object[], ctx?:object)=>Promise<object[]>|object[]} [calc.buildForRows]
 */
export function registerCalculator(calc) {
  if (!calc?.id || !calc?.label || typeof calc.buildForRow !== "function") {
    throw new Error("[registerCalculator] invalid calculator");
  }
  _calculators.set(calc.id, calc);
}

export function listCalculators() {
  return Array.from(_calculators.values());
}

export function getCalculator(id) {
  return _calculators.get(id) || null;
}

/** 以指定 calculator 計算整批 rows（自動處理 __rowIndex/__variantIndex） */
export async function buildVariantsById(id, rows = [], ctx = {}) {
  const calc = getCalculator(id);
  if (!calc) throw new Error(`[buildVariantsById] calculator not found: ${id}`);

  if (typeof calc.buildForRows === "function") {
    return await calc.buildForRows(rows, ctx);
  }

  const lists = await Promise.all(rows.map((row) => Promise.resolve(calc.buildForRow(row, ctx))));
  const out = [];
  lists.forEach((list, i) => (list || []).forEach((v, j) => out.push({ __rowIndex: i, __variantIndex: j, ...v })));
  return out;
}