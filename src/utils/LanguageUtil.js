import Translations from "./translations"


class LanguageUtil {

  static language = 'en'

  static setLanguage(value) {
    LanguageUtil.language = value
  }

  static getName(key) {

    const item = Translations.translations[key]

    if (!item) return key

    return item[LanguageUtil.language] || key
  }
}

export default LanguageUtil