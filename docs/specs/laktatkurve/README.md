# Laktatkurve — спецификации (PDF)

Референтни PDF-и, по които се разработва Page11 ("Laktatkurve"/Ergometrie екрана).
Държим ги тук в repo-то, за да са под ръка на всеки, който пипа този код (включително друг editor/AI по същата база), вместо да зависят от чат история.

| Файл | Покрива | Статус в кода |
|---|---|---|
| `3.32_Laktat_Datenerfassung_und_Auswertung.pdf` | Datenerfassung Eingabelogik: формат на HF/Laktat полета, редактируем само последен ред, auto-delete на непълен последен ред, plausibility проверка | ✅ Implemented (`DatenerfassungComponentList.tsx`, `Page11.tsx` save()) |
| `3.32_Laktatkurve_Rechenverfahren_Beispiele.pdf` | Формули на моделите (Dickhuth, Freiburger, Linear, LTP, Keul, Keul Legacy) — вкл. Keul tangent slope 1.26 (run) vs 0.055 (bike) | ✅ Implemented (`ErgometryModelsUtil.js`) |
| `3.34_Laktatkurve_und_Trainingsbereich.pdf` | Trainingsbereich таблица (REG/IAS/GA1/GA2/IANS/E1/E2), каскадно изчисление HF%→Watt/km-h/pace, динамични оси, spline HF крива, threshold маркери/tooltip, 2/4mmol линии, drag на праговете | 🚧 In progress |
| `3.36_Laktatkurve_ueberlagern.pdf` | Overlay на няколко архивирани теста — absolute vs normierte (% IANS) изглед, цвят по година, hover fade, outlier ("firefly") маркиране | ⏳ Not started |

Последна актуализация: 2026-08-14.
