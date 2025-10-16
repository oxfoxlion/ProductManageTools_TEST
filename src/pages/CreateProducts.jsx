import { useState, useMemo } from "react";
import { useCsv } from "../stores/useCsv";
import EmptyState from "../component/EmptyState";
import RequireColumn from "../component/RequireColumn_withDescription";
import Variants from "../component/Variants";
import SeoSetting from "../component/SeoSetting";
import Metafields_Content from "../component/Metafields_Content";
import Metafields_Filter from "../component/Metafields_Filter";
import Metafields_Table from "../component/Metafields_Table";
import Metafields_Theme from "../component/Metafields_Theme";
import ProductSetting from "../component/ProductSetting";
import Translate from "../component/Translate";
import AsideList from "../component/asideList";
import Hero from "../component/Hero";
import ConfirmPreviewModal from "../component/ConfirmPreviewModal";
import { SECTION_ORDER, COLUMN_ORDER } from "../config/previewSections";

export default function CreateProducts() {
  const {
    rows, headers, currentRow, selectedIndex, setIndex,
    customMap, setCustomMap,
    productPayloads, metafieldPayloads, translationPayloads,
    variantMode, variantCatalog, variantsActive,
  } = useCsv();

  const variantLabel = useMemo(
    () => variantCatalog.find(c => c.id === variantMode)?.label ?? variantMode,
    [variantCatalog, variantMode]
  );

  const rowsCount = variantsActive?.length ?? 0;

  const [showPreview, setShowPreview] = useState(false);
  const handleOpenPreview = () => setShowPreview(true);

  // 四分頁都宣告，Modal 會依 onlyNonEmptyTabs 過濾、依 SECTION_ORDER 排序
  const sections = useMemo(() => ([
    {
      id: "products",
      label: `Products (${productPayloads?.length || 0})`,
      rows: productPayloads || [],
      endpoint: "/api/productBuilder",
    },
    {
      id: "metafields",
      label: `Metafields (${metafieldPayloads?.length || 0})`,
      rows: metafieldPayloads || [],
      endpoint: "/api/metafieldsWriter",
    },
    {
      id: "translations",
      label: `Translations (${translationPayloads?.length || 0})`,
      rows: translationPayloads || [],
      endpoint: "/api/translate",
    },
    {
      id: "variants",
      label: `Variants (${variantsActive?.length || 0})`,
      rows: Array.isArray(variantsActive) ? variantsActive : [],
      endpoint: "/api/productVariantsBuilder",
    },
  ]), [productPayloads, metafieldPayloads, translationPayloads, variantsActive]);

  const sourceLabel = useMemo(() => variantLabel || variantMode, [variantLabel, variantMode]);

  // 一次送出所有（可見）分頁
  const handleConfirmSend = async (selectedIds /* string[] */) => {
    const chosen = sections.filter(s => selectedIds.includes(s.id) && Array.isArray(s.rows) && s.rows.length);
    if (!chosen.length) {
      alert("目前沒有可送出的資料。");
      setShowPreview(false);
      return;
    }

    // const results = [];
    // for (const s of chosen) {
    //   try {
    //     const resp = await fetch(s.endpoint, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ rows: s.rows }),
    //     });
    //     const data = await resp.json().catch(() => ({}));
    //     const ok = !!(resp.ok && (data.ok ?? true));
    //     results.push({ id: s.id, ok, detail: data });

    //     if (!ok) {
    //       const failed = data.summaries?.filter((x) => !x.ok).length;
    //       if (typeof failed === "number") {
    //         alert(`【${s.id}】部分失敗：${failed} 項`);
    //       } else {
    //         alert(`【${s.id}】送出失敗`);
    //       }
    //     } else {
    //       const handled = data.summaries?.length ?? s.rows.length;
    //       alert(`【${s.id}】完成：${handled} 項`);
    //     }
    //   } catch (e) {
    //     console.error(`[${s.id}] error:`, e);
    //     results.push({ id: s.id, ok: false, detail: { message: e.message } });
    //     alert(`【${s.id}】送出失敗：${e.message}`);
    //   }
    // }
    alert('資料送出功能尚未開放');
    setShowPreview(false);
    // console.log("送出結果：", results);
  };

  // 勾選欄位（保留原樣）
  const [selectedKeys, setSelectedKeys] = useState(() => new Set());
  const toggleSelected = (keys = [], checked) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      for (const k of keys) {
        if (!k) continue;
        if (checked) next.add(k);
        else next.delete(k);
      }
      return next;
    });
  };
  const isChecked = (keys = []) => keys.every((k) => selectedKeys.has(k));

  return (
    <>
      <Hero pageTitle="建立產品" onSubmit={handleOpenPreview} />

      <div className="container mx-auto px-4 py-8">
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <AsideList
              rows={rows}
              selectedProductIndex={selectedIndex}
              setSelectedProductIndex={setIndex}
            />

            <main className="col-span-12 md:col-span-6">
              {currentRow ? (
                <div className="flex flex-col gap-3">
                  <div className="mb-4 rounded-2xl border bg-white p-4 shadow-sm text-sm text-slate-600">
                    將送出：<b>{rowsCount}</b> 筆（來源：{variantLabel} / {variantMode}）
                  </div>

                  <RequireColumn
                    rows={rows}
                    selectedProductIndex={selectedIndex}
                    currentRow={currentRow}
                    canEdit={false}
                    isChecked={isChecked}
                    toggleSelected={toggleSelected}
                  />

                  {/* 內含動態下拉，會更新 variantMode */}
                  <Variants />

                  <SeoSetting currentRow={currentRow} canEdit={false} isChecked={isChecked} toggleSelected={toggleSelected} />
                  <Translate currentRow={currentRow} canEdit={false} isChecked={isChecked} toggleSelected={toggleSelected} />
                  <Metafields_Table currentRow={currentRow} canEdit={false} customMap={customMap} headers={headers} setCustomMap={setCustomMap} isChecked={isChecked} toggleSelected={toggleSelected} />
                </div>
              ) : (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <p className="text-slate-500">尚未選擇資料或資料尚未載入</p>
                </div>
              )}
            </main>

            <section className="col-span-12 md:col-span-3">
              {currentRow ? (
                <div className="flex flex-col gap-3">
                  <ProductSetting currentRow={currentRow} canEdit={false} isChecked={isChecked} toggleSelected={toggleSelected} />
                  <Metafields_Content currentRow={currentRow} canEdit={false} isChecked={isChecked} toggleSelected={toggleSelected} />
                  <Metafields_Theme currentRow={currentRow} canEdit={false} isChecked={isChecked} toggleSelected={toggleSelected} />
                  <Metafields_Filter currentRow={currentRow} canEdit={false} isChecked={isChecked} toggleSelected={toggleSelected} />
                </div>
              ) : (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <p className="text-slate-500">尚未選擇資料或資料尚未載入</p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* 預覽／確認送出 Modal：會依 SECTION_ORDER 排序、依 COLUMN_ORDER 排欄位 */}
      <ConfirmPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmSend}
        sections={sections}
        sourceLabel={sourceLabel}
        defaultTabId={sections.find(s => s.id === "variants" && s.rows.length)?.id || sections.find(s => s.rows.length)?.id}
        onlyNonEmptyTabs={true}
        sectionOrder={SECTION_ORDER}
        columnOrderMap={COLUMN_ORDER}
      />
    </>
  );
}
