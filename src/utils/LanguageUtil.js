// ===== CLAUDE CHANGE LOG (newest last) =====
// 2026-08-25 (Europe/Sofia) — DK: "нека има опция български в сетингс и да
//   може когато цъкнем на него всичко да се преименува на бг". `language`
//   тук беше обикновено static class поле — SettingsComponent го сменяше,
//   но нищо не беше subscribe-нато за промяна, затова екраните не се
//   преренд(ваха реално, докато не навигираш другаде (React няма как да
//   разбере, че трябва да рисува наново само защото едно static поле е
//   мутирало). Преместено в Redux (store/settingsSlice.ts, `language`
//   поле) — тук вече само ЧЕТЕМ живо от store-а на всяко getName()
//   извикване; App.tsx е subscribe-нат през useSelector, за да предизвика
//   реален rerender на цялото дърво при dispatch(setLanguage(...)).
//   `setLanguage` тук е запазен като тънък съвместим wrapper (в случай, че
//   нещо друго още го вика директно), но вече dispatch-ва към Redux вместо
//   да мутира static поле.
// ============================================

import Translations from "./Translations"
import { store } from "../store/store"
import { setLanguage as setLanguageAction } from "../store/settingsSlice"


class LanguageUtil {

  static setLanguage(value) {
    store.dispatch(setLanguageAction(value))
  }

  static getName(key) {

    const language = store.getState().settings.language

    const item = Translations.translations[key]

    if (!item) return key

    return item[language] || key
  }
}

export default LanguageUtil