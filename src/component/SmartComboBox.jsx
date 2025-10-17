import { useEffect, useMemo, useRef, useState } from "react";

/** 規範化比對：小寫 + 去空白/底線/連字號 */
const norm = (s = "") => String(s).toLowerCase().replace(/[\s_-]+/g, "");
/** 排名：完全相等 > 開頭相符 > 包含；同分短字優先 */
function rank(input, items) {
  const n = norm(input);
  return items
    .map((h) => {
      const nh = norm(h);
      let score = 0;
      if (nh === n) score = 3;
      else if (nh.startsWith(n)) score = 2;
      else if (nh.includes(n)) score = 1;
      return { h, score, len: h.length };
    })
    .filter((x) => x.score > 0) // 有輸入時只留相關
    .sort((a, b) => b.score - a.score || a.len - b.len)
    .map((x) => x.h);
}

/**
 * SmartComboBox
 * - 單一欄位：看起來像 select，但可輸入、可鍵盤/滑鼠選取
 *
 * props:
 *  - headers: string[]
 *  - value: string
 *  - onChange(next: string)
 *  - placeholder?: string
 *  - id?: string
 *  - maxItems?: number          // 有輸入時最多顯示幾筆（預設 30）
 *  - panelMaxHeight?: string    // 下拉高度（Tailwind 類別字串），預設 "max-h-64"
 */
export default function SmartComboBox({
  headers = [],
  value = "",
  onChange,
  placeholder = "選擇或輸入欄位名稱…",
  id,
  maxItems = 30,
  panelMaxHeight = "max-h-64",
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value || "");
  const [activeIdx, setActiveIdx] = useState(-1); // 鍵盤高亮
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { setInput(value || ""); }, [value]);

  // 去重，避免重覆顯示
  const uniqueHeaders = useMemo(
    () => Array.from(new Set(headers)),
    [headers]
  );

  // 🔧 核心修正：沒有輸入 -> 顯示「全部」headers；有輸入 -> 顯示排名後前 N 筆
  const items = useMemo(() => {
    const t = input.trim();
    if (!t) return uniqueHeaders;            // 顯示全部（可捲動）
    const ranked = rank(t, uniqueHeaders);
    return ranked.slice(0, maxItems);        // 有輸入時才做限制
  }, [input, uniqueHeaders, maxItems]);

  // 外點關閉
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const commit = (val) => {
    setInput(val);
    onChange?.(val);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === " ")) {
      setOpen(true); e.preventDefault(); return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === "Tab") {
      if (open && items.length) {
        e.preventDefault();
        const pick = activeIdx >= 0 ? items[activeIdx] : items[0];
        commit(pick);
      } else {
        onChange?.(input.trim());
      }
    } else if (e.key === "Escape") {
      setOpen(false); setActiveIdx(-1);
    }
  };

  // 當清單變動時，避免 activeIdx 超出範圍
  useEffect(() => {
    setActiveIdx((i) => (items.length ? Math.min(i, items.length - 1) : -1));
  }, [items.length]);

  return (
    <div ref={wrapRef} className="relative">
      {/* 單一輸入框（看起來像 select） */}
      <div className="flex items-stretch">
        <input
          id={id}
          ref={inputRef}
          className="w-full rounded-l-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={id ? `${id}-listbox` : undefined}
          value={input}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setInput(e.target.value); setActiveIdx(-1); setOpen(true); }}
          onKeyDown={handleKeyDown}
          autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />
        <button
          type="button"
          onClick={() => { inputRef.current?.focus(); setOpen((o) => !o); }}
          className="rounded-r-lg border border-l-0 border-slate-200 px-2 text-slate-600 hover:bg-slate-50"
          aria-label="切換清單"
          tabIndex={-1}
        >
          ▾
        </button>
      </div>

      {/* 下拉清單 */}
      {open && (
        <ul
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          className={`absolute z-50 mt-1 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-md ${panelMaxHeight}`}
        >
          {items.length ? (
            items.map((h, idx) => (
              <li
                key={`${h}-${idx}`}
                role="option"
                aria-selected={value === h}
                className={`cursor-pointer px-3 py-2 text-sm hover:bg-slate-100 ${idx === activeIdx ? "bg-slate-100" : ""}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseDown={(e) => e.preventDefault()}  // 防止失焦
                onClick={() => commit(h)}
                title={h}
              >
                {h}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-xs text-slate-500">（沒有符合的欄位）</li>
          )}
        </ul>
      )}
    </div>
  );
}
