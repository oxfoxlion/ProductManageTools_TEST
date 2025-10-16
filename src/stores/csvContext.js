import { createContext } from "react";

/** 只建一次，給 Provider 與 Hook 共用 */
export const CsvContext = createContext(null);