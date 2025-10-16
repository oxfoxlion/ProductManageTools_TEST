// src/pages/UpdateTranslation.jsx
import { useState } from "react";
import { useCsv } from "../stores/useCsv";
import EmptyState from "../component/EmptyState";
import RequireColumn from "../component/RequireColumn";
import Translate from "../component/Translate";
import AsideList from "../component/asideList";
import Hero from "../component/Hero";
import UpdateButtonRow from "../component/updateButtonRow";
import ConfirmPreviewModal from "../component/ConfirmPreviewModal";
import { SECTION_ORDER, COLUMN_ORDER } from "../config/previewSections";
import { pick } from "../utils/pick";

export default function UpdateTranslation() {
  const {
    rows, currentRow, selectedIndex, setIndex,
    translationPayloads, currentTranslationPayload
  } = useCsv();

  // ✅ 勾選 keys（供「更新這筆／全部」）
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
  const [modalSections, setModalSections] = useState([]);
  const [modalDefaultTab, setModalDefaultTab] = useState("translations");

  /* ============ 三種開啟方式 ============ */

  // 1) Hero：全部送出 → 顯示完整 translationPayloads
  const handleOpenPreviewAll = () => {
    setModalSections([
      {
        id: "translations",
        label: `Translations (${translationPayloads?.length || 0})`,
        rows: Array.isArray(translationPayloads) ? translationPayloads : [],
        endpoint: "/api/translate_ja",
      },
    ]);
    setModalDefaultTab("translations");
    setShowPreview(true);
  };

  // 2) 更新這筆 → 只顯示「當前列 + 勾選欄位」
  const updateSelectedForCurrent = () => {
    if (!currentTranslationPayload) return;
    const keys = Array.from(selectedKeys);
    if (!keys.length) return;

    const body = [{ handle: currentTranslationPayload.handle, ...pick(currentTranslationPayload, keys) }];
    setModalSections([
      {
        id: "translations",
        label: "Translations (1)",
        rows: body,
        endpoint: "/api/translate_ja",
      },
    ]);
    setModalDefaultTab("translations");
    setShowPreview(true);
  };

  // 3) 更新全部 → 顯示「全部列 + 勾選欄位」
  const updateSelectedForAll = () => {
    const keys = Array.from(selectedKeys);
    if (!keys.length) return;

    const body = (translationPayloads || []).map((p) => ({ handle: p.handle, ...pick(p, keys) }));
    setModalSections([
      {
        id: "translations",
        label: `Translations (${body.length})`,
        rows: body,
        endpoint: "/api/translate_ja",
      },
    ]);
    setModalDefaultTab("translations");
    setShowPreview(true);
  };

  /* ============ Modal 確認送出：依當前 modalSections 送出 ============ */
  const handleConfirmSend = async (selectedIds /* string[] */) => {
    const chosen = modalSections.filter(
      (s) => selectedIds.includes(s.id) && Array.isArray(s.rows) && s.rows.length
    );
    if (!chosen.length) {
      alert("目前沒有可送出的翻譯資料。");
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
    //         alert(`【translations】部分失敗：${failed} 個 handle`);
    //       } else {
    //         alert("【translations】送出失敗");
    //       }
    //     } else {
    //       const handled = data.summaries?.length ?? s.rows.length;
    //       alert(`【translations】完成：${handled} 個 handle`);
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
      {/* 按「全部送出」→ 開啟 Modal 預覽（完整 payloads） */}
      <Hero pageTitle="更新翻譯" onSubmit={handleOpenPreviewAll} />

      {/* 工具列：維持舊介面，但行為改為開 Modal 預覽 */}
      {rows.length > 0 && (
        <UpdateButtonRow
          selectedKeys={selectedKeys}
          currentPayload={currentTranslationPayload}
          payloads={translationPayloads}
          updateSelectedForCurrent={updateSelectedForCurrent}
          updateSelectedForAll={updateSelectedForAll}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <AsideList rows={rows} selectedProductIndex={selectedIndex} setSelectedProductIndex={setIndex} />

            <main className="col-span-12 md:col-span-9">
              {currentRow ? (
                <div className="flex flex-col gap-3">
                  <RequireColumn rows={rows} selectedProductIndex={selectedIndex} currentRow={currentRow} canEdit={false} />
                  <Translate currentRow={currentRow} canEdit={true} isChecked={isChecked} toggleSelected={toggleSelected} />
                </div>
              ) : (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <p className="text-slate-500">尚未選擇資料或資料尚未載入</p>
                </div>
              )}
            </main>

            <section className="col-span-12 md:col-span-3">
              {currentRow ? <div className="flex flex-col gap-3" /> : (
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
