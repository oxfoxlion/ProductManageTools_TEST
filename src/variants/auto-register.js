// src/variants/auto-register.js
// 讓每個 calc 模組自行呼叫 registerCalculator(...)
import.meta.glob("./*.calc.js", { eager: true });
// 檔案本身只要 import 後會執行 register，即完成註冊
