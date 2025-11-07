// Metafields.jsx（節選）
import CardContent from "./CardContent";
import CustomFieldMapper from "./CustomFieldMapper";

export default function Metafields_Table({ currentRow, canEdit, customMap = {}, headers, setCustomMap, isChecked, toggleSelected }) {
    // 自訂欄位組數
    const slots = Array.from({ length: 60 }, (_, i) => `custom_${i + 1}`);

    const readMappedValue = (slot) => {
        const header = customMap?.[slot];
        if (!header) return "";
        return currentRow?.[header] ?? "";
    };

    return (
        <div className="rounded-2xl border border-gray-300  bg-white p-6 shadow-sm">
            <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-700">規格 <span className="text-red-600">(請依產品類別選取對應的規格模組或自訂模板)</span></h3>
                <div className="grid grid-cols-1 gap-4">
                    <CustomFieldMapper customMap={customMap} headers={headers} setCustomMap={setCustomMap}></CustomFieldMapper>
                </div>

                {/* ✅ Custom（CSV 對應）— 改用 CardContent 的 explicitValue */}
                <h4 className="text-xs font-semibold text-slate-700">Custom（CSV 對應）</h4>
                <div className="grid grid-cols-1 gap-4">
                    {slots.map((slot) => {
                        const header = customMap?.[slot] || "";
                        const value = readMappedValue(slot);
                        const title = header ? `${slot}（CSV：${header}）` : `${slot}（未設定）`;

                        // ⭐ 對應的 payload key：table.custom_1 ~ table.custom_10
                        const payloadKey = `table.${slot}`;

                        return (
                            <CardContent
                                key={slot}
                                row={currentRow}              // 可留著以維持一致 API
                                title={title}
                                explicitValue={value}         // 直接顯示 CSV 對應值
                                canEdit={canEdit}
                                // 這三個讓它像 Theme 區塊一樣「可勾選對應的 payload key」
                                selectKeys={[payloadKey]}
                                isChecked={isChecked([payloadKey])}
                                onToggle={toggleSelected}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
