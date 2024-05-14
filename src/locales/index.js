/**
 * Load locales, send back object
 */
import en from './en.json';
import fr from './fr.json';

let actualLocale = 'en';

const data = [
    { language: "French", code: "fr" },
    { language: "English", code: "en" },
]

function setLanguage(language) {
    let d = data.find((el) => el.language == language);
    setLocale( d ? d.code : 'en' );
    return actualLocale;
}

function getLanguages() {
    return data;
}

function setLocale(code) {
    actualLocale = code;
}

function getLocale(code = actualLocale) {
    return actualLocale;
}

export default {
    setLocale,
    getLocale,
    setLanguage,
    getLanguages,
    en,
    fr,
};