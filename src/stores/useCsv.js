import { useContext } from "react";
import { CsvContext } from "./csvContext";

export function useCsv() {
  const ctx = useContext(CsvContext);
  if (!ctx) throw new Error("useCsv must be used inside <CsvProvider>");
  return ctx;
}
