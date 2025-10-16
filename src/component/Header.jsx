import { NavLink } from "react-router-dom";

const navItems = [
    { label: "建立產品", to: "/" },
    { label: "更新基本資訊", to: "/update_products" },
    { label: "更新自訂欄位", to: "/update_metafields" },
    { label: "新增變體", to: "/create_variants" },
    { label: "更新變體", to: "/update_variants" },
    { label: "更新翻譯", to: "/update_translation" },
    { label: "更新關聯產品", to: "/update_relative_products" },
    { label: "更新庫存", to: "/update_inventory" },
    { label: "刪除日文翻譯", to: "/delete_translate" },
];

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <nav className="flex items-center gap-2 overflow-x-auto py-3 custom-scroll">
                    {navItems.map(({ label, to }) => (
                        <NavLink
                            key={label}
                            to={to}
                            className={({ isActive }) =>
                                "whitespace-nowrap rounded-xl px-3 py-2 text-sm transition border " +
                                (isActive
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}