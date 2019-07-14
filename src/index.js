import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { routerMiddleware , ConnectedRouter } from 'connected-react-router';
import { createHashHistory   } from 'history';
import { IntlProvider, addLocaleData } from 'react-intl';

import 'typeface-roboto';

import reducers from './reducers';
import sagas from './sagas';
import App from './app';

const myTheme = createMuiTheme();
const history = createHashHistory();

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// i18n datas
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import it from 'react-intl/locale-data/it';
// Our translated strings
import localeData from './locales/data.json';

addLocaleData([...en, ...es, ...fr, ...it]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;
 
// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
 
// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

let store = createStore( reducers(history) , applyMiddleware(sagaMiddleware , routerMiddleware(history)) );
sagaMiddleware.run(sagas)

// store as GLOBAL
//window.__redux__ = store;

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale={language} messages={messages}>
            <MuiThemeProvider theme={myTheme}>
                <ConnectedRouter history={history}>
                    <App />
                </ConnectedRouter>
            </MuiThemeProvider>
        </IntlProvider>
    </Provider>
, document.getElementById('root'));