import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import LanguageUtil from '../../utils/LanguageUtil'

import Page1 from '../pages/Page1'
import Page2 from '../pages/Page2'
import Page3 from '../pages/Page3'
import Page4 from '../pages/Page4'
import Page5 from '../pages/Page5'
import Page6 from '../pages/Page6'
import Page7 from '../pages/Page7'
import Page8 from '../pages/Page8'
import Page9 from '../pages/Page9'
import Page10 from '../pages/Page10'
import Page11 from '../pages/Page11'
import Page12 from '../pages/Page12'
import SettingsComponent from '../pages/SettingsComponent'

// 🔹 2026-08-17 (Europe/Sofia) — Икон-лента вместо текстови бутони, по
// модел на референтния тулбар от PDF-овете ("3.33/3.34 CCC Laktatkurve").
// Съответствието страница→икона идва директно от старите имена на
// бутоните по-долу (напр. "Page 5 - Save", "Page 11 - Laktat"), които вече
// бяха оставени от предишна разработка като подсказка какво трябва да е
// всяка страница. DK потвърди: първите 12 страници (Page1-Page12) са ОК
// така — без react-native-vector-icons/react-native-svg в проекта, затова
// иконите са Unicode emoji glyph-ове (работят навсякъде без нова
// зависимост), не буквални копия на оригиналните графики от PDF-а.
//
// 🔹 2026-08-17 (по-късно същия ден) — labelKey вместо hardcoded label:
// DK забеляза (през скрийншот), че менюто излиза немско, докато
// останалата част от приложението е на английски — защото label-ите тук
// бяха hardcoded немски низове, вместо да минат през LanguageUtil/
// Translations.js system-а като всичко останало. Виж новите nav_*_text
// ключове в Translations.js.
const NAV_ITEMS = [
  { page: 'page1', icon: '🧑‍➕', labelKey: 'nav_neuer_patient_text' },
  { page: 'page2', icon: '🧑‍✖️', labelKey: 'nav_patient_aktualisieren_text' },
  { page: 'page3', icon: '👥', labelKey: 'nav_page3_text' },
  { page: 'page4', icon: '🔍', labelKey: 'nav_patient_suchen_text' },
  { page: 'page5', icon: '💾', labelKey: 'nav_speichern_text' },
  { page: 'page6', icon: '🖨️', labelKey: 'nav_drucken_text' },
  { page: 'page7', icon: '🔎', labelKey: 'nav_page7_text' },
  { page: 'page8', icon: '📈', labelKey: 'nav_page8_text' },
  { page: 'page9', icon: '📋', labelKey: 'nav_ergebnisse_text' },
  { page: 'page10', icon: '❤️', labelKey: 'nav_training_text' },
  { page: 'page11', icon: '📊', labelKey: 'nav_laktatkurve_text' },
  { page: 'page12', icon: '🏃', labelKey: 'nav_page12_text' }
]

// 🔹 2026-08-18 (Europe/Sofia) — DK уточни изрично: 4-те под-бутона за
// Page11 ("Laktatkurve") трябва да са на HEADER ниво — второ ниво помощни
// бутони точно под главните 14, а не заровени долу вътре в Page11-ния
// scroll (виж handleShowUeberlagern-историята в Page11.tsx за предишния,
// отхвърлен опит). Показват се само докато page === 'page11'. Първият
// ("Aktuell") е старото поведение на Page11, непроменено; следващите 3
// рендират собствени компоненти вътре в Page11 (виж
// LaktatkurveUeberlagernComponent / LaktatkurveTrainingsbereichComponent /
// LaktatkurveRechenverfahrenComponent) — всяко за отделна тема от CCC PDF-ите.
const LACTATE_SUB_NAV_ITEMS = [
  { key: 'current', labelKey: 'ansicht_aktuell_text' },
  { key: 'ueberlagern', labelKey: 'ansicht_ueberlagern_text' },
  { key: 'trainingsbereich', labelKey: 'ansicht_trainingsbereich_text' },
  { key: 'rechenverfahren', labelKey: 'ansicht_rechenverfahren_text' }
]

// 🔹 2026-08-21 (Europe/Sofia) — DK: "не можем да сейвнем, ако всичко не
// е попълнено и останалите страници стоят дизейбълнати" (в контекста на
// gender-a да стане задължителен dropdown). "New Patient" (page1) и
// "Search Patient" (page4) са единствените две "намери/създай пациент"
// страници — те, плюс Settings/Log Out, трябва да останат достъпни дори
// докато формата в тях е непопълнена (иначе потребителят не може дори да
// излезе от нея). Всичко останало (Update/Delete Patient, Save, Print,
// Measurements, Results, Training, Lactate Curve и т.н.) изисква пълен,
// валиден пациент — виж navLocked/isNavItemDisabled по-долу.
const ALWAYS_ENABLED_PAGES = ['page1', 'page4']

// 🔹 2026-08-26 (Claude) — DK (по скрийншот на менюто): "махни или
// дизейбълни страниците, които засега не ги ползваме" — посочи изрично
// 5-те: "страница 3" (page3/👥), "страница запази" (page5/💾 Save —
// стар TestComponent1-7 scaffolding, никога довършен/свързан към
// реалния flow), "страница печат" (page6/🖨️ — стария отделен "Print"
// nav бутон; реалният печат вече живее в самите Training/Laktatkurve/
// Messungen страници, виж PrintReportComponent.tsx), "страницата 7"
// (page7/🔎) и "страница резултати" (page9/📋 — дублира page4-търсачката
// с бъгав `users[i].lastName` fix, никога реално ползвана). За разлика
// от navLocked по-долу (временно заключване, докато формата не е
// попълнена), тези са ПОСТОЯННО дизейбълнати — не зависят от
// navLocked/formValid. Лесно за връщане, ако някоя от тях влезе в
// реална употреба по-късно — просто маха се от списъка.
// 2026-08-31 (Claude) — 'page3' извадена оттук: DK одобри реалното
// "Табло за прогреса" на Page3.tsx и иска да може да го отвори от
// навигацията, за да го разгледа (виж TestProgressDashboardComponent.tsx).
const PERMANENTLY_DISABLED_PAGES = ['page5', 'page6', 'page7', 'page9']

export default function HomeScreen({ goTo }) {

  const [page, setPage] = useState('page4')

  // 🔹 активният под-изглед за Page11 ("Laktatkurve") — живее тук (не вътре
  // в Page11), защото бутоните за него вече са на header ниво тук.
  const [lactateSubView, setLactateSubView] = useState('current')

  // 🔹 попълва се от HeaderComponent.tsx (виж onValidityChange там) през
  // Page1/Page4 — true щом Last Name/First Name/Title/Date of Birth/
  // Gender са попълнени коректно. Стойността е "стара" (от последния път,
  // когато сме били на page1/page4) докато сме на друга страница, но това
  // няма значение — navLocked проверява и текущата `page`. Начална
  // стойност `false`, защото началният екран е 'page4' ("Search Patient")
  // с още неизбран пациент — формата реално не е валидна, преди
  // HeaderComponent да съобщи обратното; тръгване от `true` би дало кратък
  // "отключен" блясък на менюто при първо зареждане.
  const [formValid, setFormValid] = useState(false)

  const navLocked = (page === 'page1' || page === 'page4') && !formValid

  function isNavItemDisabled(itemPage) {
    if (PERMANENTLY_DISABLED_PAGES.includes(itemPage)) return true
    if (!navLocked) return false
    return !ALWAYS_ENABLED_PAGES.includes(itemPage)
  }

  function renderPage() {
    if (page === 'page1') return <Page1 goTo={goTo} onValidityChange={setFormValid} />
    if (page === 'page2') return <Page2 goTo={goTo} />
    if (page === 'page3') return <Page3 goTo={goTo} />
    if (page === 'page4') return <Page4 goTo={goTo} onValidityChange={setFormValid} />
    if (page === 'page5') return <Page5 goTo={goTo} />
    if (page === 'page6') return <Page6 goTo={goTo} />
    if (page === 'page7') return <Page7 goTo={goTo} />
    if (page === 'page8') return <Page8 goTo={goTo} />
    if (page === 'page9') return <Page9 goTo={goTo} />
    if (page === 'page10') return <Page10 goTo={goTo} />
    if (page === 'page11') return <Page11 goTo={goTo} activeChartView={lactateSubView} onChartViewChange={setLactateSubView} />
    if (page === 'page12') return <Page12 goTo={goTo} />
    if (page === 'settings') return <SettingsComponent goTo={goTo} />
  }

  return (
    <View style={styles.wrapper}>

      <View style={styles.header}>

        {NAV_ITEMS.map((item) => {
          const label = LanguageUtil.getName(item.labelKey)
          const disabled = isNavItemDisabled(item.page)
          const permanentlyDisabled = PERMANENTLY_DISABLED_PAGES.includes(item.page)
          const disabledHint = permanentlyDisabled
            ? LanguageUtil.getName('nav_not_available_text')
            : LanguageUtil.getName('nav_locked_hint_text')
          return (
            <TouchableOpacity
              key={item.page}
              style={[styles.iconButton, page === item.page && styles.iconButtonActive, disabled && styles.iconButtonDisabled]}
              onPress={() => setPage(item.page)}
              disabled={disabled}
              accessibilityLabel={label}
              title={disabled ? disabledHint : label}
            >
              <Text style={[styles.iconGlyph, disabled && styles.iconGlyphDisabled]}>{item.icon}</Text>
              <Text style={[styles.iconLabel, disabled && styles.iconLabelDisabled]} numberOfLines={1}>{label}</Text>
            </TouchableOpacity>
          )
        })}

        {/* 🔹 разделител преди служебните бутони — по модел на празнината
            в референтния тулбар преди Refresh/Book/Folder/Gear/Arrow */}
        <View style={styles.headerDivider} />

        <TouchableOpacity
          style={[styles.iconButton, page === 'settings' && styles.iconButtonActive]}
          onPress={() => setPage('settings')}
          accessibilityLabel={LanguageUtil.getName('nav_einstellungen_text')}
          title={LanguageUtil.getName('nav_einstellungen_text')}
        >
          <Text style={styles.iconGlyph}>⚙️</Text>
          <Text style={styles.iconLabel} numberOfLines={1}>{LanguageUtil.getName('nav_einstellungen_text')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => goTo('login')}
          accessibilityLabel={LanguageUtil.getName('nav_abmelden_text')}
          title={LanguageUtil.getName('nav_abmelden_text')}
        >
          <Text style={styles.iconGlyph}>🚪</Text>
          <Text style={styles.iconLabel} numberOfLines={1}>{LanguageUtil.getName('nav_abmelden_text')}</Text>
        </TouchableOpacity>

      </View>

      {/* 🔹 2026-08-18 — второ ниво помощни бутони, само за Page11
          ("Laktatkurve"), точно под главните 14 икон-бутона (не долу във
          scroll-а на Page11 — виж коментара при LACTATE_SUB_NAV_ITEMS). */}
      {page === 'page11' && (
        <View style={styles.subHeader}>
          {LACTATE_SUB_NAV_ITEMS.map((item) => {
            const label = LanguageUtil.getName(item.labelKey)
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.subNavChip, lactateSubView === item.key && styles.subNavChipActive]}
                onPress={() => setLactateSubView(item.key)}
              >
                <Text style={[styles.subNavChipText, lactateSubView === item.key && styles.subNavChipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}

      <View style={styles.content}>
        {renderPage()}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  wrapper: {
    //backgroundColor:"yellow",

    flex: 1,
      width: "100%",
      height: "100%",
    borderWidth: 1,
  },

  header: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    padding: 8,
    borderBottomWidth: 1,
    backgroundColor: '#eef2f7'
  },

  // 🔹 2026-08-17: DK — "по-widerшироки, по-удобни, както бяха предните"
  // (старите текстови Button()-и бяха широки pill-ове). Заменено от
  // квадратна 42x42 икон-кутийка на широк pill с икона + текст едно до
  // друго, минимална удобна ширина/височина за клик.
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 96,
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#9fb3c8',
    borderRadius: 10,
    backgroundColor: '#ffffff'
  },

  // 🔹 текущата страница — жълто подсветнато, като "Diagramm" бутона в
  // референтния PDF, когато е избран.
  iconButtonActive: {
    backgroundColor: '#fff176',
    borderColor: '#c9a800'
  },

  iconGlyph: {
    fontSize: 20
  },

  iconLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    maxWidth: 130
  },

  // 🔹 2026-08-21 — DK: "останалите страници стоят дизейбълнати" (докато
  // формата за нов/търсен пациент в page1/page4 не е напълно и коректно
  // попълнена — виж navLocked по-горе). Просто затъмняване + сив текст,
  // по модел на iconButtonActive по-горе.
  iconButtonDisabled: {
    opacity: 0.4
  },

  iconGlyphDisabled: {
    opacity: 0.6
  },

  iconLabelDisabled: {
    color: '#999'
  },

  headerDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#9fb3c8',
    marginHorizontal: 6
  },

  // 🔹 2026-08-18 — второ ниво помощни бутони (само за Page11/Laktatkurve),
  // визуално по-леко от главния header (по-тънки chip-ове, не квадратни
  // icon-бутони), за да е ясно че е под-навигация, не главно ниво.
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#dde3ea',
    backgroundColor: '#f7f9fb'
  },

  subNavChip: {
    borderWidth: 1,
    borderColor: '#9fb3c8',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff'
  },

  subNavChipActive: {
    backgroundColor: '#2f6fed',
    borderColor: '#2f6fed'
  },

  subNavChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#333'
  },

  subNavChipTextActive: {
    color: '#fff'
  },

  content: {
    flex: 1,
    padding: 20
  }

})