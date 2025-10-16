// 以 True/False 判斷是否要加上 更新 按鈕

import CardContent from "./CardContent"

export default function Translate({ currentRow, canEdit, isChecked, toggleSelected }) {

    return (

        <div className="rounded-2xl border border-gray-300  bg-white p-6 shadow-sm">
            <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-700">翻譯</h3>
                <div className="grid grid-cols-1 gap-4">
                    <CardContent row={currentRow}
                        title="中文 Title"
                        field="中文 Title"
                        canEdit={canEdit}
                        selectKeys={["title"]}
                        isChecked={isChecked(["title"])}
                        onToggle={toggleSelected} />
                    <CardContent row={currentRow}
                        title="中文 Description"
                        field="中文 Description"
                        canEdit={canEdit}
                        selectKeys={["description","description_type"]}
                        isChecked={isChecked(["description"])}
                        onToggle={toggleSelected} />
                    <CardContent row={currentRow}
                        title="中文 SEO Description"
                        field="中文 SEO Description"
                        canEdit={canEdit}
                        selectKeys={["meta_description"]}
                        isChecked={isChecked(["meta_description"])}
                        onToggle={toggleSelected} />
                    <CardContent row={currentRow}
                        title="中文 Highlight"
                        field="中文 Highlight"
                        canEdit={canEdit}
                        selectKeys={["content.highlight","content.highlight_type"]}
                        isChecked={isChecked(["content.highlight"])}
                        onToggle={toggleSelected} />
                    <CardContent row={currentRow}
                        title="中文 Application"
                        field="中文 Application"
                        canEdit={canEdit}
                        selectKeys={["content.application","content.application_type"]}
                        isChecked={isChecked(["content.application"])}
                        onToggle={toggleSelected} />
                    <CardContent row={currentRow}
                        title="中文 Feature"
                        field="中文 Feature"
                        canEdit={canEdit}
                        selectKeys={["content.features","content.features_type"]}
                        isChecked={isChecked(["content.features"])}
                        onToggle={toggleSelected} />
                    <CardContent row={currentRow}
                        title="中文 Specification"
                        field="中文 Specification"
                        canEdit={canEdit}
                        selectKeys={["content.specification","content.specification_type"]}
                        isChecked={isChecked(["content.specification"])}
                        onToggle={toggleSelected} />
                    <CardContent row={currentRow}
                        title="中文 Specification_html"
                        field="中文 Specification_html"
                        canEdit={canEdit}
                        selectKeys={["content.specification_html"]}
                        isChecked={isChecked(["content.specification_html"])}
                        onToggle={toggleSelected} />
                    <CardContent row={currentRow}
                        title="發貨時間"
                        field="發貨時間"
                        canEdit={canEdit}
                        selectKeys={["theme.shipping_time"]}
                        isChecked={isChecked(["theme.shipping_time"])}
                        onToggle={toggleSelected} />
                </div>
            </div>
        </div>


    )
}