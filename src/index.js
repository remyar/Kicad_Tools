import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from "react-router-dom";
import { StoreProvider } from '@remyar/react-store';
import { NavigationProvider } from '@remyar/react-navigation';
import { IntlProvider } from 'react-intl';
import { SnackbarProvider } from '@remyar/react-snackbar';

import localeData from './locales';

import App from "./app";
import api from './api';

(async () => {

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
    // const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.fr;

    const root = createRoot(document.getElementById('root'));

    function LocalizationWrapper() {

        const [locale, setLocale] = useState(languageWithoutRegionCode);

        return <IntlProvider locale={languageWithoutRegionCode} messages={localeData[locale] || localeData[language] || localeData.fr}>
            <SnackbarProvider>
                <App
                    onLocaleChange={(locale) => { setLocale(locale) }}
                />
            </SnackbarProvider>
        </IntlProvider>
    }

    root.render(
        <React.Fragment>
            <StoreProvider
                extra={{
                    api
                }}
                globalState={{
                    user: {
                        translateInLocale: true,
                        locale: "en"
                    }
                }}>
                <MemoryRouter>
                    <NavigationProvider>
                        <LocalizationWrapper />
                    </NavigationProvider>
                </MemoryRouter>
            </StoreProvider>
        </React.Fragment>
    );

})();