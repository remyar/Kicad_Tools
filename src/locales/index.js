/**
 * Load locales, send back object
 */
import { registerLocale, setDefaultLocale } from "react-datepicker";
import frDatepicker from 'date-fns/esm/locale/fr';
import enDatepicker from 'date-fns/esm/locale/en-US';
import esDatepicker from 'date-fns/esm/locale/es';
import itDatepicker from 'date-fns/esm/locale/it';

import en from './en.json';
import fr from './fr.json';

let actualLocale = 'en';

let DatePickerLang = [
    frDatepicker,
    enDatepicker,
];

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
    registerLocale(code, DatePickerLang.find((el) => el.code === code));
    actualLocale = code;
}

function getLocale(code = actualLocale) {
    return DatePickerLang.find((el) => el.code === code);
}

export default {
    setLocale,
    getLocale,
    setLanguage,
    getLanguages,
    en,
    fr,
};