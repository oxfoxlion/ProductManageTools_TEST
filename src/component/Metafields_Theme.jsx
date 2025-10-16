// Metafields.jsx（節選）
import CardContent from "./CardContent";

export default function Metafields_Theme({ currentRow, canEdit, isChecked, toggleSelected }) {

    return (
        <div className="rounded-2xl border border-gray-300  bg-white p-6 shadow-sm">
            <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-700">樣式</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <CardContent
                    row={currentRow}
                    title="Label 1"
                    field="Label 1"
                    canEdit={canEdit}
                    selectKeys={["theme.label_1"]}
                    isChecked={isChecked(["theme.label_1"])}
                    onToggle={toggleSelected} />
                <CardContent
                    row={currentRow}
                    title="Label 2"
                    field="Label 2"
                    canEdit={canEdit}
                    selectKeys={["theme.label_2"]}
                    isChecked={isChecked(["theme.label_2"])}
                    onToggle={toggleSelected} />
                <CardContent
                    row={currentRow}
                    title="Label 3"
                    field="Label 3"
                    canEdit={canEdit}
                    selectKeys={["theme.label_3"]}
                    isChecked={isChecked(["theme.label_3"])}
                    onToggle={toggleSelected} />
                <CardContent
                    row={currentRow}
                    title="是否開啟詢價"
                    field="是否開啟詢價"
                    canEdit={canEdit}
                    selectKeys={["theme.inquiry"]}
                    isChecked={isChecked(["theme.inquiry"])}
                    onToggle={toggleSelected} />
                <CardContent
                    row={currentRow}
                    title="Shipping Time"
                    field="Shipping Time"
                    canEdit={canEdit}
                    selectKeys={["theme.shipping_time"]}
                    isChecked={isChecked(["theme.shipping_time"])}
                    onToggle={toggleSelected} />
                <CardContent
                    row={currentRow}
                    title="Compatibility"
                    field="Compatibility"
                    canEdit={canEdit}
                    selectKeys={["custom.compatibility"]}
                    isChecked={isChecked(["custom.compatibility"])}
                    onToggle={toggleSelected} />
            </div>
        </div>
    );
}
