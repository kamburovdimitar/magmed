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
    en: 'New Client',
    bg: 'Нов клиент'
  },
  save_client_text: {
    de: 'Speichern Client',
    en: 'Save Client',
    bg: 'Запази клиент'
  },
  search_client_text: {
    de: 'Suchen',
    en: 'Search Client',
    bg: 'Търсене на клиент'
  },
    lastname_text: {
    de: 'Nachname',
    en: 'Last Name',
    bg: 'Фамилия'
  },
  firstname_text: {
    de: 'Vorname',
    en: 'First Name',
    bg: 'Име'
  },
    title_text: {
    de: 'Titel',
    en: 'Title',
    bg: 'Титла'
  },
    birthdate_text: {
    de: 'Geburtsdatum',
    en: 'Date of Birth',
    bg: 'Дата на раждане'
  },
    gender_text: {
    de: 'Geschlecht',
    en: 'Gender',
    bg: 'Пол'
  },
  // 🔹 2026-08-21 (Claude) — DK: "gender ... нека е с дроп даун и да не
  // може да бъде празно" — новите dropdown опции/placeholder/hint текстове
  // (виж HeaderComponent.tsx). Ползваме "male"/"female" като канонични
  // стойности навсякъде (списък/dropdown/модел), защото ErgometrieUtil.js
  // вече очаква точно тях (`gender === "female"`).
  male_text: {
    de: 'Männlich',
    en: 'Male',
    bg: 'Мъж'
  },
  female_text: {
    de: 'Weiblich',
    en: 'Female',
    bg: 'Жена'
  },
  select_gender_text: {
    de: '— Auswählen —',
    en: '— Select —',
    bg: '— Изберете —'
  },
  complete_all_fields_hint_text: {
    de: 'Bitte alle Felder ausfüllen (inkl. Geschlecht).',
    en: 'Please fill in all fields (including Gender).',
    bg: 'Моля, попълнете всички полета (вкл. пол).'
  },
  nav_locked_hint_text: {
    de: 'Bitte zuerst Patientendaten vollständig ausfüllen.',
    en: 'Please complete the patient form first.',
    bg: 'Моля, първо попълнете изцяло данните на пациента.'
  },
  // 🔹 2026-08-26 (Claude) — DK: "махни или дизейбълни страниците, които
  // засега не ги ползваме" (page3/page5/page6/page7/page9, виж
  // HomeScreen.js PERMANENTLY_DISABLED_PAGES) — различен tooltip от
  // nav_locked_hint_text по-горе, защото причината тук НЕ е непопълнена
  // форма, а страницата просто все още не се ползва.
  nav_not_available_text: {
    de: 'Noch nicht verfügbar.',
    en: 'Not available yet.',
    bg: 'Все още не се използва.'
  },
  patientid_text: {
    de: 'Patientenkennung',
    en: 'Patient ID',
    bg: 'Идентификатор на пациента'
  },
  search_btn_text: {
    de: 'Suchen',
    en: 'Search',
    bg: 'Търсене'
  },
   delete_client_text: {
    de: 'clear - translate DE',
    en: 'clear',
    bg: 'изчисти'
  },
  // 🔹 2026-08-21 (Claude) — забелязах при инспекция на Page4.tsx (докато
  // работех по gender-a): този ключ липсваше, затова бутонът в "Search
  // Patient" показваше суровото "DELETE_CUSTOMER_TEXT" (виж DK-скрийншот).
  // Малка, отделна поправка purely opportunistic — не е част от gender
  // заявката, но е директно видима в същия екран.
  delete_customer_text: {
    de: 'Kunde löschen',
    en: 'Delete Customer',
    bg: 'Изтрий клиент'
  },
  // 🔹 2026-08-21 (Claude) — DK: "инфо бутон отстрани на всяка една
  // таблица" (Training – Kein Test страница). Заглавия на секциите,
  // показвани до бутона "ⓘ" (TitleWithInfoComponent) — самото съдържание
  // на поп-ъпа е засега само на български (INFO_SUMMARY_BG/INFO_STAGES_BG
  // в TrainingsplanKeinTestComponent.tsx), но тези кратки заглавия минават
  // през общата LanguageUtil de/en система като всичко останало.
  basiswerte_trainingszonen_text: {
    de: 'Basiswerte & Trainingszonen',
    en: 'Base values & training zones',
    bg: 'Базови стойности и тренировъчни зони'
  },
  trainingswoche_plan_text: {
    de: 'Trainingsplan (Trainingswoche)',
    en: 'Training plan (training week)',
    bg: 'Тренировъчен план (тренировъчна седмица)'
  },
  add_btn_text: {
    de: 'add client - translate DE',
    en: 'Add client',
    bg: 'Добави клиент'
  },
   update_user_text: {
    de: 'Update Client - translate DE',
    en: 'Update Client',
    bg: 'Обнови клиент'
  },
  // TEST COMPONENT

  koerpergroesse_text: {
    de: 'Körpergröße',
    en: 'Body Height',
    bg: 'Ръст'
  },
  koerpergewicht_text: {
    de: 'Körpergewicht',
    en: 'Body Weight',
    bg: 'Телесно тегло'
  },
  body_mass_index_text: {
    de: 'Body Mass Index',
    en: 'Body Mass Index',
    bg: 'Индекс на телесна маса (BMI)'
  },
  taillenumfang_text: {
    de: 'Taillenumfang',
    en: 'Waist Circumference',
    bg: 'Обиколка на талията'
  },
  hueftumfang_text: {
    de: 'Hüftumfang',
    en: 'Hip Circumference',
    bg: 'Обиколка на ханша'
  },
  whr_index_text: {
    de: 'WHR-Index',
    en: 'WHR Index',
    bg: 'WHR индекс'
  },
  koerperfettanteil_text: {
    de: 'Körperfettanteil',
    en: 'Body Fat Percentage',
    bg: 'Процент телесни мазнини'
  },
  fettmasse_text: {
    de: 'Fettmasse',
    en: 'Fat Mass',
    bg: 'Мастна маса'
  },
  blutdruck_ruhe_text: {
    de: 'Blutdruck ruhe',
    en: 'Blood Pressure (resting)',
    bg: 'Кръвно налягане (в покой)'
  },
  blutdruck_max_text: {
    de: 'Blutdruck max',
    en: 'Blood Pressure (max)',
    bg: 'Кръвно налягане (макс.)'
  },
  herzfrequenz_ruhe_text: {
    de: 'Herzfrequenz ruhe',
    en: 'Heart Rate (resting)',
    bg: 'Сърдечна честота (в покой)'
  },
  herzfrequenz_max_text: {
    de: 'Herzfrequenz max',
    en: 'Heart Rate (max)',
    bg: 'Сърдечна честота (макс.)'
  },
  durchschnittlicher_erwartungswert_text: {
    de: 'Durchschnittlicher Erwartungswert',
    en: 'Average Expected Value',
    bg: 'Средна очаквана стойност'
  },    
  test_text: {
    de: 'Test',
    en: 'Test',
    bg: 'Тест'
  },
  neuer_test_text: {
    de: 'Neuer Test',
    en: 'New Test',
    bg: 'Нов тест'
  },
  vorhandene_tests_test: {
    de: 'Vorhandene Tests',
    en: 'Existing Tests',
    bg: 'Съществуващи тестове'
  },

  //END OF TEST

// START OF ERGOMETRY/LAKTAT/SPIRO SCREENS (added 2026-08-11 — localization
// pass over the split Test screens; these cover hardcoded strings that had
// no existing matching key yet)

  koerperoberflaeche_bezogen_text: {
    de: 'Körperoberfläche bezogen',
    en: 'Body Surface Area Based',
    bg: 'Спрямо телесна повърхност'
  },
  koerpergewicht_bezogen_text: {
    de: 'Körpergewicht bezogen',
    en: 'Body Weight Based',
    bg: 'Спрямо телесно тегло'
  },
  laufband_leistung_text: {
    de: 'Laufband Leistung',
    en: 'Treadmill Performance',
    bg: 'Мощност на бягаща пътека'
  },
  soll_wert_text: {
    de: 'SOLL WERT',
    en: 'TARGET VALUE',
    bg: 'ЦЕЛЕВА СТОЙНОСТ'
  },
  ist_wert_text: {
    de: 'IST WERT',
    en: 'ACTUAL VALUE',
    bg: 'ДЕЙСТВИТЕЛНА СТОЙНОСТ'
  },
  soll_text: {
    de: 'SOLL',
    en: 'TARGET',
    bg: 'ЦЕЛ'
  },
  ist_text: {
    de: 'IST',
    en: 'ACTUAL',
    bg: 'ДЕЙСТВИТЕЛНО'
  },
  prozent_der_norm_text: {
    de: '% der Norm',
    en: '% of Norm',
    bg: '% от нормата'
  },
  max_speed_text: {
    de: 'Maximale Geschwindigkeit',
    en: 'Max Speed',
    bg: 'Максимална скорост'
  },
  geschwindigkeit_text: {
    de: 'Geschwindigkeit',
    en: 'Speed',
    bg: 'Скорост'
  },
  fahrrad_text: {
    de: 'Fahrrad',
    en: 'Bike',
    bg: 'Велоергометър'
  },
  laufband_text: {
    de: 'Laufband',
    en: 'Treadmill',
    bg: 'Бягаща пътека'
  },
  testdaten_generieren_text: {
    de: 'Testdaten generieren',
    en: 'Generate Fake Data',
    bg: 'Генерирай тестови данни'
  },
  drucken_text: {
    de: 'Drucken',
    en: 'Print',
    bg: 'Печат'
  },
  herzfrequenzreserve_text: {
    de: 'Herzfrequenzreserve',
    en: 'Heart Rate Reserve',
    bg: 'Резерв на сърдечната честота'
  },
  reserve_text: {
    de: 'Reserve',
    en: 'Reserve',
    bg: 'Резерв'
  },
  herzfrequenzzonen_text: {
    de: 'Herzfrequenzzonen (%)',
    en: 'Heart Rate Zones (%)',
    bg: 'Зони на сърдечна честота (%)'
  },
  maximale_sauerstoffaufnahme_text: {
    de: 'Maximale Sauerstoffaufnahme (VO₂max)',
    en: 'Maximum Oxygen Uptake (VO₂max)',
    bg: 'Максимален кислороден прием (VO₂max)'
  },
  power_text: {
    de: 'Leistung',
    en: 'Power',
    bg: 'Мощност'
  },
  ergometrie_test_text: {
    de: 'Ergometrie-Test',
    en: 'Ergometry Test',
    bg: 'Ергометричен тест'
  },
  ergometrie_ergebnisse_text: {
    de: 'Ergometrie-Ergebnisse',
    en: 'Ergometry Results',
    bg: 'Резултати от ергометрия'
  },
  laktatschwelle_text: {
    de: 'Laktatschwelle',
    en: 'Lactate Threshold',
    bg: 'Лактатен праг'
  },
  erste_schwelle_text: {
    de: 'Erste Schwelle (LT1)',
    en: 'First LT',
    bg: 'Първи праг (LT1)'
  },
  zweite_schwelle_text: {
    de: 'Zweite Schwelle (LT2)',
    en: 'Second LT',
    bg: 'Втори праг (LT2)'
  },
  zeit_text: {
    de: 'Zeit',
    en: 'Time',
    bg: 'Време'
  },
  belastung_text: {
    de: 'Belastung',
    en: 'Load',
    bg: 'Натоварване'
  },
  zurueck_zur_startseite_text: {
    de: 'Zurück zur Startseite',
    en: 'Back to Home',
    bg: 'Обратно към началната страница'
  },
  herzfrequenzzonen_karvonen_text: {
    de: 'Herzfrequenzzonen (Karvonen, 45-95%)',
    en: 'Heart Rate Zones (Karvonen, 45-95%)',
    bg: 'Зони на сърдечна честота (Карвонен, 45-95%)'
  },
  herzfrequenzzonen_vo2max_text: {
    de: 'Herzfrequenzzonen (%VO₂max, 45-95%)',
    en: 'Heart Rate Zones (%VO₂max, 45-95%)',
    bg: 'Зони на сърдечна честота (%VO₂max, 45-95%)'
  },

// END OF ERGOMETRY/LAKTAT/SPIRO SCREENS

// START OF LAKTAT CURVE - page 11
  leistung_text: {
      de: 'Leistung',
      en: 'Performance',
      bg: 'Представяне'
    },

    grund_belastung_text: {
      de: 'Grund Belastung',
      en: 'Base Load',
      bg: 'Базово натоварване'
    },

    belastungs_inkrement_text: {
      de: 'Belastungs Inkrement',
      en: 'Load Increment',
      bg: 'Прираст на натоварването'
    },

    zeit_inkrement_text: {
      de: 'Zeit Inkrement',
      en: 'Time Increment',
      bg: 'Времеви прираст'
    },


    // END OF OF LAKTAT CURVE

    // START OF PAGE 11 (LAKTAT) SCREEN — added 2026-08-11 (Europe/Sofia),
    // localization pass 3, after the user pointed out Page11.tsx (the
    // separate "PAGE 11 - LAKTAT" screen, not part of the Test-screen family)
    // was never wired to LanguageUtil at all.
    auswertung_text: {
      de: 'Auswertung',
      en: 'Evaluation',
      bg: 'Оценка'
    },
    trainingsplan_text: {
      de: 'Trainingsplan',
      en: 'Training plan',
      bg: 'Тренировъчен план'
    },
    uebungen_auswaehlen_text: {
      de: 'Übungen auswählen',
      en: 'Select exercises',
      bg: 'Избери упражнения'
    },
    keine_befunde_text: {
      de: 'Keine Befunde erfasst',
      en: 'No findings recorded',
      bg: 'Няма въведени находки'
    },

    detail_analyse_text: {
      de: 'DIALOG (Detail-Analyse)',
      en: 'DIALOG (Detailed Analysis)',
      bg: 'ДИАЛОГ (Подробен анализ)'
    },

    threshold_summary_text: {
      de: 'Schwellenwert-Zusammenfassung',
      en: 'Threshold Summary',
      bg: 'Обобщение на праговете'
    },

    no_archived_reports_text: {
      de: 'Keine archivierten Berichte',
      en: 'No archived reports',
      bg: 'Няма архивирани отчети'
    },

    modell_text: {
      de: 'Modell',
      en: 'Model',
      bg: 'Модел'
    },

    zurueck_zum_bearbeiten_text: {
      de: 'Zurück zum Bearbeiten',
      en: 'Back To Edit',
      bg: 'Обратно към редактиране'
    },

    bericht_oeffnen_text: {
      de: 'Bericht öffnen',
      en: 'Open Report',
      bg: 'Отвори отчет'
    },

    speichern_generieren_text: {
      de: 'Speichern/Generieren',
      en: 'Save/Generate',
      bg: 'Запази/Генерирай'
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
      en: 'Add',
      bg: 'Добави'
    },

    archiv_aktualisieren_text: {
      de: 'Speichern',
      en: 'Save',
      bg: 'Запази'
    },

    // 🔹 2026-08-19 (2) — DK: съобщението за неуспешен Add/Save трябва да
    // е popup (не inline банер) с КОНКРЕТНА причина — виж
    // buildArchiveFailureReason()/persistArchiveEntry() в Page11.tsx.
    archiv_kein_ergebnis_title_text: {
      de: 'Nicht hinzugefügt',
      en: 'Not added',
      bg: 'Не е добавено'
    },

    archiv_grund_zu_wenig_daten_text: {
      de: 'Für die gewählte Berechnungsmethode sind zu wenige gültige Messwerte (Load/Laktat) vorhanden.',
      en: 'Not enough valid measurements (load/lactate) for the selected calculation method.',
      bg: 'За избрания метод на изчисление няма достатъчно валидни измервания (натоварване/лактат).'
    },

    archiv_grund_allgemein_text: {
      de: 'Für die aktuellen Daten konnte kein gültiges Ergebnis berechnet werden.',
      en: 'No valid result could be calculated for the current data.',
      bg: 'За текущите данни не можа да бъде изчислен валиден резултат.'
    },

    alle_daten_loeschen_text: {
      de: 'Alle Daten löschen',
      en: 'Clear all data',
      bg: 'Изчисти всички данни'
    },

    testdaten_aus_szenario_text: {
      de: 'Testdaten aus Szenario generieren',
      en: 'Generate Fake Data From Test Scenario',
      bg: 'Генерирай тестови данни от сценарий'
    },

    // 🔹 2026-08-14 (Europe/Sofia) — öffnet den eigenständigen
    // "Business-Logic-Tracer" (public/tools/business_logic_tracer.html):
    // rechnet dieselben Formeln (Dickhuth/Freiburger/Linear/LTP/Keul/Keul
    // Legacy + Trainingsbereich-Kaskade) Schritt für Schritt nach, ohne
    // Code lesen zu müssen.
    logik_pruefen_text: {
      de: 'Rechenlogik prüfen',
      en: 'Check the calculation logic',
      bg: 'Провери логиката на изчисление'
    },

    // 🔹 2026-08-17 (Europe/Sofia) — "3.36 CCC Laktatkurve überlagern"
    // под-изглед в Page11 (виж LaktatkurveUeberlagernComponent.tsx).
    ansicht_umschalten_text: {
      de: 'Ansicht wechseln',
      en: 'Switch view',
      bg: 'Смяна на изгледа'
    },

    ansicht_aktuell_text: {
      de: 'Aktuell',
      en: 'Current',
      bg: 'Текущ'
    },

    ansicht_ueberlagern_text: {
      de: 'Überlagern',
      en: 'Overlay',
      bg: 'Наслагване'
    },

    // 🔹 2026-08-18 (Europe/Sofia) — DK поиска изричен 4-бутонен под-навигатор
    // вместо 2-бутонния (виж LaktatkurveTrainingsbereichComponent.tsx /
    // LaktatkurveRechenverfahrenComponent.tsx).
    ansicht_trainingsbereich_text: {
      de: 'Trainingsbereich',
      en: 'Training Zones',
      bg: 'Тренировъчни зони'
    },

    ansicht_rechenverfahren_text: {
      de: 'Rechenverfahren',
      en: 'Calculation Methods',
      bg: 'Методи на изчисление'
    },

    trainingsbereich_kein_ergebnis_text: {
      de: 'Noch kein gültiges Ergebnis (IAS/IANS) für diesen Test — bitte zuerst Speichern/Generieren.',
      en: 'No valid result (IAS/IANS) for this test yet — please Save/Generate first.',
      bg: 'Все още няма валиден резултат (IAS/IANS) за този тест — моля, първо използвайте Запази/Генерирай.'
    },

    rechenverfahren_intro_text: {
      de: 'Übersicht der 6 Rechenverfahren zur Schwellenbestimmung. Das aktuell gewählte Verfahren ist hervorgehoben.',
      en: 'Overview of the 6 calculation methods used to determine the thresholds. The currently selected method is highlighted.',
      bg: 'Преглед на 6-те метода за изчисление на праговете. Текущо избраният метод е маркиран.'
    },

    rechenverfahren_todo_text: {
      de: 'Detaillierter Abgleich mit "3.32 Rechenverfahren Beispiele" folgt in einem nächsten Schritt.',
      en: 'A detailed audit against "3.32 Rechenverfahren Beispiele" follows in a next step.',
      bg: 'Подробно сравнение с "3.32 Rechenverfahren Beispiele" следва в следваща стъпка.'
    },

    rechenverfahren_dickhuth_desc_text: {
      de: 'Feste Schwelle bei 4 mmol/l plus individuelles Laktatminimum.',
      en: 'Fixed 4 mmol/l threshold plus the individual lactate minimum.',
      bg: 'Фиксиран праг от 4 mmol/l плюс индивидуалния лактатен минимум.'
    },

    rechenverfahren_freiburg_desc_text: {
      de: 'Laktatminimum + 2,0 mmol/l als feste Verschiebung.',
      en: 'Lactate minimum + a fixed 2.0 mmol/l offset.',
      bg: 'Лактатен минимум + фиксирано изместване от 2,0 mmol/l.'
    },

    rechenverfahren_linear_desc_text: {
      de: 'Einfache lineare Regression über alle Messpunkte.',
      en: 'Simple linear regression across all measured points.',
      bg: 'Проста линейна регресия по всички измерени точки.'
    },

    rechenverfahren_ltp_desc_text: {
      de: 'Stückweise lineare Regression — sucht den Knickpunkt (Breakpoint) der Kurve.',
      en: 'Piecewise linear regression — finds the curve\'s breakpoint.',
      bg: 'Частично линейна регресия — търси точката на прегъване (breakpoint) на кривата.'
    },

    rechenverfahren_keul_desc_text: {
      de: 'Individuelle anaerobe Schwelle über exponentielle Kurvenanpassung.',
      en: 'Individual anaerobic threshold via exponential curve fitting.',
      bg: 'Индивидуален анаеробен праг чрез експоненциално апроксимиране на кривата.'
    },

    rechenverfahren_keul_legacy_desc_text: {
      de: 'Ältere, vereinfachte Variante der maximalen Steigungsmethode.',
      en: 'Older, simplified variant of the maximum-slope method.',
      bg: 'По-стар, опростен вариант на метода на максималния наклон.'
    },

    ueberlagern_absolute_text: {
      de: 'absolute Darstellung',
      en: 'absolute view',
      bg: 'абсолютен изглед'
    },

    ueberlagern_normiert_text: {
      de: 'normierte Darstellung (%IANS)',
      en: 'normalized view (%IANS)',
      bg: 'нормализиран изглед (%IANS)'
    },

    ueberlagern_tests_text: {
      de: 'Tests',
      en: 'Tests',
      bg: 'Тестове'
    },

    ueberlagern_keine_tests_text: {
      de: 'Keine archivierten Tests für diesen Patienten.',
      en: 'No archived tests for this patient.',
      bg: 'Няма архивирани тестове за този пациент.'
    },

    ueberlagern_izberi_text: {
      de: 'Bitte mindestens einen Test links auswählen.',
      en: 'Please select at least one test on the left.',
      bg: 'Моля, изберете поне един тест отляво.'
    },

    ueberlagern_test_datum_text: {
      de: 'Test Datum',
      en: 'Test Date',
      bg: 'Дата на теста'
    },

    // 🔹 2026-08-18 (Europe/Sofia) — "3.36 CCC überlagern" стъпка 3: 5-те
    // toggle бутона от дясната колона на PDF-а (Herzfrequenzkurven/
    // Trainingszonen/Test Datum/Schwellenwerte/Schwellenlinien ein/aus),
    // приложени тук като реални бутони над графиката.
    ueberlagern_toggle_hf_text: {
      de: 'Herzfrequenzkurven ein/aus',
      en: 'Heart rate curves on/off',
      bg: 'Криви на сърдечна честота вкл./изкл.'
    },

    ueberlagern_toggle_zonen_text: {
      de: 'Trainingszonen ein/aus',
      en: 'Training zones on/off',
      bg: 'Тренировъчни зони вкл./изкл.'
    },

    ueberlagern_toggle_datum_text: {
      de: 'Test Datum ein/aus',
      en: 'Test date on/off',
      bg: 'Дата на теста вкл./изкл.'
    },

    ueberlagern_toggle_schwellenwerte_text: {
      de: 'Schwellenwerte ein/aus',
      en: 'Threshold values on/off',
      bg: 'Прагови стойности вкл./изкл.'
    },

    ueberlagern_toggle_schwellenlinien_text: {
      de: 'Schwellenlinien ein/aus',
      en: 'Threshold lines on/off',
      bg: 'Прагови линии вкл./изкл.'
    },

    // 🔹 2026-08-18 (Europe/Sofia) — "3.36 CCC überlagern" стъпка 4:
    // навигационните бутони от най-горе на дясната колона (страница 5 от
    // PDF-а). DK изрично поиска да са на СВОЕ ниво, над toggle-ите, и лесно
    // да могат да се дизейбълнат — виж NAV_BUTTONS_ENABLED флага в
    // LaktatkurveUeberlagernComponent.tsx.
    ueberlagern_nav_zurueck_text: {
      de: 'ZURÜCK Kurvenansicht',
      en: 'BACK to curve view',
      bg: 'НАЗАД към изгледа на кривата'
    },

    ueberlagern_nav_dialog_text: {
      de: 'Dialog',
      en: 'Dialog',
      bg: 'Диалог'
    },

    ueberlagern_nav_datenerfassung_text: {
      de: 'Daten Erfassung',
      en: 'Data Entry',
      bg: 'Въвеждане на данни'
    },

    // 🔹 2026-08-17 (Europe/Sofia) — HomeScreen.js икон-навигация: тези
    // labels бяха hardcoded немски низове директно в NAV_ITEMS (бъг,
    // открит при преглед на скрийншот от DK — менюто излизаше немско,
    // докато останалата част от приложението е на английски, защото
    // активният език по подразбиране е 'en'). Прекарани сега през
    // LanguageUtil.getName(), както навсякъде другаде.
    nav_neuer_patient_text: {
      de: 'Neuer Patient',
      en: 'New Patient',
      bg: 'Нов пациент'
    },

    nav_patient_aktualisieren_text: {
      de: 'Patient aktualisieren/löschen',
      en: 'Update/Delete Patient',
      bg: 'Обнови/Изтрий пациент'
    },

    nav_page3_text: {
      de: 'Seite 3',
      en: 'Page 3',
      bg: 'Страница 3'
    },

    nav_patient_suchen_text: {
      de: 'Patient suchen',
      en: 'Search Patient',
      bg: 'Търси пациент'
    },

    nav_speichern_text: {
      de: 'Speichern',
      en: 'Save',
      bg: 'Запази'
    },

    nav_drucken_text: {
      de: 'Drucken',
      en: 'Print',
      bg: 'Печат'
    },

    nav_page7_text: {
      de: 'Seite 7',
      en: 'Page 7',
      bg: 'Страница 7'
    },

    // 🔹 2026-08-19 — DK: "page 8 ... трябва да прекръстиш на межърмънтс" —
    // Page8 хоства Körpermaße/Muskel-Funktion/Körper-Haltung/Ergometrie/...
    // ("3.00 Test" менюто), не е никаква конкретна "страница 8" — старото
    // placeholder име (просто номера на файла) вече е сменено с описателно.
    nav_page8_text: {
      de: 'Messungen',
      en: 'Measurements',
      bg: 'Измервания'
    },

    // 2026-08-31 (Claude) — за TestProgressDashboardComponent.tsx
    // ("Табло за прогреса" на Page3.tsx).
    test_progress_done_text: {
      de: 'Fertig',
      en: 'Done',
      bg: 'Готово'
    },

    test_progress_partial_text: {
      de: 'Teilweise',
      en: 'Partial',
      bg: 'Частично'
    },

    test_progress_empty_text: {
      de: 'Keine Daten',
      en: 'No data',
      bg: 'Няма данни'
    },

    test_progress_of_text: {
      de: 'von',
      en: 'of',
      bg: 'от'
    },

    test_progress_domains_ready_text: {
      de: 'Bereiche fertig',
      en: 'domains ready',
      bg: 'раздела готови'
    },

    test_progress_print_card_text: {
      de: 'Drucken / Bericht',
      en: 'Print / report',
      bg: 'Печат / доклад'
    },

    nav_ergebnisse_text: {
      de: 'Ergebnisse',
      en: 'Results',
      bg: 'Резултати'
    },

    nav_training_text: {
      de: 'Training',
      en: 'Training',
      bg: 'Тренировка'
    },

    nav_laktatkurve_text: {
      de: 'Laktatkurve',
      en: 'Lactate Curve',
      bg: 'Лактатна крива'
    },

    nav_page12_text: {
      de: 'Seite 12',
      en: 'Page 12',
      bg: 'Страница 12'
    },

    nav_einstellungen_text: {
      de: 'Einstellungen',
      en: 'Settings',
      bg: 'Настройки'
    },

    nav_abmelden_text: {
      de: 'Abmelden',
      en: 'Log Out',
      bg: 'Изход'
    },

    hf_umschalten_text: {
      de: 'HF umschalten',
      en: 'Toggle HR',
      bg: 'Превключи СЧ'
    },

    schwellenwerte_umschalten_text: {
      de: 'Schwellenwerte umschalten',
      en: 'Toggle Thresholds',
      bg: 'Превключи прагове'
    },

    zonen_umschalten_text: {
      de: 'Zonen umschalten',
      en: 'Toggle Zones',
      bg: 'Превключи зони'
    },

    bericht_drucken_text: {
      de: 'Bericht drucken',
      en: 'Print Report',
      bg: 'Отпечатай отчет'
    },

    patienten_vorschau_text: {
      de: 'Patientenvorschau',
      en: 'Patient Preview',
      bg: 'Преглед на пациент'
    },

    ergebnis_vorschau_text: {
      de: 'Ergebnisvorschau',
      en: 'Result Preview',
      bg: 'Преглед на резултат'
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
      en: 'Unsaved changes will be lost. Continue?',
      bg: 'Незапазените промени ще бъдат загубени. Продължи?'
    },

    keine_tests_text: {
      de: 'Keine Tests vorhanden',
      en: 'No tests yet',
      bg: 'Все още няма тестове'
    },

    // 2026-08-27 (Europe/Sofia) — DEL button in TestsListComponent (Page8
    // "Vorhandene Tests" panel): confirm before permanently deleting a
    // saved MDTestRecord. Same purpose/wording pattern as the existing
    // delete_report_confirm_text (archived ergometry reports), kept as a
    // separate key since it's a different kind of record.
    test_delete_confirm_text: {
      de: 'Dieser Test wird dauerhaft gelöscht. Fortfahren?',
      en: 'This test will be permanently deleted. Continue?',
      bg: 'Този тест ще бъде изтрит завинаги. Продължи?'
    },

    // 2026-08-27 (Europe/Sofia) — DK: "нека бутоните са add/update с
    // преводите им на български". Generic (not "Client"-specific, unlike
    // the existing add_btn_text/update_user_text pair) Add/Update labels
    // for Page8's bottom-footer buttons.
    hinzufuegen_text: {
      de: 'Hinzufügen',
      en: 'Add',
      bg: 'Добави'
    },

    aktualisieren_text: {
      de: 'Aktualisieren',
      en: 'Update',
      bg: 'Обнови'
    },

    // END OF NEW TEST / EXISTING TESTS / SAVE FEATURE

    // 2026-08-13 (Europe/Sofia) — ErgometryHistoryComponent Delete button
    // (Page11.tsx archive list): confirm before permanently removing an
    // archived ergometry report.
    delete_report_confirm_text: {
      de: 'Dieser archivierte Bericht wird dauerhaft gelöscht. Fortfahren?',
      en: 'This archived report will be permanently deleted. Continue?',
      bg: 'Този архивиран отчет ще бъде изтрит завинаги. Продължи?'
    },

    // 2026-08-14 (Europe/Sofia) — Plausibilitätsprüfung (save() in
    // Page11.tsx): warning shown when Belastung (load) doesn't strictly
    // increase stage-over-stage.
    plausibility_load_error_text: {
      de: 'Die Belastungswerte steigen nicht stufenweise an — Ergebnisse können unzuverlässig sein. Bitte prüfen oder ein anderes Rechenverfahren wählen.',
      en: 'Load values do not increase stage-over-stage — results may be unreliable. Please check the data or choose a different model.',
      bg: 'Стойностите на натоварване не се увеличават поетапно — резултатите може да са ненадеждни. Моля, проверете данните или изберете друг метод на изчисление.'
    },







  nachname: {
    de: 'Nachname',
    en: 'Last Name',
    bg: 'Фамилия'
  },
  vorname: {
    de: 'Vorname',
    en: 'First Name',
    bg: 'Име'
  },
  titel: {
    de: 'Titel',
    en: 'Title',
    bg: 'Титла'
  },
  geburtsdatum: {
    de: 'Geburtsdatum',
    en: 'Date of Birth',
    bg: 'Дата на раждане'
  },
  geschlecht: {
    de: 'Geschlecht',
    en: 'Gender',
    bg: 'Пол'
  },
  patientenkennung: {
    de: 'Patientenkennung',
    en: 'Patient ID',
    bg: 'Идентификатор на пациента'
  },
  kunde_loeschen: {
    de: 'Kunde Löschen',
    en: 'Delete Customer',
    bg: 'Изтрий клиент'
  },
  start_seite: {
    de: 'Start Seite',
    en: 'Start Page',
    bg: 'Начална страница'
  },

  koerpermassen_vitalparametern: {
    de: 'Körpermaßen & Vitalparametern',
    en: 'Body Measurements & Vital Parameters',
    bg: 'Телесни измервания и жизнени показатели'
  },
  muskel_funktion: {
    de: 'Muskel-Funktion',
    en: 'Muscle Function',
    bg: 'Мускулна функция'
  },
  koerper_haltung: {
    de: 'Körper-Haltung',
    en: 'Body Posture',
    bg: 'Телесна стойка'
  },
  ergometrie: {
    de: 'Ergometrie',
    en: 'Ergometry',
    bg: 'Ергометрия'
  },
  laktat_ergometrie: {
    de: 'Laktat-Ergometrie',
    en: 'Lactate Ergometry',
    bg: 'Лактатна ергометрия'
  },
  spiro_ergometrie: {
    de: 'Spiro-Ergometrie',
    en: 'Spiro-Ergometry',
    bg: 'Спироергометрия'
  },
  alle_tests: {
    de: 'ALLE Tests',
    en: 'ALL Tests',
    bg: 'ВСИЧКИ тестове'
  },
  interpretation: {
    de: 'Interpretation',
    en: 'Interpretation',
    bg: 'Интерпретация'
  },
  name_des_anwenders: {
    de: 'Name des Anwenders',
    en: 'User Name',
    bg: 'Име на потребителя'
  },
  datum: {
    de: 'Datum',
    en: 'Date',
    bg: 'Дата'
  },
  alter: {
    de: 'Alter',
    en: 'Age',
    bg: 'Възраст'
  },
  referenzbereich: {
    de: 'Referenzbereich',
    en: 'Reference Range',
    bg: 'Референтен диапазон'
  },
  messwert: {
    de: 'Messwert',
    en: 'Measured Value',
    bg: 'Измерена стойност'
  },
  risikoeinschaetzung: {
    de: 'Risikoeinschätzung',
    en: 'Risk Assessment',
    bg: 'Оценка на риска'
  },
  normbereich: {
    de: 'Normbereich',
    en: 'Normal Range',
    bg: 'Нормален диапазон'
  },
  abweichung: {
    de: 'Abweichung',
    en: 'Deviation',
    bg: 'Отклонение'
  },
  trainingszonen: {
    de: 'Trainingszonen',
    en: 'Training Zones',
    bg: 'Тренировъчни зони'
  },
  // 🔹 2026-08-14 — Trainingsbereich table (per "3.34 CCC Laktatkurve und
  // Trainingsbereich"): title + column headers for TrainingsbereichComponent.tsx
  trainingsbereich_titel_text: {
    de: 'TRAININGSBEREICH',
    en: 'TRAINING ZONE',
    bg: 'ТРЕНИРОВЪЧНА ЗОНА'
  },
  prozent_der_ians_text: {
    de: '% der IANS',
    en: '% of IANS',
    bg: '% от IANS'
  },
  mmol_liter_text: {
    de: 'mmol/Liter',
    en: 'mmol/Liter',
    bg: 'mmol/литър'
  },
  belastungsbereiche: {
    de: 'Belastungsbereiche',
    en: 'Load Zones',
    bg: 'Зони на натоварване'
  },
  leistungsbereich: {
    de: 'Leistungsbereich',
    en: 'Performance Range',
    bg: 'Диапазон на представяне'
  },
  rechenverfahren: {
    de: 'Rechenverfahren',
    en: 'Calculation Method',
    bg: 'Метод на изчисление'
  },
  keul_modell: {
    de: 'Keul Modell',
    en: 'Keul Model',
    bg: 'Модел на Кеул'
  },
  freiburger_modell: {
    de: 'Freiburger Modell',
    en: 'Freiburg Model',
    bg: 'Модел на Фрайбург'
  },
  dichut_modell: {
    de: 'Dichut Modell',
    en: 'Dichut Model',
    bg: 'Модел на Дикхут'
  },
  stueckweise_linear: {
    de: 'Stückweise linear',
    en: 'Piecewise Linear',
    bg: 'Частично линеен'
  },
  daten_erfassung: {
    de: 'Daten Erfassung',
    en: 'Data Recording',
    bg: 'Въвеждане на данни'
  },
  stufe: {
    de: 'Stufe',
    en: 'Stage',
    bg: 'Степен'
  },
  zeitpunkt: {
    de: 'Zeitpunkt',
    en: 'Timepoint',
    bg: 'Времева точка'
  },
  laktat: {
    de: 'Laktat',
    en: 'Lactate',
    bg: 'Лактат'
  },
  leistung: {
    de: 'Leistung',
    en: 'Performance',
    bg: 'Представяне'
  },
  grund_belastung: {
    de: 'Grund Belastung',
    en: 'Basic Load',
    bg: 'Базово натоварване'
  },
  belastungs_inkrement: {
    de: 'Belastungs-Inkrement',
    en: 'Load Increment',
    bg: 'Прираст на натоварването'
  },
  zeit_inkrement: {
    de: 'Zeit Inkrement',
    en: 'Time Increment',
    bg: 'Времеви прираст'
  },
  laktat_kurve: {
    de: 'Laktat Kurve',
    en: 'Lactate Curve',
    bg: 'Лактатна крива'
  },
  name: {
    de: 'Name',
    en: 'Name',
    bg: 'Име'
  },
  testdatum: {
    de: 'Testdatum',
    en: 'Test Date',
    bg: 'Дата на теста'
  },
  dialog: {
    de: 'Dialog',
    en: 'Dialogue',
    bg: 'Диалог'
  },
  kopf: {
    de: 'KOPF',
    en: 'Head',
    bg: 'ГЛАВА'
  },
  wirbelsaeule: {
    de: 'WIRBELSÄULE',
    en: 'Spine',
    bg: 'ГРЪБНАЧЕН СТЪЛБ'
  },
  schulter: {
    de: 'SCHULTER',
    en: 'Shoulder',
    bg: 'РАМО'
  },
  becken: {
    de: 'BECKEN',
    en: 'Pelvis',
    bg: 'ТАЗ'
  },
  knie: {
    de: 'KNIE',
    en: 'Knee',
    bg: 'КОЛЯНО'
  },
  fuss: {
    de: 'FUß',
    en: 'Foot',
    bg: 'СТЪПАЛО'
  },
  schwer: {
    de: 'schwer',
    en: 'severe',
    bg: 'тежък'
  },
  mittelschwer: {
    de: 'mittelschwer',
    en: 'moderate',
    bg: 'умерен'
  },
  leicht: {
    de: 'leicht',
    en: 'mild',
    bg: 'лек'
  },
  normal: {
    de: 'normal',
    en: 'normal',
    bg: 'нормален'
  },

  // 🔹 2026-08-19 — MUFU (Muskel-Funktion/Körper-Haltung, "3.05 Neuer Test -
  // MUFU" мокъп): DK поиска KRAFT (сила) таблицата с интерактивна снимка на
  // тялото (виж MuskelFunktionKraftComponent.tsx) + Körper-Haltung с
  // WIRBELSÄULE (реизползва вече готовия BeuterlungTable.tsx).
  beurteilung_text: {
    de: 'BEURTEILUNG',
    en: 'ASSESSMENT',
    bg: 'ОЦЕНКА'
  },
  kraft_text: {
    de: 'KRAFT',
    en: 'STRENGTH',
    bg: 'СИЛА'
  },
  dehnbarkeit_text: {
    de: 'DEHNBARKEIT',
    en: 'FLEXIBILITY',
    bg: 'ЕЛАСТИЧНОСТ'
  },
  beweglichkeit_text: {
    de: 'BEWEGLICHKEIT',
    en: 'MOBILITY',
    bg: 'ПОДВИЖНОСТ'
  },
  mufu_placeholder_text: {
    de: 'Noch nicht implementiert.',
    en: 'Not implemented yet.',
    bg: 'Все още не е реализирано.'
  },

  // 🔹 2026-08-27 (Europe/Sofia) — DK: "нещата в списъка, не са преведени
  // Kopfschiefstand, Kopfvorhaltung... на български" + "тези също ...
  // Lordose Kyphose... и останалите". Row labels in
  // constants/koerperHaltungSections.js (WIRBELSÄULE/KOPF/SCHULTER/BECKEN/
  // KNIE/FUSS tables, rendered by BeuterlungTable.tsx and looked up again
  // by KoerperHaltungAuswertungComponent.tsx) were plain hardcoded German
  // strings, never routed through LanguageUtil. Added a labelKey per row
  // (see that file) pointing at these; `de` here keeps the exact original
  // German term so nothing visually changes for DE users.
  koerperhaltung_lordose_text: {
    de: 'Lordose',
    en: 'Lordosis',
    bg: 'Лордоза'
  },
  koerperhaltung_skoliose_text: {
    de: 'Skoliose',
    en: 'Scoliosis',
    bg: 'Сколиоза'
  },
  koerperhaltung_kyphose_text: {
    de: 'Kyphose',
    en: 'Kyphosis',
    bg: 'Кифоза'
  },
  koerperhaltung_schiefhals_text: {
    de: 'Schiefhals',
    en: 'Torticollis',
    bg: 'Кривошия'
  },
  koerperhaltung_steilstellung_text: {
    de: 'Steilstellung',
    en: 'Straightening',
    bg: 'Изправяне на кривината'
  },
  koerperhaltung_kopfschiefstand_text: {
    de: 'Kopfschiefstand',
    en: 'Head Tilt',
    bg: 'Наклон на главата'
  },
  koerperhaltung_kopfvorhaltung_text: {
    de: 'Kopfvorhaltung',
    en: 'Forward Head Posture',
    bg: 'Глава напред'
  },
  koerperhaltung_kopfrotation_text: {
    de: 'Kopfrotation',
    en: 'Head Rotation',
    bg: 'Ротация на главата'
  },
  koerperhaltung_schulterhochstand_rechts_text: {
    de: 'Schulterhochstand rechts',
    en: 'Right Shoulder Elevation',
    bg: 'Повдигнато дясно рамо'
  },
  koerperhaltung_schulterhochstand_links_text: {
    de: 'Schulterhochstand links',
    en: 'Left Shoulder Elevation',
    bg: 'Повдигнато ляво рамо'
  },
  koerperhaltung_schulterprotraktion_text: {
    de: 'Schulterprotraktion',
    en: 'Shoulder Protraction',
    bg: 'Протракция на раменете'
  },
  koerperhaltung_schulterasymmetrie_text: {
    de: 'Schulterasymmetrie',
    en: 'Shoulder Asymmetry',
    bg: 'Асиметрия на раменете'
  },
  koerperhaltung_beckenschiefstand_text: {
    de: 'Beckenschiefstand',
    en: 'Pelvic Obliquity',
    bg: 'Наклонен таз'
  },
  koerperhaltung_beckenkippung_anterior_text: {
    de: 'Beckenkippung anterior',
    en: 'Anterior Pelvic Tilt',
    bg: 'Преден наклон на таза'
  },
  koerperhaltung_beckenkippung_posterior_text: {
    de: 'Beckenkippung posterior',
    en: 'Posterior Pelvic Tilt',
    bg: 'Заден наклон на таза'
  },
  koerperhaltung_beckenrotation_text: {
    de: 'Beckenrotation',
    en: 'Pelvic Rotation',
    bg: 'Ротация на таза'
  },
  koerperhaltung_genu_valgum_text: {
    de: 'Genu valgum',
    en: 'Genu Valgum',
    bg: 'Genu valgum (Х-крака)'
  },
  koerperhaltung_genu_varum_text: {
    de: 'Genu varum',
    en: 'Genu Varum',
    bg: 'Genu varum (О-крака)'
  },
  koerperhaltung_genu_recurvatum_text: {
    de: 'Genu recurvatum',
    en: 'Genu Recurvatum',
    bg: 'Genu recurvatum (хиперекстензия)'
  },
  koerperhaltung_senkfuss_text: {
    de: 'Senkfuß',
    en: 'Fallen Arch',
    bg: 'Спаднал свод'
  },
  koerperhaltung_spreizfuss_text: {
    de: 'Spreizfuß',
    en: 'Splayfoot',
    bg: 'Напречно плоскостъпие'
  },
  koerperhaltung_hohlfuss_text: {
    de: 'Hohlfuß',
    en: 'High Arch (Pes Cavus)',
    bg: 'Кухо стъпало'
  },
  koerperhaltung_knickfuss_text: {
    de: 'Knickfuß',
    en: 'Heel Valgus',
    bg: 'Валгусна пета'
  },
  koerperhaltung_plattfuss_text: {
    de: 'Plattfuß',
    en: 'Flat Foot',
    bg: 'Плоскостъпие'
  },

  // 🔹 10-те мускула от KRAFT таблицата, реда точно както в мокъпа
  oberarmbeuger_text: {
    de: 'Oberarmbeuger',
    en: 'Elbow flexors',
    bg: 'Флексори на лакътя'
  },
  oberarmstrecker_text: {
    de: 'Oberarmstrecker',
    en: 'Elbow extensors',
    bg: 'Екстензори на лакътя'
  },
  schulterblattfixatoren_text: {
    de: 'Schulterblattfixatoren',
    en: 'Scapula fixators',
    bg: 'Фиксатори на лопатката'
  },
  schulterabduktion_text: {
    de: 'Schulterabduktion',
    en: 'Shoulder abduction',
    bg: 'Абдукция на рамото'
  },
  bwsstrecker_text: {
    de: 'BWS-Strecker',
    en: 'Thoracic spine extensors',
    bg: 'Екстензори на гръдния отдел на гръбнака'
  },
  lwsstrecker_text: {
    de: 'LWS-Strecker',
    en: 'Lumbar spine extensors',
    bg: 'Екстензори на поясния отдел на гръбнака'
  },
  gesaessmuskulatur_text: {
    de: 'Gesäßmuskulatur',
    en: 'Gluteal muscles',
    bg: 'Глутеална мускулатура'
  },
  beinabduktor_text: {
    de: 'Beinabduktor',
    en: 'Leg abductor',
    bg: 'Абдуктор на крака'
  },
  mquadriceps_text: {
    de: 'M. quadriceps',
    en: 'Quadriceps',
    bg: 'Квадрицепс'
  },
  mischiocruralis_text: {
    de: 'M. ischiocruralis',
    en: 'Hamstrings',
    bg: 'Задна повърхност на бедрото (хамстринг)'
  },
  bauchmuskulatur_text: {
    de: 'Bauchmuskulatur',
    en: 'Abdominal muscles',
    bg: 'Коремна мускулатура'
  },

  speichern: {
    de: 'Speichern',
    en: 'Save',
    bg: 'Запази'
  },
  // 🔹 2026-08-21 (Claude) — DK: "трябва да сложим [Save бутон] ... тук,
  // както и на предната страница" (Training таба) — краткотрайно
  // потвърждение "✓ Записано", показвано на самия Save бутон за 1.5 сек
  // (виж saveNow() в TrainingsplanComponent.tsx).
  saved_confirmation_text: {
    de: 'Gespeichert ✓',
    en: 'Saved ✓',
    bg: 'Запазено ✓'
  },
  zuruecksetzen: {
    de: 'Zurücksetzen',
    en: 'Reset',
    bg: 'Нулиране'
  },
  schliessen: {
    de: 'Schließen',
    en: 'Close',
    bg: 'Затвори'
  },
  oeffnen: {
    de: 'Öffnen',
    en: 'Open',
    bg: 'Отвори'
  },
  importieren: {
    de: 'Importieren',
    en: 'Import',
    bg: 'Импортирай'
  },
  bearbeiten: {
    de: 'Bearbeiten',
    en: 'Edit',
    bg: 'Редактирай'
  },  
  neue_schreiben: {
    de: 'Neue schreiben',
    en: 'Write new',
    bg: 'Напиши нов'
  },
  verschieben: {
    de: 'Verschieben',
    en: 'Move',
    bg: 'Премести'
  },
  loeschen: {
    de: 'Löschen',
    en: 'Delete',
    bg: 'Изтрий'
  },
  uebernehmen: {
    de: 'Übernehmen',
    en: 'Apply',
    bg: 'Приложи'
  },
  ratschlaege: {
    de: 'Ratschläge',
    en: 'Recommendations',
    bg: 'Препоръки'
  },
  ja: {
    de: 'ja',
    en: 'yes',
    bg: 'да'
  },
  nein: {
    de: 'nein',
    en: 'no',
    bg: 'не'
  },
  montag: {
    de: 'Montag',
    en: 'Monday',
    bg: 'Понеделник'
  },
  dienstag: {
    de: 'Dienstag',
    en: 'Tuesday',
    bg: 'Вторник'
  },
  mittwoch: {
    de: 'Mittwoch',
    en: 'Wednesday',
    bg: 'Сряда'
  },
  donnerstag: {
    de: 'Donnerstag',
    en: 'Thursday',
    bg: 'Четвъртък'
  },
  freitag: {
    de: 'Freitag',
    en: 'Friday',
    bg: 'Петък'
  },
  samstag: {
    de: 'Samstag',
    en: 'Saturday',
    bg: 'Събота'
  },
  sonntag: {
    de: 'Sonntag',
    en: 'Sunday',
    bg: 'Неделя'
  },

  // 🔹 2026-08-20 — "Training – Gesundheit" модул (Training/❤️ страница,
  // Page10.tsx/TrainingsplanComponent.tsx/TrainingsplanKeinTestComponent.tsx)
  // — 5 нови PDF-а, план обсъден с DK преди имплементация.
  kein_test_text: {
    de: 'Kein Test',
    en: 'No Test',
    bg: 'Без тест'
  },
  training_ergometrie_text: {
    de: 'Ergometrie',
    en: 'Ergometry',
    bg: 'Ергометрия'
  },
  training_laktat_ergometrie_text: {
    de: 'Laktat Ergometrie',
    en: 'Lactate Ergometry',
    bg: 'Лактатна ергометрия'
  },
  training_spiro_ergometrie_text: {
    de: 'Spiro Ergometrie',
    en: 'Spiro Ergometry',
    bg: 'Спироергометрия'
  },
  // 🔹 2026-08-21 (Claude) — DK: "лактат ергометри" (5.25b мокъп) — IAS/
  // LTP1 и IANS/LTP2 са установени медицински съкращения (Individuelle
  // Aerobe/Anaerobe Schwelle, Lactate Threshold Point 1/2) — оставени
  // непреведени и на двата езика, точно както в мокъпа.
  ias_ltp1_text: {
    de: 'IAS/LTP1',
    en: 'IAS/LTP1',
    bg: 'IAS/LTP1'
  },
  ians_ltp2_text: {
    de: 'IANS/LTP2',
    en: 'IANS/LTP2',
    bg: 'IANS/LTP2'
  },
  // 🔹 2026-08-21 (Claude) — "остана последният — Spiro Ergometrie" —
  // VT1/VT2 (Ventilatory Threshold 1/2) — установени медицински
  // съкращения, непреведени и на двата езика, точно като IAS/IANS.
  vt1_text: {
    de: 'VT1',
    en: 'VT1',
    bg: 'VT1'
  },
  vt2_text: {
    de: 'VT2',
    en: 'VT2',
    bg: 'VT2'
  },
  hfruhe_text: {
    de: 'HFruhe',
    en: 'HR rest',
    bg: 'СЧ покой'
  },
  hfmax_text: {
    de: 'HFmax.',
    en: 'HR max.',
    bg: 'СЧ макс.'
  },
  watt_max_text: {
    de: 'Watt max.',
    en: 'Watt max.',
    bg: 'Watt макс.'
  },
  kmh_max_text: {
    de: 'km/h max.',
    en: 'km/h max.',
    bg: 'km/h макс.'
  },
  radfahren_text: {
    de: 'Radfahren',
    en: 'Cycling',
    bg: 'Колоездене'
  },
  laufen_text: {
    de: 'Laufen',
    en: 'Running',
    bg: 'Бягане'
  },
  trainingsbereich_text: {
    de: 'Trainingsbereich',
    en: 'Training zone',
    bg: 'Тренировъчна зона'
  },
  // 🔹 2026-08-21 (Claude) — DK: "ергометрия" таб (5.24b мокъп) — ляво
  // меню REHABILITATION/GESUNDHEITSSPORT/FREIZEITSPORT (виж
  // TrainingsplanComponent.tsx). gesundheitssport_text/freizeitsport_text
  // вече съществуваха (реизползвани и като GA1/GA2 етикети в Kein Test
  // таба) — само rehabilitation_text липсваше.
  rehabilitation_text: {
    de: 'REHABILITATION',
    en: 'REHABILITATION',
    bg: 'РЕХАБИЛИТАЦИЯ'
  },
  gesundheitssport_text: {
    de: 'GESUNDHEITSSPORT',
    en: 'HEALTH SPORT',
    bg: 'ЗДРАВЕН СПОРТ'
  },
  freizeitsport_text: {
    de: 'FREIZEITSPORT',
    en: 'LEISURE SPORT',
    bg: 'СПОРТ ЗА СВОБОДНОТО ВРЕМЕ'
  },
  stufe_text: {
    de: 'Stufe',
    en: 'Stage',
    bg: 'Степен'
  },
  wntz_text: {
    de: 'WNTZ',
    en: 'WNTZ',
    bg: 'WNTZ'
  },
  wntz_minuten_text: {
    de: 'WNTZ Minuten',
    en: 'WNTZ minutes',
    bg: 'WNTZ минути'
  },
  dauer_te_minuten_text: {
    de: 'Dauer/TE Minuten',
    en: 'Duration/session minutes',
    bg: 'Продължителност/сесия минути'
  },
  te_woche_haeufigkeit_text: {
    de: 'TE/Woche Häufigkeit',
    en: 'Sessions/week frequency',
    bg: 'Сесии/седмица честота'
  },
  zeit_aufteilung_text: {
    de: 'Zeit Aufteilung % Trainingsbereich',
    en: 'Time split % training zone',
    bg: 'Разпределение на времето % тренировъчна зона'
  },
  trainingsblock_wochen_text: {
    de: 'Trainingsblock Wochen',
    en: 'Training block weeks',
    bg: 'Тренировъчен блок седмици'
  },
  vorlage_a_text: {
    de: 'Vorlage A',
    en: 'Template A',
    bg: 'Шаблон A'
  },
  vorlage_b_text: {
    de: 'Vorlage B',
    en: 'Template B',
    bg: 'Шаблон B'
  },
  vorlage_c_text: {
    de: 'Vorlage C',
    en: 'Template C',
    bg: 'Шаблон C'
  },
  automatik_ein_aus_text: {
    de: 'Automatik EIN / AUS',
    en: 'Automatic ON / OFF',
    bg: 'Автоматика ВКЛ / ИЗКЛ'
  },
  nicht_gewaehlte_bereiche_ausblenden_text: {
    de: 'Nicht gewählte Bereiche ausblenden',
    en: 'Hide unselected areas',
    bg: 'Скрий неизбраните зони'
  },
  trainings_woche_gestalten_text: {
    de: 'Trainings-Woche GESTALTEN',
    en: 'DESIGN training week',
    bg: 'ОФОРМИ тренировъчна седмица'
  },
  // 🔹 2026-08-25 (Claude) — hint под бутона "Trainings-Woche GESTALTEN",
  // за да е по-очевидно че той отключва редакция на полетата (DK доклад).
  // ЗАБЕЛЕЖКА: първия опит да добавя този ключ отпадна незабелязано —
  // презаписах локалния файл с device_stage_files СЛЕД като го бях
  // редактирал, преди да го изпратя обратно (виж git история/DK разговор
  // 2026-08-26) — ключът реално никога не стигна до устройството. Сега е
  // добавен наново, коректно.
  trainings_woche_gestalten_hint_text: {
    de: 'Drücken, um die Felder zu bearbeiten',
    en: 'Press to edit the fields',
    bg: 'Натиснете, за да редактирате полетата'
  },
  // 🔹 2026-08-26 (Claude) — DK: "нека направим принт страница с текущите
  // и налични данни от трейнинг и лактатните криви" — нов PrintReportComponent.tsx,
  // достъпен от бутона по-долу в лявото контролно табло на Training страницата.
  print_report_button_text: {
    de: 'Bericht DRUCKEN',
    en: 'PRINT report',
    bg: '🖨 ПРИНТИРАЙ доклад'
  },
  print_report_title_text: {
    de: 'Trainingsplan- und Laktatkurve-Bericht',
    en: 'Training plan & lactate curve report',
    bg: 'Доклад: тренировъчен план и лактатна крива'
  },
  print_report_generated_on_text: {
    de: 'Erstellt am',
    en: 'Generated on',
    bg: 'Генериран на'
  },
  print_report_no_lactate_data_text: {
    de: 'Für diesen Patienten wurden noch keine Laktatkurve-Daten erfasst.',
    en: 'No lactate curve data has been entered for this patient yet.',
    bg: 'Все още няма въведени данни за лактатна крива за този пациент.'
  },
  print_report_ias_text: {
    de: 'Aerobe Schwelle (IAS)',
    en: 'Aerobic threshold (IAS)',
    bg: 'Аеробен праг (IAS)'
  },
  print_report_ians_text: {
    de: 'Anaerobe Schwelle (IANS)',
    en: 'Anaerobic threshold (IANS)',
    bg: 'Анаеробен праг (IANS)'
  },
  print_report_lactate_mmol_text: {
    de: 'Laktat (mmol/l)',
    en: 'Lactate (mmol/l)',
    bg: 'Лактат (mmol/l)'
  },
  print_report_heart_rate_text: {
    de: 'Herzfrequenz (Schl./min)',
    en: 'Heart rate (bpm)',
    bg: 'Пулс (уд/мин)'
  },
  print_report_active_stages_only_text: {
    de: 'Nur aktive Stufen gezeigt',
    en: 'Only active stages shown',
    bg: 'Показани са само активните етапи'
  },
  print_report_patient_id_text: {
    de: 'Patienten-ID',
    en: 'Patient ID',
    bg: 'Идентификатор на пациент'
  },
  // 🔹 2026-08-28 (Claude) — PrintFullReportComponent.tsx (замества
  // счупения PrintTestPanel.jsx печат бутон): заглавие на новия пълен
  // доклад + "Full report"/"Only available measurements" превключвателя,
  // виж компонента за пълния разбор.
  print_full_report_title_text: {
    de: 'Vollständiger Mess-Bericht',
    en: 'Full Measurement Report',
    bg: 'Пълен доклад за измерванията'
  },
  print_full_report_mode_full_text: {
    de: 'Vollständiger Bericht',
    en: 'Full report',
    bg: 'Пълен доклад'
  },
  print_full_report_mode_available_text: {
    de: 'Nur vorhandene Messungen',
    en: 'Only available measurements',
    bg: 'Само наличните измервания'
  },
  // 🔹 2026-08-30 (Claude) — DK: "сложи бутони до другите, така че да
  // може да принтираме, всяка от страници с енейбъл/дизейбъл" — раздел
  // enable/disable чипове + "Само Х" бързи бутони, виж SECTION_DEFS в
  // PrintFullReportComponent.tsx.
  print_full_report_sections_label_text: {
    de: 'Abschnitte zum Drucken',
    en: 'Sections to print',
    bg: 'Раздели за печат'
  },
  print_full_report_only_text: {
    de: 'Nur',
    en: 'Only',
    bg: 'Само'
  },
  print_full_report_select_all_text: {
    de: 'Alle Abschnitte',
    en: 'All sections',
    bg: 'Всички раздели'
  },
  leere_tabellen_text: {
    de: 'LEERE Tabellen',
    en: 'EMPTY tables',
    bg: 'ПРАЗНИ таблици'
  },
  personenspezifische_standardwerte_text: {
    de: 'Personenspezifische Standardwerte',
    en: 'Person-specific defaults',
    bg: 'Персонални стойности по подразбиране'
  },
  abrufen_text: {
    de: 'Abrufen',
    en: 'Retrieve',
    bg: 'Извлечи'
  },
  wntz_erklaerung_text: {
    de: 'Wöchentliche Netto-Trainingszeit: gesamte geplante Trainingszeit pro Woche ohne organisatorische Pausen.',
    en: 'Weekly net training time: total planned training time per week, excluding organisational breaks.',
    bg: 'Седмично нетно тренировъчно време: общо планирано тренировъчно време за седмица без организационни паузи.'
  },
  dauer_te_erklaerung_text: {
    de: 'Effektive Belastungsdauer einer einzelnen Trainingseinheit.',
    en: 'Effective load duration of a single training session.',
    bg: 'Ефективна продължителност на натоварване за една тренировъчна единица.'
  },
  te_woche_erklaerung_text: {
    de: 'Häufigkeit - Anzahl der Trainingseinheiten pro Kalenderwoche. Minimum-Maximum-Empfehlung (z.B. 2–3 Trainingseinheiten pro Woche)',
    en: 'Frequency - number of training sessions per calendar week. Minimum-maximum recommendation (e.g. 2–3 sessions per week)',
    bg: 'Честота - брой тренировъчни единици на календарна седмица. Препоръка мин.-макс. (напр. 2–3 тренировъчни единици седмично)'
  },
  zeit_aufteilung_erklaerung_text: {
    de: '90 % der Train.-Zeit im Bereich GA1 und 10 % der Train.-Zeit im Bereich GA2',
    en: '90% of training time in the GA1 zone and 10% of training time in the GA2 zone',
    bg: '90% от тренировъчното време в зона GA1 и 10% от тренировъчното време в зона GA2'
  },
  trainingsblock_erklaerung_text: {
    de: 'Zeitraum, in dem die Trainingsstufe vor einer Steigerung auf die nächste Stufe durchgeführt werden soll.',
    en: 'Period during which the training stage should be maintained before progressing to the next stage.',
    bg: 'Период, през който тренировъчната степен трябва да се поддържа преди преминаване към следващата степен.'
  },

  // 🔹 2026-08-25 (Europe/Sofia) — DK: "навсякъде преводи на български" +
  // "нека има опция български в сетингс". Нови ключове за местата, които
  // досега изобщо не минаваха през LanguageUtil (hardcoded низове в
  // LoginScreen.js/SettingsComponent.tsx/InfoPopUpComponent.tsx) — виж
  // changelog-овете на тези файлове.
  login_text: {
    de: 'Anmelden',
    en: 'Login',
    bg: 'Вход'
  },
  english_text: {
    de: 'Englisch',
    en: 'English',
    bg: 'Английски'
  },
  german_text: {
    de: 'Deutsch',
    en: 'German',
    bg: 'Немски'
  },
  bulgarian_text: {
    de: 'Bulgarisch',
    en: 'Bulgarian',
    bg: 'Български'
  },
  language_text: {
    de: 'Sprache',
    en: 'Language',
    bg: 'Език'
  },
  source_text: {
    de: 'Quelle',
    en: 'Source',
    bg: 'Източник'
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

