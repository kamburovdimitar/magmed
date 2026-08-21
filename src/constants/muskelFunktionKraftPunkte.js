// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-19 (Europe/Sofia) — MUFU KRAFT (Muskel-Funktion, "3.05 Neuer Test -
//   MUFU" мокъп): DK поиска KRAFT таблицата (10 мускула x R/L x 1-5 оценка)
//   да е свързана с точки върху снимката на тялото (assets/humanBody.jpg,
//   вече съществуваща в архива — точно тя, с жълтите точки, отговаря на
//   мокъпа) — клик на точка selectва реда в таблицата (потвърдено с DK).
//
//   Координатите по-долу НЕ са произволни — извлечени са програмно от
//   реалния assets/humanBody.jpg (514x699px) чрез детекция на жълтите
//   кръгчета, вече нарисувани в самата картинка (виж анализа в сесията).
//   xPercent/yPercent са спрямо ЦЯЛОТО изображение (фронт+гръб в един
//   файл), затова диаграмата се рендерва като едно цяло Image с
//   position:'absolute' точки върху него — НЕ разделяме на 2 отделни
//   изображения.
//
//   R/L конвенция (потвърдена визуално от подписите "R L L R" в самата
//   картинка): фронт изглед (лява половина на картинката) — R е по-малкия
//   x, L по-големия. Гръб изглед (дясна половина) — обратно (човекът се е
//   обърнал): L е по-малкия x (по-близо до центъра), R по-големия
//   (най-вдясно).
//
//   BWS-Strecker и LWS-Strecker нямат отделни R/L точки в оригиналната
//   картинка (само по 1 централна точка на гръбнака за всяка) — за да
//   имат все пак различима R/L точка (таблицата изисква и двете), сложени
//   са 2 близки точки (±10px) около централната позиция, вместо да делят
//   една и съща точка (иначе клик върху нея би бил двусмислен кой ред
//   selectва).
// ============================================

export const MUSCLE_LIST = [
    { key: 'oberarmbeuger', labelKey: 'oberarmbeuger_text' },
    { key: 'oberarmstrecker', labelKey: 'oberarmstrecker_text' },
    { key: 'schulterblattfixatoren', labelKey: 'schulterblattfixatoren_text' },
    { key: 'schulterabduktion', labelKey: 'schulterabduktion_text' },
    { key: 'bwsstrecker', labelKey: 'bwsstrecker_text' },
    { key: 'lwsstrecker', labelKey: 'lwsstrecker_text' },
    { key: 'gesaessmuskulatur', labelKey: 'gesaessmuskulatur_text' },
    { key: 'beinabduktor', labelKey: 'beinabduktor_text' },
    { key: 'mquadriceps', labelKey: 'mquadriceps_text' },
    { key: 'mischiocruralis', labelKey: 'mischiocruralis_text' },
    // 🔹 2026-08-20 — DK: коремните мускули липсваха от таблицата и на
    // 3-те качества (KRAFT/DEHNBARKEIT/BEWEGLICHKEIT). Понеже и трите
    // качества реизползват СЪЩИЯ MUSCLE_LIST/MUSCLE_POINTS (виж
    // MuskelFunktionComponent.tsx), добавянето тук е достатъчно за
    // и трите таба наведнъж.
    //
    // 🔹 2026-08-20 (2) — DK: "мисля, че за коремния мускул точката трябва
    // да е една" (не R/L двойка като другите). `sides: ['c']` казва на
    // MuskelFunktionKraftComponent.tsx да рендерне само 1 ред в таблицата
    // и 1 точка на снимката за тоя мускул (виж коментара при MUSCLE_POINTS
    // по-долу и логиката в компонента, която сега чете `muscle.sides` вместо
    // да предполага винаги ['r','l']).
    { key: 'bauchmuskulatur', labelKey: 'bauchmuskulatur_text', sides: ['c'] }
];

// 🔹 xPercent/yPercent — позиция на точката спрямо цялото humanBody.jpg
// изображение (0-100), за position:'absolute', left:`${xPercent}%`,
// top:`${yPercent}%` overlay точно върху вече нарисуваните жълти кръгчета.
export const MUSCLE_POINTS = {

    oberarmbeuger: {
        r: { xPercent: 13.2, yPercent: 31.3 },
        l: { xPercent: 42.8, yPercent: 30.8 }
    },

    oberarmstrecker: {
        r: { xPercent: 89.5, yPercent: 29.3 },
        l: { xPercent: 58.6, yPercent: 29.3 }
    },

    schulterblattfixatoren: {
        r: { xPercent: 81.9, yPercent: 23.6 },
        l: { xPercent: 58.8, yPercent: 22.0 }
    },

    schulterabduktion: {
        r: { xPercent: 88.7, yPercent: 21.6 },
        l: { xPercent: 66.0, yPercent: 23.7 }
    },

    bwsstrecker: {
        r: { xPercent: 75.9, yPercent: 24.0 },
        l: { xPercent: 72.0, yPercent: 24.0 }
    },

    lwsstrecker: {
        r: { xPercent: 75.7, yPercent: 38.1 },
        l: { xPercent: 71.8, yPercent: 38.1 }
    },

    gesaessmuskulatur: {
        r: { xPercent: 79.0, yPercent: 46.6 },
        l: { xPercent: 69.1, yPercent: 46.5 }
    },

    beinabduktor: {
        r: { xPercent: 17.1, yPercent: 44.6 },
        l: { xPercent: 39.1, yPercent: 44.6 }
    },

    mquadriceps: {
        r: { xPercent: 20.0, yPercent: 56.8 },
        l: { xPercent: 35.2, yPercent: 57.1 }
    },

    mischiocruralis: {
        r: { xPercent: 80.0, yPercent: 60.5 },
        l: { xPercent: 67.5, yPercent: 60.1 }
    },

    // 🔹 2026-08-20 — коремни мускули (Bauchmuskulatur). В самата картинка
    // има само 1 жълта точка за корема (фронт изглед, централно на торса,
    // x≈28.0/y≈37.6 — засечена програмно, точно същия размер blob като
    // останалите точки, просто не беше използвана досега).
    //
    // 🔹 2026-08-20 (2) — DK: точката трябва да е една (не R/L двойка като
    // BWS/LWS-Strecker по-горе) — коремните мускули се оценяват като едно
    // цяло. Ключът тук е `c` (center/single), съответства на
    // MUSCLE_LIST-ovия `sides: ['c']` за bauchmuskulatur.
    bauchmuskulatur: {
        c: { xPercent: 28.0, yPercent: 37.6 }
    }

};

// 🔹 1-5 оценъчна скала — цветове по медицинската конвенция, използвана
// вече в BeuterlungTable.tsx (червено=тежко/1 -> зелено=нормално/5).
export const KRAFT_RATING_COLORS = {
    1: '#ef5350',
    2: '#ffcc80',
    3: '#fff59d',
    4: '#c5e1a5',
    5: '#a5d6a7'
};
