// Metafields.jsx（節選）
import CardContent from "./CardContent";

export default function Metafields_Content({ currentRow, canEdit,isChecked,toggleSelected}) {

    return (
        <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
            <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-700">產品介紹</h3>
                <div className="grid grid-cols-1 gap-4">
                    <CardContent 
                    row={currentRow} 
                    title="Highlight" 
                    field="Highlight"
                    canEdit={canEdit} 
                    selectKeys={["content.highlight","content.highlight_type"]}
                        isChecked={isChecked(["content.highlight"])}
                        onToggle={toggleSelected} />
                    <CardContent 
                    row={currentRow} 
                    title="Application" 
                    field="Application" 
                    canEdit={canEdit}
                    selectKeys={["content.application","content.application_type"]}
                        isChecked={isChecked(["content.application"])}
                        onToggle={toggleSelected}  />
                    <CardContent 
                    row={currentRow} 
                    title="Feature" 
                    field="Feature" 
                    canEdit={canEdit}
                    selectKeys={["content.features","content.features_type"]}
                        isChecked={isChecked(["content.features"])}
                        onToggle={toggleSelected}  />
                    <CardContent 
                    row={currentRow} 
                    title="Specification" 
                    field="Specification" 
                    canEdit={canEdit}
                    selectKeys={["content.specification","content.specification_type"]}
                        isChecked={isChecked(["content.specification"])}
                        onToggle={toggleSelected}  />
                    <CardContent 
                    row={currentRow} 
                    title="Specification_html" 
                    field="Specification_html" 
                    canEdit={canEdit}
                    selectKeys={["content.specification_html"]}
                        isChecked={isChecked(["content.specification_html"])}
                        onToggle={toggleSelected}  />
                </div>
            </div>
        </div>
    );
}
