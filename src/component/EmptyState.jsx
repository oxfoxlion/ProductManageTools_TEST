// component/EmptyState.jsx
import CsvUploadButton from "./CsvUploadButton";

export default function EmptyState() {
  return (
    <div className="rounded-2xl border bg-white p-10 shadow-sm text-center">
      <div className="mx-auto grid place-items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          📄
        </div>
        <h3 className="text-lg font-semibold text-slate-800">尚未載入資料</h3>
        <p className="max-w-md text-sm text-slate-500">
          請先上傳一份 <span className="font-medium text-slate-700">由 Notion 導出</span> 的 CSV 檔，
          之後可在左側清單選取各項目進行檢視。
        </p>

        <CsvUploadButton >
          選擇檔案
        </CsvUploadButton>
      </div>
    </div>
  );
}
