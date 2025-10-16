// 以 True/False 判斷是否要加上 更新 按鈕
import CardContent from "./CardContent"

export default function ProductSetting({ currentRow, canEdit, isChecked, toggleSelected }) {
    return (

        <div className="rounded-2xl border border-gray-300  bg-white p-6 shadow-sm">
            <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-700">產品設定</h3>
                <div className="grid grid-cols-1 gap-4">
                    <CardContent
                        row={currentRow}
                        title="Status"
                        field="Status"
                        canEdit={canEdit}
                        selectKeys={["Status"]}
                        isChecked={isChecked(["Status"])}
                        onToggle={toggleSelected}
                    />
                    <CardContent
                        row={currentRow}
                        title="Vendor"
                        field="Vendor"
                        canEdit={canEdit}
                        selectKeys={["Vendor"]}
                        isChecked={isChecked(["Vendor"])}
                        onToggle={toggleSelected}
                    />
                    <CardContent
                        row={currentRow}
                        title="Type"
                        field="Type"
                        canEdit={canEdit}
                        selectKeys={["Type"]}
                        isChecked={isChecked(["Type"])}
                        onToggle={toggleSelected}
                    />
                    <CardContent
                        row={currentRow}
                        title="Collections"
                        field="Collections"
                        canEdit={canEdit}
                        selectKeys={["collections"]}
                        isChecked={isChecked(["collections"])}
                        onToggle={toggleSelected}
                    />
                    <CardContent
                        row={currentRow}
                        title="Template"
                        field="Template"
                        canEdit={canEdit}
                        selectKeys={["Template"]}
                        isChecked={isChecked(["Template"])}
                        onToggle={toggleSelected}
                    />
                </div>
            </div>
        </div>


    )
}