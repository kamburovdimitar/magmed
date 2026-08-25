// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-11 (Europe/Sofia) — Localization pass, part 2 (after the user
//   pointed out remaining untranslated strings such as "Körperoberfläche
//   bezogen" / "Laufband Leistung"): added a new block of ~28 keys for
//   hardcoded static text across the Ergometrie/Laktat-Ergometrie/Spiro-
//   Ergometrie Test screens and their shared components (titles, section
//   headers, button labels) that had no existing matching key. See the
//   "START OF ERGOMETRY/LAKTAT/SPIRO SCREENS" block below for the full
//   list. Units and abbreviations that are identical in both languages
//   (Watt, km/h, bpm, HF, %VO2max, etc.) and info-popup tooltip content
//   were intentionally left out of scope.
// ============================================

class Translations {

    static translations = {
    new_client_text: {
    de: 'Neue Kunde',
    en: 'New Client'
  },
  save_client_text: {
    de: 'Speichern Client',
    en: 'Save Client'
  },
  search_client_text: {
    de: 'Suchen',
    en: 'Search Client'
  },
    lastname_text: {
    de: 'Nachname',
    en: 'Last Name'
  },
  firstname_text: {
    de: 'Vorname',
    en: 'First Name'
  },
    title_text: {
    de: 'Titel',
    en: 'Title'
  },
    birthdate_text: {
    de: 'Geburtsdatum',
    en: 'Date of Birth'
  },
    gender_text: {
    de: 'Geschlecht',
    en: 'Gender'
  },
  // 🔹 2026-08-21 (Claude) — DK: "gender ... нека е с дроп даун и да не
  // може да бъде празно" — новите dropdown опции/placeholder/hint текстове
  // (виж HeaderComponent.tsx). Ползваме "male"/"female" като канонични
  // стойности навсякъде (списък/dropdown/модел), защото ErgometrieUtil.js
  // вече очаква точно тях (`gender === "female"`).
  male_text: {
    de: 'Männlich',
    en: 'Male'
  },
  female_text: {
    de: 'Weiblich',
    en: 'Female'
  },
  select_gender_text: {
    de: '— Auswählen —',
    en: '— Select —'
  },
  complete_all_fields_hint_text: {
    de: 'Bitte alle Felder ausfüllen (inkl. Geschlecht).',
    en: 'Please fill in all fields (including Gender).'
  },
  nav_locked_hint_text: {
    de: 'Bitte zuerst Patientendaten vollständig ausfüllen.',
    en: 'Please complete the patient form first.'
  },
  patientid_text: {
    de: 'Patientenkennung',
    en: 'Patient ID'
  },
  search_btn_text: {
    de: 'Suchen',
    en: 'Search'
  },
   delete_client_text: {
    de: 'clear - translate DE',
    en: 'clear'
  },
  // 🔹 2026-08-21 (Claude) — забелязах при инспекция на Page4.tsx (докато
  // работех по gender-a): този ключ липсваше, затова бутонът в "Search
  // Patient" показваше суровото "DELETE_CUSTOMER_TEXT" (виж DK-скрийншот).
  // Малка, отделна поправка purely opportunistic — не е част от gender
  // заявката, но е директно видима в същия екран.
  delete_customer_text: {
    de: 'Kunde löschen',
    en: 'Delete Customer'
  },
  // 🔹 2026-08-21 (Claude) — DK: "инфо бутон отстрани на всяка една
  // таблица" (Training – Kein Test страница). Заглавия на секциите,
  // показвани до бутона "ⓘ" (TitleWithInfoComponent) — самото съдържание
  // на поп-ъпа е засега само на български (INFO_SUMMARY_BG/INFO_STAGES_BG
  // в TrainingsplanKeinTestComponent.tsx), но тези кратки заглавия минават
  // през общата LanguageUtil de/en система като всичко останало.
  basiswerte_trainingszonen_text: {
    de: 'Basiswerte & Trainingszonen',
    en: 'Base values & training zones'
  },
  trainingswoche_plan_text: {
    de: 'Trainingsplan (Trainingswoche)',
    en: 'Training plan (training week)'
  },
  add_btn_text: {
    de: 'add client - translate DE',
    en: 'Add client'
  },
   update_user_text: {
    de: 'Update Client - translate DE',
    en: 'Update Client'
  },
  // TEST COMPONENT

  koerpergroesse_text: {
    de: 'Körpergröße',
    en: 'Body Height'
  },
  koerpergewicht_text: {
    de: 'Körpergewicht',
    en: 'Body Weight'
  },
  body_mass_index_text: {
    de: 'Body Mass Index',
    en: 'Body Mass Index'
  },
  taillenumfang_text: {
    de: 'Taillenumfang',
    en: 'Waist Circumference'
  },
  hueftumfang_text: {
    de: 'Hüftumfang',
    en: 'Hip Circumference'
  },
  whr_index_text: {
    de: 'WHR-Index',
    en: 'WHR Index'
  },
  koerperfettanteil_text: {
    de: 'Körperfettanteil',
    en: 'Body Fat Percentage'
  },
  fettmasse_text: {
    de: 'Fettmasse',
    en: 'Fat Mass'
  },
  blutdruck_ruhe_text: {
    de: 'Blutdruck ruhe',
    en: 'Blood Pressure (resting)'
  },
  blutdruck_max_text: {
    de: 'Blutdruck max',
    en: 'Blood Pressure (max)'
  },
  herzfrequenz_ruhe_text: {
    de: 'Herzfrequenz ruhe',
    en: 'Heart Rate (resting)'
  },
  herzfrequenz_max_text: {
    de: 'Herzfrequenz max',
    en: 'Heart Rate (max)'
  },
  durchschnittlicher_erwartungswert_text: {
    de: 'Durchschnittlicher Erwartungswert',
    en: 'Average Expected Value'
  },    
  test_text: {
    de: 'Test',
    en: 'Test'
  },
  neuer_test_text: {
    de: 'Neuer Test',
    en: 'New Test'
  },
  vorhandene_tests_test: {
    de: 'Vorhandene Tests',
    en: 'Existing Tests'
  },

  //END OF TEST

// START OF ERGOMETRY/LAKTAT/SPIRO SCREENS (added 2026-08-11 — localization
// pass over the split Test screens; these cover hardcoded strings that had
// no existing matching key yet)

  koerperoberflaeche_bezogen_text: {
    de: 'Körperoberfläche bezogen',
    en: 'Body Surface Area Based'
  },
  koerpergewicht_bezogen_text: {
    de: 'Körpergewicht bezogen',
    en: 'Body Weight Based'
  },
  laufband_leistung_text: {
    de: 'Laufband Leistung',
    en: 'Treadmill Performance'
  },
  soll_wert_text: {
    de: 'SOLL WERT',
    en: 'TARGET VALUE'
  },
  ist_wert_text: {
    de: 'IST WERT',
    en: 'ACTUAL VALUE'
  },
  soll_text: {
    de: 'SOLL',
    en: 'TARGET'
  },
  ist_text: {
    de: 'IST',
    en: 'ACTUAL'
  },
  prozent_der_norm_text: {
    de: '% der Norm',
    en: '% of Norm'
  },
  max_speed_text: {
    de: 'Maximale Geschwindigkeit',
    en: 'Max Speed'
  },
  geschwindigkeit_text: {
    de: 'Geschwindigkeit',
    en: 'Speed'
  },
  fahrrad_text: {
    de: 'Fahrrad',
    en: 'Bike'
  },
  laufband_text: {
    de: 'Laufband',
    en: 'Treadmill'
  },
  testdaten_generieren_text: {
    de: 'Testdaten generieren',
    en: 'Generate Fake Data'
  },
  drucken_text: {
    de: 'Drucken',
    en: 'Print'
  },
  herzfrequenzreserve_text: {
    de: 'Herzfrequenzreserve',
    en: 'Heart Rate Reserve'
  },
  reserve_text: {
    de: 'Reserve',
    en: 'Reserve'
  },
  herzfrequenzzonen_text: {
    de: 'Herzfrequenzzonen (%)',
    en: 'Heart Rate Zones (%)'
  },
  maximale_sauerstoffaufnahme_text: {
    de: 'Maximale Sauerstoffaufnahme (VO₂max)',
    en: 'Maximum Oxygen Uptake (VO₂max)'
  },
  power_text: {
    de: 'Leistung',
    en: 'Power'
  },
  ergometrie_test_text: {
    de: 'Ergometrie-Test',
    en: 'Ergometry Test'
  },
  ergometrie_ergebnisse_text: {
    de: 'Ergometrie-Ergebnisse',
    en: 'Ergometry Results'
  },
  laktatschwelle_text: {
    de: 'Laktatschwelle',
    en: 'Lactate Threshold'
  },
  erste_schwelle_text: {
    de: 'Erste Schwelle (LT1)',
    en: 'First LT'
  },
  zweite_schwelle_text: {
    de: 'Zweite Schwelle (LT2)',
    en: 'Second LT'
  },
  zeit_text: {
    de: 'Zeit',
    en: 'Time'
  },
  belastung_text: {
    de: 'Belastung',
    en: 'Load'
  },
  zurueck_zur_startseite_text: {
    de: 'Zurück zur Startseite',
    en: 'Back to Home'
  },
  herzfrequenzzonen_karvonen_text: {
    de: 'Herzfrequenzzonen (Karvonen, 45-95%)',
    en: 'Heart Rate Zones (Karvonen, 45-95%)'
  },
  herzfrequenzzonen_vo2max_text: {
    de: 'Herzfrequenzzonen (%VO₂max, 45-95%)',
    en: 'Heart Rate Zones (%VO₂max, 45-95%)'
  },

// END OF ERGOMETRY/LAKTAT/SPIRO SCREENS

// START OF LAKTAT CURVE - page 11
  leistung_text: {
      de: 'Leistung',
      en: 'Performance'
    },

    grund_belastung_text: {
      de: 'Grund Belastung',
      en: 'Base Load'
    },

    belastungs_inkrement_text: {
      de: 'Belastungs Inkrement',
      en: 'Load Increment'
    },

    zeit_inkrement_text: {
      de: 'Zeit Inkrement',
      en: 'Time Increment'
    },


    // END OF OF LAKTAT CURVE

    // START OF PAGE 11 (LAKTAT) SCREEN — added 2026-08-11 (Europe/Sofia),
    // localization pass 3, after the user pointed out Page11.tsx (the
    // separate "PAGE 11 - LAKTAT" screen, not part of the Test-screen family)
    // was never wired to LanguageUtil at all.
    auswertung_text: {
      de: 'Auswertung',
      en: 'Evaluation'
    },
    trainingsplan_text: {
      de: 'Trainingsplan',
      en: 'Training plan'
    },
    uebungen_auswaehlen_text: {
      de: 'Übungen auswählen',
      en: 'Select exercises'
    },
    keine_befunde_text: {
      de: 'Keine Befunde erfasst',
      en: 'No findings recorded'
    },

    detail_analyse_text: {
      de: 'DIALOG (Detail-Analyse)',
      en: 'DIALOG (Detailed Analysis)'
    },

    threshold_summary_text: {
      de: 'Schwellenwert-Zusammenfassung',
      en: 'Threshold Summary'
    },

    no_archived_reports_text: {
      de: 'Keine archivierten Berichte',
      en: 'No archived reports'
    },

    modell_text: {
      de: 'Modell',
      en: 'Model'
    },

    zurueck_zum_bearbeiten_text: {
      de: 'Zurück zum Bearbeiten',
      en: 'Back To Edit'
    },

    bericht_oeffnen_text: {
      de: 'Bericht öffnen',
      en: 'Open Report'
    },

    speichern_generieren_text: {
      de: 'Speichern/Generieren',
      en: 'Save/Generate'
    },

    // 🔹 2026-08-19 — DK: бутонът трябва да е "Add" докато няма селектиран
    // archive запис (създава НОВ запис в листа), и "Save" щом има
    // селектиран/зареден запис (update-ва СЪЩИЯ). Преди беше "Archive" /
    // "Update Archive" — само преименувано, логиката (loadedReportId) е
    // непроменена. Виж Page11.tsx persistArchiveEntry(). 2026-08-19 (2) —
    // DK поиска "Save/Generate" и този бутон да се слеят в един — вече е
    // ЕДИНСТВЕНИЯТ бутон, save() вика persistArchiveEntry() накрая.
    archivieren_text: {
      de: 'Hinzufügen',
      en: 'Add'
    },

    archiv_aktualisieren_text: {
      de: 'Speichern',
      en: 'Save'
    },

    // 🔹 2026-08-19 (2) — DK: съобщението за неуспешен Add/Save трябва да
    // е popup (не inline банер) с КОНКРЕТНА причина — виж
    // buildArchiveFailureReason()/persistArchiveEntry() в Page11.tsx.
    archiv_kein_ergebnis_title_text: {
      de: 'Nicht hinzugefügt',
      en: 'Not added'
    },

    archiv_grund_zu_wenig_daten_text: {
      de: 'Für die gewählte Berechnungsmethode sind zu wenige gültige Messwerte (Load/Laktat) vorhanden.',
      en: 'Not enough valid measurements (load/lactate) for the selected calculation method.'
    },

    archiv_grund_allgemein_text: {
      de: 'Für die aktuellen Daten konnte kein gültiges Ergebnis berechnet werden.',
      en: 'No valid result could be calculated for the current data.'
    },

    alle_daten_loeschen_text: {
      de: 'Alle Daten löschen',
      en: 'Clear all data'
    },

    testdaten_aus_szenario_text: {
      de: 'Testdaten aus Szenario generieren',
      en: 'Generate Fake Data From Test Scenario'
    },

    // 🔹 2026-08-14 (Europe/Sofia) — öffnet den eigenständigen
    // "Business-Logic-Tracer" (public/tools/business_logic_tracer.html):
    // rechnet dieselben Formeln (Dickhuth/Freiburger/Linear/LTP/Keul/Keul
    // Legacy + Trainingsbereich-Kaskade) Schritt für Schritt nach, ohne
    // Code lesen zu müssen.
    logik_pruefen_text: {
      de: 'Rechenlogik prüfen',
      en: 'Check the calculation logic'
    },

    // 🔹 2026-08-17 (Europe/Sofia) — "3.36 CCC Laktatkurve überlagern"
    // под-изглед в Page11 (виж LaktatkurveUeberlagernComponent.tsx).
    ansicht_umschalten_text: {
      de: 'Ansicht wechseln',
      en: 'Switch view'
    },

    ansicht_aktuell_text: {
      de: 'Aktuell',
      en: 'Current'
    },

    ansicht_ueberlagern_text: {
      de: 'Überlagern',
      en: 'Overlay'
    },

    // 🔹 2026-08-18 (Europe/Sofia) — DK поиска изричен 4-бутонен под-навигатор
    // вместо 2-бутонния (виж LaktatkurveTrainingsbereichComponent.tsx /
    // LaktatkurveRechenverfahrenComponent.tsx).
    ansicht_trainingsbereich_text: {
      de: 'Trainingsbereich',
      en: 'Training Zones'
    },

    ansicht_rechenverfahren_text: {
      de: 'Rechenverfahren',
      en: 'Calculation Methods'
    },

    trainingsbereich_kein_ergebnis_text: {
      de: 'Noch kein gültiges Ergebnis (IAS/IANS) für diesen Test — bitte zuerst Speichern/Generieren.',
      en: 'No valid result (IAS/IANS) for this test yet — please Save/Generate first.'
    },

    rechenverfahren_intro_text: {
      de: 'Übersicht der 6 Rechenverfahren zur Schwellenbestimmung. Das aktuell gewählte Verfahren ist hervorgehoben.',
      en: 'Overview of the 6 calculation methods used to determine the thresholds. The currently selected method is highlighted.'
    },

    rechenverfahren_todo_text: {
      de: 'Detaillierter Abgleich mit "3.32 Rechenverfahren Beispiele" folgt in einem nächsten Schritt.',
      en: 'A detailed audit against "3.32 Rechenverfahren Beispiele" follows in a next step.'
    },

    rechenverfahren_dickhuth_desc_text: {
      de: 'Feste Schwelle bei 4 mmol/l plus individuelles Laktatminimum.',
      en: 'Fixed 4 mmol/l threshold plus the individual lactate minimum.'
    },

    rechenverfahren_freiburg_desc_text: {
      de: 'Laktatminimum + 2,0 mmol/l als feste Verschiebung.',
      en: 'Lactate minimum + a fixed 2.0 mmol/l offset.'
    },

    rechenverfahren_linear_desc_text: {
      de: 'Einfache lineare Regression über alle Messpunkte.',
      en: 'Simple linear regression across all measured points.'
    },

    rechenverfahren_ltp_desc_text: {
      de: 'Stückweise lineare Regression — sucht den Knickpunkt (Breakpoint) der Kurve.',
      en: 'Piecewise linear regression — finds the curve\'s breakpoint.'
    },

    rechenverfahren_keul_desc_text: {
      de: 'Individuelle anaerobe Schwelle über exponentielle Kurvenanpassung.',
      en: 'Individual anaerobic threshold via exponential curve fitting.'
    },

    rechenverfahren_keul_legacy_desc_text: {
      de: 'Ältere, vereinfachte Variante der maximalen Steigungsmethode.',
      en: 'Older, simplified variant of the maximum-slope method.'
    },

    ueberlagern_absolute_text: {
      de: 'absolute Darstellung',
      en: 'absolute view'
    },

    ueberlagern_normiert_text: {
      de: 'normierte Darstellung (%IANS)',
      en: 'normalized view (%IANS)'
    },

    ueberlagern_tests_text: {
      de: 'Tests',
      en: 'Tests'
    },

    ueberlagern_keine_tests_text: {
      de: 'Keine archivierten Tests für diesen Patienten.',
      en: 'No archived tests for this patient.'
    },

    ueberlagern_izberi_text: {
      de: 'Bitte mindestens einen Test links auswählen.',
      en: 'Please select at least one test on the left.'
    },

    ueberlagern_test_datum_text: {
      de: 'Test Datum',
      en: 'Test Date'
    },

    // 🔹 2026-08-18 (Europe/Sofia) — "3.36 CCC überlagern" стъпка 3: 5-те
    // toggle бутона от дясната колона на PDF-а (Herzfrequenzkurven/
    // Trainingszonen/Test Datum/Schwellenwerte/Schwellenlinien ein/aus),
    // приложени тук като реални бутони над графиката.
    ueberlagern_toggle_hf_text: {
      de: 'Herzfrequenzkurven ein/aus',
      en: 'Heart rate curves on/off'
    },

    ueberlagern_toggle_zonen_text: {
      de: 'Trainingszonen ein/aus',
      en: 'Training zones on/off'
    },

    ueberlagern_toggle_datum_text: {
      de: 'Test Datum ein/aus',
      en: 'Test date on/off'
    },

    ueberlagern_toggle_schwellenwerte_text: {
      de: 'Schwellenwerte ein/aus',
      en: 'Threshold values on/off'
    },

    ueberlagern_toggle_schwellenlinien_text: {
      de: 'Schwellenlinien ein/aus',
      en: 'Threshold lines on/off'
    },

    // 🔹 2026-08-18 (Europe/Sofia) — "3.36 CCC überlagern" стъпка 4:
    // навигационните бутони от най-горе на дясната колона (страница 5 от
    // PDF-а). DK изрично поиска да са на СВОЕ ниво, над toggle-ите, и лесно
    // да могат да се дизейбълнат — виж NAV_BUTTONS_ENABLED флага в
    // LaktatkurveUeberlagernComponent.tsx.
    ueberlagern_nav_zurueck_text: {
      de: 'ZURÜCK Kurvenansicht',
      en: 'BACK to curve view'
    },

    ueberlagern_nav_dialog_text: {
      de: 'Dialog',
      en: 'Dialog'
    },

    ueberlagern_nav_datenerfassung_text: {
      de: 'Daten Erfassung',
      en: 'Data Entry'
    },

    // 🔹 2026-08-17 (Europe/Sofia) — HomeScreen.js икон-навигация: тези
    // labels бяха hardcoded немски низове директно в NAV_ITEMS (бъг,
    // открит при преглед на скрийншот от DK — менюто излизаше немско,
    // докато останалата част от приложението е на английски, защото
    // активният език по подразбиране е 'en'). Прекарани сега през
    // LanguageUtil.getName(), както навсякъде другаде.
    nav_neuer_patient_text: {
      de: 'Neuer Patient',
      en: 'New Patient'
    },

    nav_patient_aktualisieren_text: {
      de: 'Patient aktualisieren/löschen',
      en: 'Update/Delete Patient'
    },

    nav_page3_text: {
      de: 'Seite 3',
      en: 'Page 3'
    },

    nav_patient_suchen_text: {
      de: 'Patient suchen',
      en: 'Search Patient'
    },

    nav_speichern_text: {
      de: 'Speichern',
      en: 'Save'
    },

    nav_drucken_text: {
      de: 'Drucken',
      en: 'Print'
    },

    nav_page7_text: {
      de: 'Seite 7',
      en: 'Page 7'
    },

    // 🔹 2026-08-19 — DK: "page 8 ... трябва да прекръстиш на межърмънтс" —
    // Page8 хоства Körpermaße/Muskel-Funktion/Körper-Haltung/Ergometrie/...
    // ("3.00 Test" менюто), не е никаква конкретна "страница 8" — старото
    // placeholder име (просто номера на файла) вече е сменено с описателно.
    nav_page8_text: {
      de: 'Messungen',
      en: 'Measurements'
    },

    nav_ergebnisse_text: {
      de: 'Ergebnisse',
      en: 'Results'
    },

    nav_training_text: {
      de: 'Training',
      en: 'Training'
    },

    nav_laktatkurve_text: {
      de: 'Laktatkurve',
      en: 'Lactate Curve'
    },

    nav_page12_text: {
      de: 'Seite 12',
      en: 'Page 12'
    },

    nav_einstellungen_text: {
      de: 'Einstellungen',
      en: 'Settings'
    },

    nav_abmelden_text: {
      de: 'Abmelden',
      en: 'Log Out'
    },

    hf_umschalten_text: {
      de: 'HF umschalten',
      en: 'Toggle HR'
    },

    schwellenwerte_umschalten_text: {
      de: 'Schwellenwerte umschalten',
      en: 'Toggle Thresholds'
    },

    zonen_umschalten_text: {
      de: 'Zonen umschalten',
      en: 'Toggle Zones'
    },

    bericht_drucken_text: {
      de: 'Bericht drucken',
      en: 'Print Report'
    },

    patienten_vorschau_text: {
      de: 'Patientenvorschau',
      en: 'Patient Preview'
    },

    ergebnis_vorschau_text: {
      de: 'Ergebnisvorschau',
      en: 'Result Preview'
    },

    // END OF PAGE 11 (LAKTAT) SCREEN

    // START OF NEW TEST / EXISTING TESTS / SAVE FEATURE — added 2026-08-11
    // (Europe/Sofia). Reused existing keys where possible: `speichern`
    // (Save), `neuer_test_text` (New Test), `vorhandene_tests_test`
    // (Existing Tests), `ja`/`nein` (confirm dialog buttons), `schliessen`
    // (Close), `uebernehmen` (Apply), `datum` (Date). Only these two were
    // genuinely new:
    test_data_loss_warning_text: {
      de: 'Ungespeicherte Änderungen gehen verloren. Fortfahren?',
      en: 'Unsaved changes will be lost. Continue?'
    },

    keine_tests_text: {
      de: 'Keine Tests vorhanden',
      en: 'No tests yet'
    },

    // END OF NEW TEST / EXISTING TESTS / SAVE FEATURE

    // 2026-08-13 (Europe/Sofia) — ErgometryHistoryComponent Delete button
    // (Page11.tsx archive list): confirm before permanently removing an
    // archived ergometry report.
    delete_report_confirm_text: {
      de: 'Dieser archivierte Bericht wird dauerhaft gelöscht. Fortfahren?',
      en: 'This archived report will be permanently deleted. Continue?'
    },

    // 2026-08-14 (Europe/Sofia) — Plausibilitätsprüfung (save() in
    // Page11.tsx): warning shown when Belastung (load) doesn't strictly
    // increase stage-over-stage.
    plausibility_load_error_text: {
      de: 'Die Belastungswerte steigen nicht stufenweise an — Ergebnisse können unzuverlässig sein. Bitte prüfen oder ein anderes Rechenverfahren wählen.',
      en: 'Load values do not increase stage-over-stage — results may be unreliable. Please check the data or choose a different model.'
    },







  nachname: {
    de: 'Nachname',
    en: 'Last Name'
  },
  vorname: {
    de: 'Vorname',
    en: 'First Name'
  },
  titel: {
    de: 'Titel',
    en: 'Title'
  },
  geburtsdatum: {
    de: 'Geburtsdatum',
    en: 'Date of Birth'
  },
  geschlecht: {
    de: 'Geschlecht',
    en: 'Gender'
  },
  patientenkennung: {
    de: 'Patientenkennung',
    en: 'Patient ID'
  },
  kunde_loeschen: {
    de: 'Kunde Löschen',
    en: 'Delete Customer'
  },
  start_seite: {
    de: 'Start Seite',
    en: 'Start Page'
  },

  koerpermassen_vitalparametern: {
    de: 'Körpermaßen & Vitalparametern',
    en: 'Body Measurements & Vital Parameters'
  },
  muskel_funktion: {
    de: 'Muskel-Funktion',
    en: 'Muscle Function'
  },
  koerper_haltung: {
    de: 'Körper-Haltung',
    en: 'Body Posture'
  },
  ergometrie: {
    de: 'Ergometrie',
    en: 'Ergometry'
  },
  laktat_ergometrie: {
    de: 'Laktat-Ergometrie',
    en: 'Lactate Ergometry'
  },
  spiro_ergometrie: {
    de: 'Spiro-Ergometrie',
    en: 'Spiro-Ergometry'
  },
  alle_tests: {
    de: 'ALLE Tests',
    en: 'ALL Tests'
  },
  interpretation: {
    de: 'Interpretation',
    en: 'Interpretation'
  },
  name_des_anwenders: {
    de: 'Name des Anwenders',
    en: 'User Name'
  },
  datum: {
    de: 'Datum',
    en: 'Date'
  },
  alter: {
    de: 'Alter',
    en: 'Age'
  },
  referenzbereich: {
    de: 'Referenzbereich',
    en: 'Reference Range'
  },
  messwert: {
    de: 'Messwert',
    en: 'Measured Value'
  },
  risikoeinschaetzung: {
    de: 'Risikoeinschätzung',
    en: 'Risk Assessment'
  },
  normbereich: {
    de: 'Normbereich',
    en: 'Normal Range'
  },
  abweichung: {
    de: 'Abweichung',
    en: 'Deviation'
  },
  trainingszonen: {
    de: 'Trainingszonen',
    en: 'Training Zones'
  },
  // 🔹 2026-08-14 — Trainingsbereich table (per "3.34 CCC Laktatkurve und
  // Trainingsbereich"): title + column headers for TrainingsbereichComponent.tsx
  trainingsbereich_titel_text: {
    de: 'TRAININGSBEREICH',
    en: 'TRAINING ZONE'
  },
  prozent_der_ians_text: {
    de: '% der IANS',
    en: '% of IANS'
  },
  mmol_liter_text: {
    de: 'mmol/Liter',
    en: 'mmol/Liter'
  },
  belastungsbereiche: {
    de: 'Belastungsbereiche',
    en: 'Load Zones'
  },
  leistungsbereich: {
    de: 'Leistungsbereich',
    en: 'Performance Range'
  },
  rechenverfahren: {
    de: 'Rechenverfahren',
    en: 'Calculation Method'
  },
  keul_modell: {
    de: 'Keul Modell',
    en: 'Keul Model'
  },
  freiburger_modell: {
    de: 'Freiburger Modell',
    en: 'Freiburg Model'
  },
  dichut_modell: {
    de: 'Dichut Modell',
    en: 'Dichut Model'
  },
  stueckweise_linear: {
    de: 'Stückweise linear',
    en: 'Piecewise Linear'
  },
  daten_erfassung: {
    de: 'Daten Erfassung',
    en: 'Data Recording'
  },
  stufe: {
    de: 'Stufe',
    en: 'Stage'
  },
  zeitpunkt: {
    de: 'Zeitpunkt',
    en: 'Timepoint'
  },
  laktat: {
    de: 'Laktat',
    en: 'Lactate'
  },
  leistung: {
    de: 'Leistung',
    en: 'Performance'
  },
  grund_belastung: {
    de: 'Grund Belastung',
    en: 'Basic Load'
  },
  belastungs_inkrement: {
    de: 'Belastungs-Inkrement',
    en: 'Load Increment'
  },
  zeit_inkrement: {
    de: 'Zeit Inkrement',
    en: 'Time Increment'
  },
  laktat_kurve: {
    de: 'Laktat Kurve',
    en: 'Lactate Curve'
  },
  name: {
    de: 'Name',
    en: 'Name'
  },
  testdatum: {
    de: 'Testdatum',
    en: 'Test Date'
  },
  dialog: {
    de: 'Dialog',
    en: 'Dialogue'
  },
  kopf: {
    de: 'KOPF',
    en: 'Head'
  },
  wirbelsaeule: {
    de: 'WIRBELSÄULE',
    en: 'Spine'
  },
  schulter: {
    de: 'SCHULTER',
    en: 'Shoulder'
  },
  becken: {
    de: 'BECKEN',
    en: 'Pelvis'
  },
  knie: {
    de: 'KNIE',
    en: 'Knee'
  },
  fuss: {
    de: 'FUß',
    en: 'Foot'
  },
  schwer: {
    de: 'schwer',
    en: 'severe'
  },
  mittelschwer: {
    de: 'mittelschwer',
    en: 'moderate'
  },
  leicht: {
    de: 'leicht',
    en: 'mild'
  },
  normal: {
    de: 'normal',
    en: 'normal'
  },

  // 🔹 2026-08-19 — MUFU (Muskel-Funktion/Körper-Haltung, "3.05 Neuer Test -
  // MUFU" мокъп): DK поиска KRAFT (сила) таблицата с интерактивна снимка на
  // тялото (виж MuskelFunktionKraftComponent.tsx) + Körper-Haltung с
  // WIRBELSÄULE (реизползва вече готовия BeuterlungTable.tsx).
  beurteilung_text: {
    de: 'BEURTEILUNG',
    en: 'ASSESSMENT'
  },
  kraft_text: {
    de: 'KRAFT',
    en: 'STRENGTH'
  },
  dehnbarkeit_text: {
    de: 'DEHNBARKEIT',
    en: 'FLEXIBILITY'
  },
  beweglichkeit_text: {
    de: 'BEWEGLICHKEIT',
    en: 'MOBILITY'
  },
  mufu_placeholder_text: {
    de: 'Noch nicht implementiert.',
    en: 'Not implemented yet.'
  },

  // 🔹 10-те мускула от KRAFT таблицата, реда точно както в мокъпа
  oberarmbeuger_text: {
    de: 'Oberarmbeuger',
    en: 'Elbow flexors'
  },
  oberarmstrecker_text: {
    de: 'Oberarmstrecker',
    en: 'Elbow extensors'
  },
  schulterblattfixatoren_text: {
    de: 'Schulterblattfixatoren',
    en: 'Scapula fixators'
  },
  schulterabduktion_text: {
    de: 'Schulterabduktion',
    en: 'Shoulder abduction'
  },
  bwsstrecker_text: {
    de: 'BWS-Strecker',
    en: 'Thoracic spine extensors'
  },
  lwsstrecker_text: {
    de: 'LWS-Strecker',
    en: 'Lumbar spine extensors'
  },
  gesaessmuskulatur_text: {
    de: 'Gesäßmuskulatur',
    en: 'Gluteal muscles'
  },
  beinabduktor_text: {
    de: 'Beinabduktor',
    en: 'Leg abductor'
  },
  mquadriceps_text: {
    de: 'M. quadriceps',
    en: 'Quadriceps'
  },
  mischiocruralis_text: {
    de: 'M. ischiocruralis',
    en: 'Hamstrings'
  },
  bauchmuskulatur_text: {
    de: 'Bauchmuskulatur',
    en: 'Abdominal muscles'
  },

  speichern: {
    de: 'Speichern',
    en: 'Save'
  },
  // 🔹 2026-08-21 (Claude) — DK: "трябва да сложим [Save бутон] ... тук,
  // както и на предната страница" (Training таба) — краткотрайно
  // потвърждение "✓ Записано", показвано на самия Save бутон за 1.5 сек
  // (виж saveNow() в TrainingsplanComponent.tsx).
  saved_confirmation_text: {
    de: 'Gespeichert ✓',
    en: 'Saved ✓'
  },
  zuruecksetzen: {
    de: 'Zurücksetzen',
    en: 'Reset'
  },
  schliessen: {
    de: 'Schließen',
    en: 'Close'
  },
  oeffnen: {
    de: 'Öffnen',
    en: 'Open'
  },
  importieren: {
    de: 'Importieren',
    en: 'Import'
  },
  bearbeiten: {
    de: 'Bearbeiten',
    en: 'Edit'
  },  
  neue_schreiben: {
    de: 'Neue schreiben',
    en: 'Write new'
  },
  verschieben: {
    de: 'Verschieben',
    en: 'Move'
  },
  loeschen: {
    de: 'Löschen',
    en: 'Delete'
  },
  uebernehmen: {
    de: 'Übernehmen',
    en: 'Apply'
  },
  ratschlaege: {
    de: 'Ratschläge',
    en: 'Recommendations'
  },
  ja: {
    de: 'ja',
    en: 'yes'
  },
  nein: {
    de: 'nein',
    en: 'no'
  },
  montag: {
    de: 'Montag',
    en: 'Monday'
  },
  dienstag: {
    de: 'Dienstag',
    en: 'Tuesday'
  },
  mittwoch: {
    de: 'Mittwoch',
    en: 'Wednesday'
  },
  donnerstag: {
    de: 'Donnerstag',
    en: 'Thursday'
  },
  freitag: {
    de: 'Freitag',
    en: 'Friday'
  },
  samstag: {
    de: 'Samstag',
    en: 'Saturday'
  },
  sonntag: {
    de: 'Sonntag',
    en: 'Sunday'
  },

  // 🔹 2026-08-20 — "Training – Gesundheit" модул (Training/❤️ страница,
  // Page10.tsx/TrainingsplanComponent.tsx/TrainingsplanKeinTestComponent.tsx)
  // — 5 нови PDF-а, план обсъден с DK преди имплементация.
  kein_test_text: {
    de: 'Kein Test',
    en: 'No Test'
  },
  training_ergometrie_text: {
    de: 'Ergometrie',
    en: 'Ergometry'
  },
  training_laktat_ergometrie_text: {
    de: 'Laktat Ergometrie',
    en: 'Lactate Ergometry'
  },
  training_spiro_ergometrie_text: {
    de: 'Spiro Ergometrie',
    en: 'Spiro Ergometry'
  },
  // 🔹 2026-08-21 (Claude) — DK: "лактат ергометри" (5.25b мокъп) — IAS/
  // LTP1 и IANS/LTP2 са установени медицински съкращения (Individuelle
  // Aerobe/Anaerobe Schwelle, Lactate Threshold Point 1/2) — оставени
  // непреведени и на двата езика, точно както в мокъпа.
  ias_ltp1_text: {
    de: 'IAS/LTP1',
    en: 'IAS/LTP1'
  },
  ians_ltp2_text: {
    de: 'IANS/LTP2',
    en: 'IANS/LTP2'
  },
  // 🔹 2026-08-21 (Claude) — "остана последният — Spiro Ergometrie" —
  // VT1/VT2 (Ventilatory Threshold 1/2) — установени медицински
  // съкращения, непреведени и на двата езика, точно като IAS/IANS.
  vt1_text: {
    de: 'VT1',
    en: 'VT1'
  },
  vt2_text: {
    de: 'VT2',
    en: 'VT2'
  },
  hfruhe_text: {
    de: 'HFruhe',
    en: 'HR rest'
  },
  hfmax_text: {
    de: 'HFmax.',
    en: 'HR max.'
  },
  watt_max_text: {
    de: 'Watt max.',
    en: 'Watt max.'
  },
  kmh_max_text: {
    de: 'km/h max.',
    en: 'km/h max.'
  },
  radfahren_text: {
    de: 'Radfahren',
    en: 'Cycling'
  },
  laufen_text: {
    de: 'Laufen',
    en: 'Running'
  },
  trainingsbereich_text: {
    de: 'Trainingsbereich',
    en: 'Training zone'
  },
  // 🔹 2026-08-21 (Claude) — DK: "ергометрия" таб (5.24b мокъп) — ляво
  // меню REHABILITATION/GESUNDHEITSSPORT/FREIZEITSPORT (виж
  // TrainingsplanComponent.tsx). gesundheitssport_text/freizeitsport_text
  // вече съществуваха (реизползвани и като GA1/GA2 етикети в Kein Test
  // таба) — само rehabilitation_text липсваше.
  rehabilitation_text: {
    de: 'REHABILITATION',
    en: 'REHABILITATION'
  },
  gesundheitssport_text: {
    de: 'GESUNDHEITSSPORT',
    en: 'HEALTH SPORT'
  },
  freizeitsport_text: {
    de: 'FREIZEITSPORT',
    en: 'LEISURE SPORT'
  },
  stufe_text: {
    de: 'Stufe',
    en: 'Stage'
  },
  wntz_text: {
    de: 'WNTZ',
    en: 'WNTZ'
  },
  wntz_minuten_text: {
    de: 'WNTZ Minuten',
    en: 'WNTZ minutes'
  },
  dauer_te_minuten_text: {
    de: 'Dauer/TE Minuten',
    en: 'Duration/session minutes'
  },
  te_woche_haeufigkeit_text: {
    de: 'TE/Woche Häufigkeit',
    en: 'Sessions/week frequency'
  },
  zeit_aufteilung_text: {
    de: 'Zeit Aufteilung % Trainingsbereich',
    en: 'Time split % training zone'
  },
  trainingsblock_wochen_text: {
    de: 'Trainingsblock Wochen',
    en: 'Training block weeks'
  },
  vorlage_a_text: {
    de: 'Vorlage A',
    en: 'Template A'
  },
  vorlage_b_text: {
    de: 'Vorlage B',
    en: 'Template B'
  },
  vorlage_c_text: {
    de: 'Vorlage C',
    en: 'Template C'
  },
  automatik_ein_aus_text: {
    de: 'Automatik EIN / AUS',
    en: 'Automatic ON / OFF'
  },
  nicht_gewaehlte_bereiche_ausblenden_text: {
    de: 'Nicht gewählte Bereiche ausblenden',
    en: 'Hide unselected areas'
  },
  trainings_woche_gestalten_text: {
    de: 'Trainings-Woche GESTALTEN',
    en: 'DESIGN training week'
  },
  leere_tabellen_text: {
    de: 'LEERE Tabellen',
    en: 'EMPTY tables'
  },
  personenspezifische_standardwerte_text: {
    de: 'Personenspezifische Standardwerte',
    en: 'Person-specific defaults'
  },
  abrufen_text: {
    de: 'Abrufen',
    en: 'Retrieve'
  },
  wntz_erklaerung_text: {
    de: 'Wöchentliche Netto-Trainingszeit: gesamte geplante Trainingszeit pro Woche ohne organisatorische Pausen.',
    en: 'Weekly net training time: total planned training time per week, excluding organisational breaks.'
  },
  dauer_te_erklaerung_text: {
    de: 'Effektive Belastungsdauer einer einzelnen Trainingseinheit.',
    en: 'Effective load duration of a single training session.'
  },
  te_woche_erklaerung_text: {
    de: 'Häufigkeit - Anzahl der Trainingseinheiten pro Kalenderwoche. Minimum-Maximum-Empfehlung (z.B. 2–3 Trainingseinheiten pro Woche)',
    en: 'Frequency - number of training sessions per calendar week. Minimum-maximum recommendation (e.g. 2–3 sessions per week)'
  },
  zeit_aufteilung_erklaerung_text: {
    de: '90 % der Train.-Zeit im Bereich GA1 und 10 % der Train.-Zeit im Bereich GA2',
    en: '90% of training time in the GA1 zone and 10% of training time in the GA2 zone'
  },
  trainingsblock_erklaerung_text: {
    de: 'Zeitraum, in dem die Trainingsstufe vor einer Steigerung auf die nächste Stufe durchgeführt werden soll.',
    en: 'Period during which the training stage should be maintained before progressing to the next stage.'
  }
}



  
}


export default Translations
  
//   nachname: {
//     de: 'Nachname',
//     en: 'Last Name'
//   },
//   vorname: {
//     de: 'Vorname',
//     en: 'First Name'
//   },
//   titel: {
//     de: 'Titel',
//     en: 'Title'
//   },
//   geburtsdatum: {
//     de: 'Geburtsdatum',
//     en: 'Date of Birth'
//   },
//   geschlecht: {
//     de: 'Geschlecht',
//     en: 'Gender'
//   },
//   patientenkennung: {
//     de: 'Patientenkennung',
//     en: 'Patient ID'
//   },
//   kunde_loeschen: {
//     de: 'Kunde Löschen',
//     en: 'Delete Customer'
//   },
//   start_seite: {
//     de: 'Start Seite',
//     en: 'Start Page'
//   },
//   koerpergroesse: {
//     de: 'Körpergröße',
//     en: 'Body Height'
//   },
//   koerpergewicht: {
//     de: 'Körpergewicht',
//     en: 'Body Weight'
//   },
//   body_mass_index: {
//     de: 'Body Mass Index',
//     en: 'Body Mass Index'
//   },
//   taillenumfang: {
//     de: 'Taillenumfang',
//     en: 'Waist Circumference'
//   },
//   hueftumfang: {
//     de: 'Hüftumfang',
//     en: 'Hip Circumference'
//   },
//   whr_index: {
//     de: 'WHR-Index',
//     en: 'WHR Index'
//   },
//   koerperfettanteil: {
//     de: 'Körperfettanteil',
//     en: 'Body Fat Percentage'
//   },
//   fettmasse: {
//     de: 'Fettmasse',
//     en: 'Fat Mass'
//   },
//   blutdruck_ruhe: {
//     de: 'Blutdruck ruhe',
//     en: 'Blood Pressure (resting)'
//   },
//   blutdruck_max: {
//     de: 'Blutdruck max',
//     en: 'Blood Pressure (max)'
//   },
//   herzfrequenz_ruhe: {
//     de: 'Herzfrequenz ruhe',
//     en: 'Heart Rate (resting)'
//   },
//   herzfrequenz_max: {
//     de: 'Herzfrequenz max',
//     en: 'Heart Rate (max)'
//   },
//   durchschnittlicher_erwartungswert: {
//     de: 'Durchschnittlicher Erwartungswert',
//     en: 'Average Expected Value'
//   },
//   test: {
//     de: 'Test',
//     en: 'Test'
//   },
//   neuer_test: {
//     de: 'Neuer Test',
//     en: 'New Test'
//   },
//   vorhandene_tests: {
//     de: 'Vorhandene Tests',
//     en: 'Existing Tests'
//   },
//   koerpermassen_vitalparametern: {
//     de: 'Körpermaßen & Vitalparametern',
//     en: 'Body Measurements & Vital Parameters'
//   },
//   muskel_funktion: {
//     de: 'Muskel-Funktion',
//     en: 'Muscle Function'
//   },
//   koerper_haltung: {
//     de: 'Körper-Haltung',
//     en: 'Body Posture'
//   },
//   ergometrie: {
//     de: 'Ergometrie',
//     en: 'Ergometry'
//   },
//   laktat_ergometrie: {
//     de: 'Laktat-Ergometrie',
//     en: 'Lactate Ergometry'
//   },
//   spiro_ergometrie: {
//     de: 'Spiro-Ergometrie',
//     en: 'Spiro-Ergometry'
//   },
//   alle_tests: {
//     de: 'ALLE Tests',
//     en: 'ALL Tests'
//   },
//   interpretation: {
//     de: 'Interpretation',
//     en: 'Interpretation'
//   },
//   name_des_anwenders: {
//     de: 'Name des Anwenders',
//     en: 'User Name'
//   },
//   datum: {
//     de: 'Datum',
//     en: 'Date'
//   },
//   alter: {
//     de: 'Alter',
//     en: 'Age'
//   },
//   referenzbereich: {
//     de: 'Referenzbereich',
//     en: 'Reference Range'
//   },
//   messwert: {
//     de: 'Messwert',
//     en: 'Measured Value'
//   },
//   risikoeinschaetzung: {
//     de: 'Risikoeinschätzung',
//     en: 'Risk Assessment'
//   },
//   normbereich: {
//     de: 'Normbereich',
//     en: 'Normal Range'
//   },
//   abweichung: {
//     de: 'Abweichung',
//     en: 'Deviation'
//   },
//   trainingszonen: {
//     de: 'Trainingszonen',
//     en: 'Training Zones'
//   },
//   belastungsbereiche: {
//     de: 'Belastungsbereiche',
//     en: 'Load Zones'
//   },
//   leistungsbereich: {
//     de: 'Leistungsbereich',
//     en: 'Performance Range'
//   },
//   rechenverfahren: {
//     de: 'Rechenverfahren',
//     en: 'Calculation Method'
//   },
//   keul_modell: {
//     de: 'Keul Modell',
//     en: 'Keul Model'
//   },
//   freiburger_modell: {
//     de: 'Freiburger Modell',
//     en: 'Freiburg Model'
//   },
//   dichut_modell: {
//     de: 'Dichut Modell',
//     en: 'Dichut Model'
//   },
//   stueckweise_linear: {
//     de: 'Stückweise linear',
//     en: 'Piecewise Linear'
//   },
//   daten_erfassung: {
//     de: 'Daten Erfassung',
//     en: 'Data Recording'
//   },
//   stufe: {
//     de: 'Stufe',
//     en: 'Stage'
//   },
//   zeitpunkt: {
//     de: 'Zeitpunkt',
//     en: 'Timepoint'
//   },
//   laktat: {
//     de: 'Laktat',
//     en: 'Lactate'
//   },
//   leistung: {
//     de: 'Leistung',
//     en: 'Performance'
//   },
//   grund_belastung: {
//     de: 'Grund Belastung',
//     en: 'Basic Load'
//   },
//   belastungs_inkrement: {
//     de: 'Belastungs-Inkrement',
//     en: 'Load Increment'
//   },
//   zeit_inkrement: {
//     de: 'Zeit Inkrement',
//     en: 'Time Increment'
//   },
//   laktat_kurve: {
//     de: 'Laktat Kurve',
//     en: 'Lactate Curve'
//   },
//   name: {
//     de: 'Name',
//     en: 'Name'
//   },
//   testdatum: {
//     de: 'Testdatum',
//     en: 'Test Date'
//   },
//   dialog: {
//     de: 'Dialog',
//     en: 'Dialogue'
//   },
//   kopf: {
//     de: 'KOPF',
//     en: 'Head'
//   },
//   wirbelsaeule: {
//     de: 'WIRBELSÄULE',
//     en: 'Spine'
//   },
//   schulter: {
//     de: 'SCHULTER',
//     en: 'Shoulder'
//   },
//   becken: {
//     de: 'BECKEN',
//     en: 'Pelvis'
//   },
//   knie: {
//     de: 'KNIE',
//     en: 'Knee'
//   },
//   fuss: {
//     de: 'FUß',
//     en: 'Foot'
//   },
//   schwer: {
//     de: 'schwer',
//     en: 'severe'
//   },
//   mittelschwer: {
//     de: 'mittelschwer',
//     en: 'moderate'
//   },
//   leicht: {
//     de: 'leicht',
//     en: 'mild'
//   },
//   normal: {
//     de: 'normal',
//     en: 'normal'
//   },
//   speichern: {
//     de: 'Speichern',
//     en: 'Save'
//   },
//   zuruecksetzen: {
//     de: 'Zurücksetzen',
//     en: 'Reset'
//   },
//   schliessen: {
//     de: 'Schließen',
//     en: 'Close'
//   },
//   oeffnen: {
//     de: 'Öffnen',
//     en: 'Open'
//   },
//   importieren: {
//     de: 'Importieren',
//     en: 'Import'
//   },
//   bearbeiten: {
//     de: 'Bearbeiten',
//     en: 'Edit'
//   },  
//   neue_schreiben: {
//     de: 'Neue schreiben',
//     en: 'Write new'
//   },
//   verschieben: {
//     de: 'Verschieben',
//     en: 'Move'
//   },
//   loeschen: {
//     de: 'Löschen',
//     en: 'Delete'
//   },
//   uebernehmen: {
//     de: 'Übernehmen',
//     en: 'Apply'
//   },
//   ratschlaege: {
//     de: 'Ratschläge',
//     en: 'Recommendations'
//   },
//   ja: {
//     de: 'ja',
//     en: 'yes'
//   },
//   nein: {
//     de: 'nein',
//     en: 'no'
//   },
//   montag: {
//     de: 'Montag',
//     en: 'Monday'
//   },
//   dienstag: {
//     de: 'Dienstag',
//     en: 'Tuesday'
//   },
//   mittwoch: {
//     de: 'Mittwoch',
//     en: 'Wednesday'
//   },
//   donnerstag: {
//     de: 'Donnerstag',
//     en: 'Thursday'
//   },
//   freitag: {
//     de: 'Freitag',
//     en: 'Friday'
//   },
//   samstag: {
//     de: 'Samstag',
//     en: 'Saturday'
//   },
//   sonntag: {
//     de: 'Sonntag',
//     en: 'Sunday'
//   }
// }



// }

