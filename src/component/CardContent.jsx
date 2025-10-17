// src/component/CardContent.jsx
import { useMemo } from "react";

/**
 * props:
 * - row, title, field, canEdit, explicitValue
 * - selectKeys: string[]      這個欄位對應到要輸出的 payload keys（可多個）
 * - isChecked: boolean        此欄位是否已選取（由上層控制）
 * - onToggle(keys[], checked) 切換勾選
 */
export default function CardContent({
  row,
  title,
  field,
  canEdit,
  explicitValue,
  selectKeys = [],
  isChecked = false,
  onToggle,
}) {
  const value = useMemo(() => {
    if (explicitValue !== undefined) {
      if (explicitValue === null) return "";
      return String(explicitValue);
    }
    const v = row?.[field];
    if (v === null || v === undefined) return "";
    return String(v);
  }, [row, field, explicitValue]);

  const handleCheckbox = (e) => {
    onToggle?.(selectKeys, e.target.checked);
  };

  return (
    <div className="my-3">
      {/* 標題 & 勾選 */}
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {canEdit ? (
            <input
              type="checkbox"
              className="h-4 w-4 accent-indigo-600"
              checked={isChecked}
              onChange={handleCheckbox}
              aria-label={`select ${title}`}
              title={`選取 ${title}`}
            />
          ) : null}
          <p className="text-xs font-medium text-slate-500">{title}</p>
        </div>
      </div>

      {/* 值展示 */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 whitespace-pre-wrap min-h-[44px]">
        {value ? value : <span className="text-slate-400">—</span>}
      </div>
    </div>
  );
}
