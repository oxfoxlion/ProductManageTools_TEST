import { useMemo, useState, useRef, useEffect, useDeferredValue } from "react";

/** ---------- 標準化 / 分詞（支援 50Gbps=50G、全半形、符號切分） ---------- */
const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\w.+-]+/g, " ") // 保留 . + -（常見於型號）
    .replace(/\s+/g, " ")
    .trim();

const foldToken = (t) => {
  // 50gbps、50gb → 50g
  if (/^\d+\s*gbps?$/.test(t)) return t.replace(/gbps?$/, "g");
  // 已是 50g 的直接回傳
  if (/^\d+\s*g$/.test(t)) return t;
  // 其他可在此做同義詞映射：e.g. aoc -> aoc, sfp56 -> sfp56
  return t;
};

const tokenize = (s) =>
  normalize(s)
    .split(" ")
    .filter(Boolean)
    .map(foldToken);

/** ---------- 高亮工具 ---------- */
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const highlight = (text, keyword) => {
  if (!keyword) return text;
  const re = new RegExp(`(${escapeRegExp(keyword)})`, "ig");
  const parts = String(text).split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

export default function AsideList({ rows, selectedProductIndex, setSelectedProductIndex }) {
  /** -------------------- 狀態 -------------------- */
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);

  /** -------------------- 固定欄位擷取 -------------------- */
  const getRowLabel = (row) => String(row?.["Title"] ?? "(無標題)");
  const getRowSKU = (row) => (row?.["SKU"] ? String(row["SKU"]) : "");

  /** -------------------- 一次性索引快取 -------------------- */
  const { labels, skus, labelsL, skusL, tokensList, suggestionPool } = useMemo(() => {
    const L = rows.length;
    const _labels = new Array(L);
    const _skus = new Array(L);
    const _labelsL = new Array(L);
    const _skusL = new Array(L);
    const _tokensList = new Array(L);
    const poolSet = new Set(); // 自動完成候選（顯示原字串）

    for (let i = 0; i < L; i++) {
      const t = getRowLabel(rows[i]);
      const s = getRowSKU(rows[i]);

      _labels[i] = t;
      _skus[i] = s;
      _labelsL[i] = t.toLowerCase();
      _skusL[i] = s.toLowerCase();

      // Title + SKU → token set
      _tokensList[i] = new Set([...tokenize(t), ...tokenize(s)]);

      poolSet.add(t);
      if (s) poolSet.add(s);
    }

    return {
      labels: _labels,
      skus: _skus,
      labelsL: _labelsL,
      skusL: _skusL,
      tokensList: _tokensList,
      suggestionPool: Array.from(poolSet),
    };
  }, [rows]);

  /** -------------------- Debounce 輸入 -------------------- */
  const deferredQuery = useDeferredValue(query);
  const q = deferredQuery.trim().toLowerCase(); // 用於高亮 / 建議
  const qTokens = useMemo(() => tokenize(deferredQuery), [deferredQuery]); // 用於 Token AND 比對

  /** -------------------- 篩選（Token AND，比 Title+SKU tokens） -------------------- */
  const filteredIndices = useMemo(() => {
    const L = rows.length;
    if (qTokens.length === 0) {
      const arr = new Array(L);
      for (let i = 0; i < L; i++) arr[i] = i;
      return arr;
    }
    const out = [];
    for (let i = 0; i < L; i++) {
      const tokens = tokensList[i];
      let ok = true;
      for (const qt of qTokens) {
        if (!tokens.has(qt)) {
          ok = false;
          break;
        }
      }
      if (ok) out.push(i);
    }
    return out;
  }, [rows.length, tokensList, qTokens]);

  /** -------------------- 自動完成（前綴優先→包含） -------------------- */
  const suggestions = useMemo(() => {
    if (!q) return [];
    const MAX = 8;
    const starts = [];
    const contains = [];
    for (let i = 0; i < suggestionPool.length; i++) {
      const s = suggestionPool[i];
      const sl = s.toLowerCase();
      if (sl.startsWith(q)) {
        starts.push(s);
        if (starts.length >= MAX) break;
      }
    }
    if (starts.length < MAX) {
      for (let i = 0; i < suggestionPool.length; i++) {
        const s = suggestionPool[i];
        const sl = s.toLowerCase();
        if (!sl.startsWith(q) && sl.includes(q)) {
          contains.push(s);
          if (starts.length + contains.length >= MAX) break;
        }
      }
    }
    return starts.concat(contains).slice(0, MAX);
  }, [q, suggestionPool]);

  const applySuggestion = (s) => {
    setQuery(s);
    setOpen(false);
    const sl = s.toLowerCase();
    const foundIdx = labelsL.findIndex((x, i) => x === sl || skusL[i] === sl);
    if (foundIdx >= 0) {
      setSelectedProductIndex(foundIdx);
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-idx="${foundIdx}"]`);
        el?.scrollIntoView({ block: "nearest" });
      });
    }
  };

  /** -------------------- 輕量虛擬清單 -------------------- */
  const listRef = useRef(null);
  const [viewportH, setViewportH] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const ITEM_H = 56; // 列高估算
  const BUFFER = 6;

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const resize = () => setViewportH(el.clientHeight || 0);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onScroll = (e) => setScrollTop(e.currentTarget.scrollTop || 0);

  const total = filteredIndices.length;
  const start = Math.max(Math.floor(scrollTop / ITEM_H) - BUFFER, 0);
  const visibleCount = Math.ceil(viewportH / ITEM_H) + BUFFER * 2;
  const end = Math.min(start + visibleCount, total);
  const topPad = start * ITEM_H;
  const bottomPad = (total - end) * ITEM_H;

  // 選中項在過濾後保持可視
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const i = filteredIndices.indexOf(selectedProductIndex);
    if (i < 0) return;
    const top = i * ITEM_H;
    const bottom = top + ITEM_H;
    const viewTop = scrollTop;
    const viewBottom = scrollTop + viewportH;
    if (top < viewTop) el.scrollTop = top;
    else if (bottom > viewBottom) el.scrollTop = bottom - viewportH;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredIndices, selectedProductIndex]);

  /** -------------------- 鍵盤 / 點外關閉 -------------------- */
  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx]) applySuggestion(suggestions[activeIdx]);
      else setOpen(false);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  useEffect(() => {
    const onClick = (e) => {
      if (e.target === inputRef.current) return;
      setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  /** -------------------- Render -------------------- */
  return (
    <aside className="col-span-12 md:col-span-3">
      <div className="rounded-2xl border border-gray-300 bg-white shadow-sm">
        <div className="sticky top-4 p-3">
          {/* 標題列 */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-700">項目清單</h2>
            <span className="text-xs text-slate-500">
              {filteredIndices.length} / {rows.length} 筆
            </span>
          </div>

          {/* 搜尋＋自動完成 */}
          <div className="relative mb-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-200">
              <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                  setActiveIdx(-1);
                }}
                onFocus={() => suggestions.length && setOpen(true)}
                onKeyDown={onKeyDown}
                placeholder="搜尋 Title 或 SKU"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setOpen(false);
                    setActiveIdx(-1);
                    inputRef.current?.focus();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700"
                  aria-label="清除搜尋"
                  title="清除搜尋"
                >
                  清除
                </button>
              )}
            </div>

            {/* 下拉建議 */}
            {open && suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <ul role="listbox" className="max-h-64 overflow-auto py-1">
                  {suggestions.map((s, i) => (
                    <li key={s}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={i === activeIdx}
                        onMouseEnter={() => setActiveIdx(i)}
                        onMouseLeave={() => setActiveIdx(-1)}
                        onClick={() => applySuggestion(s)}
                        className={`w-full px-3 py-2 text-left text-sm ${i === activeIdx ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                      >
                        {highlight(s, query)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 虛擬清單容器 */}
          <div
            ref={listRef}
            onScroll={onScroll}
            className="max-h-[60vh] overflow-auto pr-1 custom-scroll"
          >
            {filteredIndices.length === 0 && (
              <p className="text-xs text-slate-500 p-2">沒有符合「{query}」的項目</p>
            )}

            {/* 上方 padding */}
            <div style={{ height: topPad }} />

            {/* 只渲染可視範圍 */}
            {filteredIndices.slice(start, end).map((originalIndex) => {
              const label = labels[originalIndex];
              const sku = skus[originalIndex];
              const isActive = originalIndex === selectedProductIndex;

              return (
                <button
                  key={`${originalIndex}-${label}-${sku}`}
                  data-idx={originalIndex}
                  onClick={() => setSelectedProductIndex(originalIndex)}
                  className={
                    "group w-full text-left mb-2 rounded-xl border px-3 py-2 transition shadow-sm overflow-x-auto whitespace-nowrap custom-scroll " +
                    (isActive
                      ? "border-indigo-300 bg-indigo-50/70 ring-2 ring-indigo-200"
                      : "border-slate-200 bg-white hover:bg-slate-50")
                  }
                >
                  <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                    {highlight(label, query)}
                  </p>
                  {sku && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {highlight(sku, query)}
                    </p>
                  )}
                </button>
              );
            })}

            {/* 下方 padding */}
            <div style={{ height: bottomPad }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
