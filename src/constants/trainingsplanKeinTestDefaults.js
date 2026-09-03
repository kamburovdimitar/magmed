// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-20 (Europe/Sofia) — DK: "Training – Gesundheit" модул, Kein Test
//   таб (5.21b_Training_Gesundheit_Kein_Test_Grundeinstellung_EXPORT_2.pdf,
//   страница 1 "Grundeinstellung" — Trainings-Woche таблицата, ВСИЧКИ 8
//   стадия, точните стойности от мокъпа). Реизползвано и в Individuelle
//   Planung (страница 2) като начални стойности, преди DK-специфичното
//   подбиране (там само 2./4./6. са отметнати — виж
//   TrainingsplanKeinTestComponent.tsx).
export const KEIN_TEST_DEFAULT_STAGES = [
    { stage: 1, active: true, wntz: 30, dauerTe: '10-15', teWoche: '2-3', zeitAufteilung: '90/10', trainingsblock: '3-5' },
    { stage: 2, active: true, wntz: 60, dauerTe: '15-20', teWoche: '3-4', zeitAufteilung: '90/10', trainingsblock: '4-6' },
    { stage: 3, active: true, wntz: 90, dauerTe: '20-30', teWoche: '3-4', zeitAufteilung: '80/20', trainingsblock: '4-6' },
    { stage: 4, active: true, wntz: 120, dauerTe: '30-40', teWoche: '3-4', zeitAufteilung: '80/20', trainingsblock: '5-7' },
    { stage: 5, active: true, wntz: 150, dauerTe: '40-50', teWoche: '3-4', zeitAufteilung: '70/30', trainingsblock: '5-7' },
    { stage: 6, active: true, wntz: 180, dauerTe: '40-60', teWoche: '3-5', zeitAufteilung: '70/30', trainingsblock: '6-8' },
    { stage: 7, active: true, wntz: 240, dauerTe: '40-80', teWoche: '3-6', zeitAufteilung: '60/40', trainingsblock: '7-9' },
    { stage: 8, active: true, wntz: 300, dauerTe: '45-90', teWoche: '3-7', zeitAufteilung: '60/40', trainingsblock: '-----' }
];

// 🔹 2026-09-02 (Claude) — DK: екранът "Тренировка" беше объркващ, защото
//   таблицата по-горе (KEIN_TEST_DEFAULT_STAGES) се показваше като "по
//   подразбиране" стойност за ВСЕКИ пациент, във всичките 4 таба — все
//   едно е реален, персонализиран план, а всъщност е буквално еднакво за
//   всеки. DK изрично избра: докторът пише плана РЪЧНО (не софтуерът да
//   генерира нещо автоматично) — затова таблицата вече трябва да ТРЪГВА
//   празна за нов тест, не с тези генерични числа. KEIN_TEST_DEFAULT_STAGES
//   остава експортиран само защото "Generate fake data" бутоните
//   (TrainingsplanComponent.tsx) все още го ползват като РАЗУМНА база за
//   случайни демо стойности — това е демонстрационна функция, не истинско
//   поведение по подразбиране, затова е ОК да остане.
export const EMPTY_STAGES = [1, 2, 3, 4, 5, 6, 7, 8].map((stage) => ({
    stage,
    active: false,
    wntz: '',
    dauerTe: '',
    teWoche: '',
    zeitAufteilung: '',
    trainingsblock: ''
}));

// 🔹 GA1/GA2 интензитет диапазони (% на HFR / Karvonen) — фиксирани по
// Entscheidungsbaum (5.90CCCGESUNDHEITS_Training.pdf, "KEIN TEST –
// Standardeinstellung": "GA1 50–60; GA2 60–70 (% der HFR)").
export const KEIN_TEST_INTENSITY_RANGES = {
    ga1: { from: 50, to: 60 },
    ga2: { from: 60, to: 70 }
};

// 🔹 Ratschläge — Vorlage A, дословен текст от мокъпа (5.21b, страница 1,
// дясното "Ratschläge" поле). Vorlage B/C НЕ са предоставени от DK в нито
// един от 5-те PDF-а — placeholder-и, готови да се попълнят, щом дойде
// реален текст (виж TrainingsplanKeinTestComponent.tsx).
//
// 🔹 2026-08-21 (Claude) — DK: "текста в дясно Recommendations, да има
// опция да е на български, немски и английски, първоначално да е на
// български." Всяка Vorlage вече е обект {bg, de, en} вместо отделна
// константа само на немски — TrainingsplanKeinTestComponent.tsx превключва
// езика през нов бутон (БГ/DE/EN) в дясното Ratschläge поле, по подразбиране
// 'bg'. Немският текст (единственият, предоставен от DK в 5.21b мокъпа)
// остава непроменен; българският и английският са преводи, направени от
// Claude — DK, ако нещо звучи неточно медицински/терминологично, кажи и ще
// го коригирам.
export const RATSCHLAEGE_VORLAGE_A = {

    bg: `Метод на тренировка:
• Продължителен метод, променлив метод, фартлек и интервален метод

Честота на движенията:
• Колоездене (обороти на педалите/мин) респ. Бягане (двойни крачки/мин): GA1: 60–100/мин, GA2: 70–100/мин

Загряване:
• Преди да достигнете личната си тренировъчна сърдечна честота, е необходимо да загреете с леко колоездене, ходене или бягане. По време на загряването трябва да се достигне подходящата честота на движенията за съответния вид спорт.
• Загряването е толкова по-важно и по-продължително, колкото по-интензивна е планираната тренировка!

Разхлаждане:
• Фазата на разхлаждане включва леко колоездене/бягане, разтягане и отпускащи упражнения. Тази фаза трябва да се удължи, ако натоварването е било продължително или интензивно.

Подходящи форми на издръжливостна тренировка:
• Всички цикличен видове спорт като: колоездене (на домашен уред и на открито), бързо ходене ("Walking"), туризъм, бягане ("джогинг"), ски бягане, плуване, гребане и степер.
• Тренировъчен ефект има само реалното време на натоварване.
• Колкото повече различни видове спорт изберете, толкова по-цялостно се тренира тялото ви.`,

    de: `Trainingsmethode:
• Dauermethode, Wechselmethoden, Fahrtspiel und Intervallmethoden

Bewegungsfrequenzen:
• Radfahren (Pedalumdrehungen/min) bzw. Laufen (Doppelschritte/min): GA1: 60–100/min, GA2: 70–100/min

Aufwärmen:
• Bevor Sie in Ihre persönliche Trainingsherzfrequenz gelangen, ist es notwendig, sich durch leichtes Radfahren, Gehen oder Laufen aufzuwärmen. Im Zuge des Aufwärmens sollten die für die jeweilige Sportart richtigen Bewegungsfrequenzen erreicht werden.
• Die Aufwärmphase ist umso wichtiger und länger, je intensiver das Training geplant ist!

Abwärmen:
• Die Abkühlphase umfasst Ausradeln, Auslaufen, Lockerungs- und Dehnungsübungen. Diese Phase sollte verlängert werden, wenn die Belastungsphase sehr lang oder intensiv war.

Geeignete Formen von Ausdauertraining:
• Alle zyklischen Sportarten wie: Radfahren (Heimtrainer und im Freien), schnelles Gehen ("Walking"), Wandern, Laufen ("Jogging"), Schilanglaufen, Schwimmen, Rudern und Steppen.
• Trainingswirksam ist nur die effektive Belastungszeit.
• Je mehr verschiedene Sportarten Sie auswählen, desto ganzheitlicher wird Ihr Körper trainiert.`,

    en: `Training method:
• Continuous method, alternating method, fartlek and interval method

Movement frequency:
• Cycling (pedal revolutions/min) or running (double steps/min): GA1: 60–100/min, GA2: 70–100/min

Warm-up:
• Before reaching your personal training heart rate, it is necessary to warm up with light cycling, walking or running. During warm-up, the movement frequency appropriate for the given sport should be reached.
• The warm-up phase is more important and should be longer the more intense the planned training is!

Cool-down:
• The cool-down phase includes easy pedaling/running, stretching and relaxation exercises. This phase should be extended if the training load was long or intense.

Suitable forms of endurance training:
• All cyclical sports such as: cycling (indoor trainer and outdoors), brisk walking, hiking, running/jogging, cross-country skiing, swimming, rowing and stepping.
• Only the effective time under load counts as training-effective.
• The more different sports you choose, the more comprehensively your body is trained.`

};

export const RATSCHLAEGE_VORLAGE_B = { bg: '', de: '', en: '' };
export const RATSCHLAEGE_VORLAGE_C = { bg: '', de: '', en: '' };
