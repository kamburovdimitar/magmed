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

    archivieren_text: {
      de: 'Archivieren',
      en: 'Archive'
    },

    // 🔹 2026-08-14 — UI redesign: Archive бутонът вече показва различен
    // текст, когато текущите данни вече представляват съществуващ archive
    // запис (loadedReportId сетнат) — тогава Archive прави UPDATE вместо
    // да създава нов запис. Виж Page11.tsx saveIntoArchive_History().
    archiv_aktualisieren_text: {
      de: 'Archiv aktualisieren',
      en: 'Update Archive'
    },

    alle_daten_loeschen_text: {
      de: 'Alle Daten löschen',
      en: 'Clear all data'
    },

    testdaten_aus_szenario_text: {
      de: 'Testdaten aus Szenario generieren',
      en: 'Generate Fake Data From Test Scenario'
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
  speichern: {
    de: 'Speichern',
    en: 'Save'
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

