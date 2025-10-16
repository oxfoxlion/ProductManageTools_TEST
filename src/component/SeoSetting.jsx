// 以 True/False 判斷是否要加上 更新 按鈕

import CardContent from "./CardContent"

export default function SeoSetting({ currentRow, canEdit,isChecked,toggleSelected }) {

    return (

        <div className="rounded-2xl border border-gray-300  bg-white p-6 shadow-sm">
            <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-700">SEO 設定</h3>
                <div className="grid grid-cols-1 gap-4">
                    <CardContent
                        row={currentRow}
                        title="SEO Title"
                        field="SEO Title"
                        canEdit={canEdit}
                        selectKeys={["SEO Title"]}
                        isChecked={isChecked(["SEO Title"])}
                        onToggle={toggleSelected}
                    />
                    <CardContent
                        row={currentRow}
                        title="SEO Tags"
                        field="SEO Tags"
                        canEdit={canEdit}
                        selectKeys={["Tags"]}
                        isChecked={isChecked(["Tags"])}
                        onToggle={toggleSelected}
                    />

                </div>
            </div>
        </div>


    )
}