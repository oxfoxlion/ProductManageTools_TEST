import {createBrowserRouter } from "react-router-dom";

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

export const route = createBrowserRouter ([
    {
        path:'/',
        element:<Frontend></Frontend>,
        children:[
            {
                index:true,
                element:<CreateProducts></CreateProducts>
            },{
                path:'create_variants',
                element:<CreateVariants></CreateVariants>
            },{
                path:'update_inventory',
                element:<UpdateInventory></UpdateInventory>
            },
            {
                path:'update_metafields',
                element:<UpdateMetafields></UpdateMetafields>
            },
            {
                path:'update_products',
                element:<UpdateProducts></UpdateProducts>
            },{
                path:'update_relative_products',
                element:<UpdateRelativeProducts></UpdateRelativeProducts>
            },{
                path:'update_translation',
                element:<UpdateTranslation></UpdateTranslation>
            },{
                path:'update_variants',
                element:<UpdateVariants></UpdateVariants>
            },{
                path:'delete_translate',
                element:<DeleteTranslate></DeleteTranslate>
            },{
                path:'*',
                element:<NotFound></NotFound>
            }

        ]
    }
])