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
export const RATSCHLAEGE_VORLAGE_A_DE = `Trainingsmethode:
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
• Je mehr verschiedene Sportarten Sie auswählen, desto ganzheitlicher wird Ihr Körper trainiert.`;

export const RATSCHLAEGE_VORLAGE_B_DE = '';
export const RATSCHLAEGE_VORLAGE_C_DE = '';
