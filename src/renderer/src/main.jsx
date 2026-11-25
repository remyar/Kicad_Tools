import { useState, useEffect } from 'react';
import { StoreProvider } from '@remyar/react-store';
import { MemoryRouter } from 'react-router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useStore } from '@remyar/react-store';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { SnackbarProvider } from '@remyar/react-snackbar';

import App from './app.jsx';


import localeData from './locales/index.js';
import actions from 'actions';

let theme = createTheme({
    // Theme customization goes here as usual, including tonalOffset and/or
    // contrastThreshold as the augmentColor() function relies on these
});

(async () => {

    let initGlobalState = {
        application: {
            busy: false,
        },
        user: {
            translateInLocale: true,
            locale: "en"
        },
        settings: {
        }
    };

    // Define user's language. Different browsers have the user locale defined
    // on different fields on the `navigator` object, so we make sure to account
    // for these different by checking all of them
    const language = (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage;

    initGlobalState.user.locale = await window.store.get("user.locale", language);

    // Split locales with a region code
    let languageWithoutRegionCode = initGlobalState.user.locale.toLowerCase().split(/[_-]+/)[0];

    window.userLocaleWithoutRegionCode = languageWithoutRegionCode;
    window.userLocale = initGlobalState.user.locale;

    localeData.setLocale(languageWithoutRegionCode);

    const root = createRoot(document.getElementById('root'));

    function LocalizationWrapper() {

        const [locale, setLocale] = useState(languageWithoutRegionCode);
        const [globalState] = useStore();

        useEffect(() => {
            actions.electron.applicationStarted();
        }, [])

        return <IntlProvider locale={languageWithoutRegionCode} messages={localeData[locale] || localeData[language] || localeData.fr}>
            <SnackbarProvider>
                <App
                    onLocaleChange={(locale) => { setLocale(locale) }}
                />
            </SnackbarProvider>
        </IntlProvider>
    }

    root.render(
        <StoreProvider
            globalState={initGlobalState}>
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <LocalizationWrapper />
                </ThemeProvider>
            </MemoryRouter>
        </StoreProvider>
    );
})();