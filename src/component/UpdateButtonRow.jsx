import { useMemo } from "react";

export default function UpdateButtonRow({selectedKeys,currentPayload,payloads,updateSelectedForCurrent,updateSelectedForAll}) {

    const selectedCount = useMemo(() => selectedKeys.size, [selectedKeys]);

    return (
        <div className="sticky top-[64px] z-30 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">
                    已勾選欄位：<span className="font-semibold">{selectedCount}</span>
                </span>
                <div className="ml-auto flex gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        onClick={updateSelectedForCurrent}
                        disabled={!selectedCount || !currentPayload}
                        title="只更新目前這筆"
                    >
                        更新這筆勾選項目
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                        onClick={updateSelectedForAll}
                        disabled={!selectedCount || !payloads?.length}
                        title="更新所有資料列"
                    >
                        更新全部勾選項目
                    </button>
                </div>
            </div>
        </div>
    )
}