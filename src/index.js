import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from "react-router-dom";
import NavigationProvider from './providers/navigation';
import StoreProvider from './providers/StoreProvider';
import SnackBarGenerator from './providers/snackBar';
import CssBaseline from '@mui/material/CssBaseline';

import api from "./api";

const electron = require('@electron/remote')

// i18n datas
import localeData from './locales';

// WHITELIST
const persistConfig = {
    key: 'kicadTools',
    persist: true,
    whitelist: [
        "settings"
    ]
};



// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;

window.userLocale = language;

// Split locales with a region code
let languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

window.userLocaleWithoutRegionCode = languageWithoutRegionCode;
localeData.setLocale(languageWithoutRegionCode);
// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <StoreProvider extra={{ api, electron }} persistConfig={persistConfig} globalState={{ settings: { locale: "en" }, bom: { fields : [] } }}>
            <MemoryRouter>
                <NavigationProvider>
                    <IntlProvider locale={language} messages={messages}>
                        <SnackBarGenerator>
                            <App />
                        </SnackBarGenerator>
                    </IntlProvider>
                </NavigationProvider>
            </MemoryRouter>
        </StoreProvider>
    </React.StrictMode>,
    document.getElementById('root')
);