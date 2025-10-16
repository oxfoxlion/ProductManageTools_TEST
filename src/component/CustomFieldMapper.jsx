export default function CustomFieldMapper({ headers, customMap, setCustomMap }) {
  const slots = Array.from({ length: 40 }, (_, i) => `custom_${i + 1}`);

  return (
    <div className="rounded-2xl border border-gray-300 bg-gray-200 p-6 shadow-sm mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Custom 欄位對應</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCustomMap({})}
            className="text-xs rounded-lg border px-2 py-1 text-slate-600 hover:bg-slate-50"
          >
            清空對應
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {slots.map((slot) => (
          <label key={slot} className="text-xs">
            <span className="block mb-1 text-slate-600 font-medium">{slot}</span>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
              value={customMap[slot] ?? ""}
              onChange={(e) => setCustomMap((m) => ({ ...m, [slot]: e.target.value }))}
            >
              <option value="">（未選擇）</option>
              {headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <p className="mt-2 text-[11px] text-slate-500">
        將 custom_1 ~ custom_10 對應到 CSV 欄位。
      </p>
    </div>
  );
}