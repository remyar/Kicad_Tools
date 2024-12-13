/**
 * Load locales, send back object
 */
//import { registerLocale } from "react-datepicker";

//import esDatepicker from 'date-fns/locale/es';
//import itDatepicker from 'date-fns/locale/it';

import en from './en.json';
import fr from './fr.json';

let actualLocale = 'fr';

let DatePickerLang = [
];

const data = [
    { language: "French", code: "fr" },
    { language: "English", code: "en" },
]

function setLanguage(language) {
    let d = data.find((el) => el.language === language);
    setLocale(d ? d.code : 'fr');
    return actualLocale;
}

function getLanguage(){
    return data?.find((e) => e.code === actualLocale)?.language || "French";
}

function getCode(){
    return data?.find((e) => e.code === actualLocale)?.code || "fr";
}

function getLanguages() {
    return data;
}

function setLocale(code) {
   // registerLocale(code, DatePickerLang.find((el) => el.code === code));
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
    getLanguage,
    getCode,
    en,
    fr,
};