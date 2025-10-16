// // 以 True/False 判斷是否要加上 更新 按鈕
// import CardContent from "./CardContent"

// export default function RequireColumn_withDescription({ rows, selectedProductIndex, currentRow, canEdit,isChecked,toggleSelected,updateSelectedForCurrent,updateSelectedForAll }) {

//     return (
//         <div className="rounded-2xl border bg-white p-6 shadow-sm">
//             <div className="space-y-5">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <p className="text-xs text-slate-500">目前檢視</p>
//                         <p className="text-lg font-semibold text-slate-800">第 {selectedProductIndex + 1} 筆</p>
//                     </div>
//                     <div className="text-right hidden md:block">
//                         <p className="text-xs text-slate-500">CSV 總筆數</p>
//                         <p className="text-lg font-semibold text-slate-800">{rows.length}</p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 gap-4">
//                     <CardContent row={currentRow} title="Handle" field="Handle" canEdit={false} />
//                     <CardContent
//                         row={currentRow}
//                         title="Title"
//                         field="Title"
//                         canEdit={canEdit}
//                         selectKeys={["title"]}
//                         isChecked={isChecked(["title"])}
//                         onToggle={toggleSelected}
//                         onUpdateSelectedCurrent={updateSelectedForCurrent}
//                         onUpdateSelectedAll={updateSelectedForAll}
//                     />

//                     {/* Description -> payload key 可能需要同時帶上 description + description_type */}
//                     <CardContent
//                         row={currentRow}
//                         title="Description"
//                         field="Description"
//                         canEdit={canEdit}
//                         selectKeys={["description", "description_type"]}
//                         isChecked={isChecked(["description", "description_type"])}
//                         onToggle={toggleSelected}
//                         onUpdateSelectedCurrent={updateSelectedForCurrent}
//                         onUpdateSelectedAll={updateSelectedForAll}
//                     />

//                 </div>
//             </div>
//         </div>


//     )
// }

// src/component/RequireColumn_withDescription.jsx
import CardContent from "./CardContent";

export default function RequireColumn_withDescription({
  rows,
  selectedProductIndex,
  currentRow,
  canEdit,
  isChecked,
  toggleSelected,
}) {
  return (
    <div className="rounded-2xl border border-gray-300  bg-white p-6 shadow-sm">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">目前檢視</p>
            <p className="text-lg font-semibold text-slate-800">第 {selectedProductIndex + 1} 筆</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-500">CSV 總筆數</p>
            <p className="text-lg font-semibold text-slate-800">{rows.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Handle 僅展示 */}
          <CardContent row={currentRow} title="Handle" field="Handle" canEdit={false} />

          {/* Title -> payload key: 'title' */}
          <CardContent
            row={currentRow}
            title="Title"
            field="Title"
            canEdit={canEdit}
            selectKeys={["title"]}
            isChecked={isChecked(["title"])}
            onToggle={toggleSelected}
          />

          {/* Description -> 需同時傳 description + description_type */}
          <CardContent
            row={currentRow}
            title="Description"
            field="Description"
            canEdit={canEdit}
            selectKeys={["description", "description_type"]}
            isChecked={isChecked(["description", "description_type"])}
            onToggle={toggleSelected}
          />
        </div>
      </div>
    </div>
  );
}
