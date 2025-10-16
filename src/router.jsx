// src/router.jsx
import { createBrowserRouter } from "react-router-dom";

import Frontend from "./layout/Frontend";
import CreateProducts from "./pages/CreateProducts";
import CreateVariants from "./pages/CreateVariants";
import UpdateInventory from "./pages/UpdateInventory";
import UpdateMetafields from "./pages/UpdateMetafields";
import UpdateProducts from "./pages/UpdateProducts";
import UpdateRelativeProducts from "./pages/UpdateRelativeProducts";
import UpdateTranslation from "./pages/UpdateTranslation";
import UpdateVariants from "./pages/UpdateVariants";
import DeleteTranslate from "./pages/deleteTranslate";
import NotFound from "./pages/NotFound";

export const route = createBrowserRouter(
  [
    {
      path: "/",
      element: <Frontend />,
      children: [
        { index: true, element: <CreateProducts /> },
        { path: "create_variants", element: <CreateVariants /> },
        { path: "update_inventory", element: <UpdateInventory /> },
        { path: "update_metafields", element: <UpdateMetafields /> },
        { path: "update_products", element: <UpdateProducts /> },
        { path: "update_relative_products", element: <UpdateRelativeProducts /> },
        { path: "update_translation", element: <UpdateTranslation /> },
        { path: "update_variants", element: <UpdateVariants /> },
        { path: "delete_translate", element: <DeleteTranslate /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    // 這行是關鍵：讓 / 代表 /ProductManageTools_TEST/（在 prod）
    basename: import.meta.env.BASE_URL,
  }
);
