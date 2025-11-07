// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { route } from "./router";
import { CsvProvider } from "./stores/CsvProvider";
import { AuthProvider } from "./auth/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CsvProvider>
        <RouterProvider router={route} />
      </CsvProvider>
    </AuthProvider>
  </React.StrictMode>
);
