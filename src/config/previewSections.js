// 全域的分頁順序（所有頁面都依這份排序）
export const SECTION_ORDER = ["products", "metafields", "translations", "variants"];

// 各分頁的欄位顯示順序（可選；沒列到的會接在後面）
export const COLUMN_ORDER = {
  products:     ["handle", "title", "description_type", "description", "Vendor", "Type", "Tags","SEO Title", "SEO Description", "Included / Taiwan", "Status", "collections", "Template"],
  metafields:   ["handle", "namespace", "key", "type", "value"],
  translations: ["handle", "title", "description_type", "description", "meta_description","content.highlight_type", "content.highlight", "content.application_type", "content.application", "content.specification_type","content.specification", "content.specification_html","content.features_type","content.features", "theme.shipping_time"],
  variants:     ["handle", "Variant SKU", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value", "Option3 Name", "Option3 Value","handle", "Variant SKU", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value", "Option3 Name", "Option3 Value","Variant Price"],
};
