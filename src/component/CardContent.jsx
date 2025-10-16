// CardContent.jsx
// import { useMemo } from "react";

// export default function CardContent({ row, title, field, canEdit, explicitValue, onSubmit,onSubmitAll }) {
//   const value = useMemo(() => {
//     // 如果有明確傳入值，就優先顯示
//     if (explicitValue !== undefined) {
//       if (explicitValue === null) return "";
//       return String(explicitValue);
//     }
//     // 否則用 row[field]
//     const v = row?.[field];
//     if (v === null || v === undefined) return "";
//     return String(v);
//   }, [row, field, explicitValue]);

//   return (
//     <div className="my-3">
//       {/* 標題與按鈕列 */}
//       <div className="mb-1 flex items-center justify-between">
//         <p className="text-xs font-medium text-slate-500">{title}</p>
//         {canEdit ? (
//           <div className="flex gap-2">
//             <button
//               type="button"
//               className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 
//                        text-[11px] font-medium text-slate-600 hover:bg-slate-50"
//               onClick={onSubmit}
//             >
//               更新這筆
//             </button>
//             <button
//               type="button"
//               className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 
//                        text-[11px] font-medium text-indigo-600 hover:bg-indigo-100"
//               onClick={onSubmitAll}
//             >
//               更新全部
//             </button>
//           </div>
//         ) : null}
//       </div>

//       {/* 值區塊 */}
//       <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 whitespace-pre-wrap min-h-[44px]">
//         {value ? value : <span className="text-slate-400">—</span>}
//       </div>
//     </div>
//   );
// }


// --------------------------------------------------------------------------------------------------------------
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
