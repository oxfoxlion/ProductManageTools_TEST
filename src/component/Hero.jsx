// component/Hero.jsx
import CsvUploadButton from "./CsvUploadButton";
import { useCsv } from "../stores/useCsv";

export default function Hero({ pageTitle, onSubmit }) {
  const { fileName, rows, selectedIndex } = useCsv();

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{pageTitle}</h1>
            <p className="mt-1 text-indigo-100">匯入 CSV，瀏覽並檢視每筆商品。<span className="font-bold text-yellow-200">(請篩選出要上架/修改的產品後再上傳)</span><br /></p>
          </div>

          <div className="flex items-center gap-3">
            <CsvUploadButton />
            <button
              onClick={onSubmit}
              disabled={rows.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
            >
              送出全部
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          {fileName ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
              {fileName}
            </span>
          ) : (
            <span className="text-indigo-100/80">尚未選擇檔案</span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
            共 <span className="font-semibold">{rows.length}</span> 筆項目
          </span>
          {rows.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
              目前：第 <span className="font-semibold">{selectedIndex + 1}</span> 筆
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
