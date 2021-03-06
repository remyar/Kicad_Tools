import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { routerMiddleware , ConnectedRouter } from 'connected-react-router';
import { createHashHistory   } from 'history';
import { IntlProvider, addLocaleData } from 'react-intl';
import { SnackbarProvider } from 'notistack';

import translate from './locales/translate';

import 'typeface-roboto';

import reducers from './reducers';
import sagas from './sagas';
import App from './app';

const myTheme = createMuiTheme();
const history = createHashHistory();

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// i18n datas
//import en from 'react-intl/locale-data/en';
//import es from 'react-intl/locale-data/es';
//import fr from 'react-intl/locale-data/fr';
//import it from 'react-intl/locale-data/it';
// Our translated strings
//import localeData from './locales/data.json';

import autoUpdater from './actions/autoUpdater';

let store = createStore( reducers(history) , applyMiddleware(sagaMiddleware , routerMiddleware(history)) );
autoUpdater(store.dispatch, store.getState);

sagaMiddleware.run(sagas)

// store as GLOBAL
window.__redux__ = store;

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale={translate.getLanguage()} messages={translate.getMessages()}>
            <MuiThemeProvider theme={myTheme}>
                <ConnectedRouter history={history}>
                    <SnackbarProvider maxSnack={3} >
                        <App />
                    </SnackbarProvider>
                </ConnectedRouter>
            </MuiThemeProvider>
        </IntlProvider>
    </Provider>
, document.getElementById('root'));