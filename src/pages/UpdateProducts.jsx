// src/pages/UpdateProducts.jsx
import { useState } from "react";
import { useCsv } from "../stores/useCsv";
import EmptyState from "../component/EmptyState";
import RequireColumn_withDescription from "../component/RequireColumn_withDescription";
import SeoSetting from "../component/SeoSetting";
import ProductSetting from "../component/ProductSetting";
import AsideList from "../component/asideList";
import Hero from "../component/Hero";
import UpdateButtonRow from "../component/updateButtonRow";
import ConfirmPreviewModal from "../component/ConfirmPreviewModal";
import { SECTION_ORDER, COLUMN_ORDER } from "../config/previewSections";
import { pick } from "../utils/pick";

export default function UpdateProducts() {
  const {
    rows,
    selectedIndex,
    setIndex,
    currentRow,
    productPayloads,
    currentProductPayload,
  } = useCsv();

  // 勾選 keys
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

  /* ============ Modal 狀態（共用） ============ */
  const [showPreview, setShowPreview] = useState(false);
  const [modalSections, setModalSections] = useState(() => []);
  const [modalDefaultTab, setModalDefaultTab] = useState("products");

  /* ============ 三種開啟方式 ============ */

  // 1) Hero 的全部送出 → 直接把完整 productPayloads 放進 Modal
  const handleSubmitAll = () => {
    setModalSections([
      {
        id: "products",
        label: `Products (${productPayloads?.length || 0})`,
        rows: Array.isArray(productPayloads) ? productPayloads : [],
        endpoint: "/api/productUpdater",
      },
    ]);
    setModalDefaultTab("products");
    setShowPreview(true);
  };

  // 2) 更新這筆（原本直接打 API）→ 改成只顯示「當前列 + 勾選欄位」於 Modal
  const updateSelectedForCurrent = () => {
    if (!currentProductPayload) return;
    const keys = Array.from(selectedKeys);
    if (!keys.length) return;

    const body = [{ handle: currentProductPayload.handle, ...pick(currentProductPayload, keys) }];
    setModalSections([
      {
        id: "products",
        label: `Products (1)`,
        rows: body,
        endpoint: "/api/productUpdater",
      },
    ]);
    setModalDefaultTab("products");
    setShowPreview(true);
  };

  // 3) 更新全部（原本直接打 API）→ 改成只顯示「全部列 + 勾選欄位」於 Modal
  const updateSelectedForAll = () => {
    const keys = Array.from(selectedKeys);
    if (!keys.length) return;

    const body = (productPayloads || []).map((p) => ({ handle: p.handle, ...pick(p, keys) }));
    setModalSections([
      {
        id: "products",
        label: `Products (${body.length})`,
        rows: body,
        endpoint: "/api/productUpdater",
      },
    ]);
    setModalDefaultTab("products");
    setShowPreview(true);
  };

  // ▶ Modal 的「確認送出」：把目前 modalSections 的資料送到對應 endpoint
  const handleConfirmSend = async (selectedIds /* string[] */) => {
    const chosen = modalSections.filter(
      (s) => selectedIds.includes(s.id) && Array.isArray(s.rows) && s.rows.length
    );
    if (!chosen.length) {
      alert("目前沒有可送出的產品資料。");
      setShowPreview(false);
      return;
    }

    // for (const s of chosen) {
    //   try {
    //     const resp = await fetch(s.endpoint, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ rows: s.rows }),
    //     });
    //     const data = await resp.json().catch(() => ({}));
    //     const ok = !!(resp.ok && (data.ok ?? true));
    //     if (!ok) {
    //       const failed = data.summaries?.filter((x) => !x.ok).length;
    //       if (typeof failed === "number") {
    //         alert(`【products】部分失敗：${failed} 個 handle`);
    //       } else {
    //         alert("【products】送出失敗");
    //       }
    //     } else {
    //       const handled = data.summaries?.length ?? s.rows.length;
    //       alert(`【products】完成：${handled} 個 handle`);
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     alert("送出失敗，請稍後再試或查看主控台錯誤訊息。");
    //   }
    // }
    alert('資料送出功能尚未開放');
    setShowPreview(false);
  };

  return (
    <>
      {/* 1) 按「全部送出」→ 開啟 Modal */}
      <Hero pageTitle="更新產品基本資訊" onSubmit={handleSubmitAll} />

      {/* 2/3) 工具列：維持原本介面；內部呼叫的兩個方法已改成開 Modal */}
      {rows.length > 0 && (
        <UpdateButtonRow
          selectedKeys={selectedKeys}
          currentPayload={currentProductPayload}
          payloads={productPayloads}
          updateSelectedForAll={updateSelectedForAll}
          updateSelectedForCurrent={updateSelectedForCurrent}
        />
      )}

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
              {productPayloads ? (
                <div className="flex flex-col gap-3">
                  <RequireColumn_withDescription
                    rows={rows}
                    selectedProductIndex={selectedIndex}
                    currentRow={currentRow}
                    canEdit={true}
                    isChecked={isChecked}
                    toggleSelected={toggleSelected}
                  />
                  <SeoSetting
                    currentRow={currentRow}
                    canEdit={true}
                    isChecked={isChecked}
                    toggleSelected={toggleSelected}
                  />
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
                  <ProductSetting
                    currentRow={currentRow}
                    canEdit={true}
                    isChecked={isChecked}
                    toggleSelected={toggleSelected}
                  />
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

      {/* Modal：顯示由三種入口組成的 rows（完整 / 這筆勾選 / 全部勾選） */}
      <ConfirmPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmSend}
        sections={modalSections}
        defaultTabId={modalDefaultTab}
        onlyNonEmptyTabs={true}
        sectionOrder={SECTION_ORDER}
        columnOrderMap={COLUMN_ORDER}
      />
    </>
  );
}
