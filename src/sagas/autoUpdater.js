import {AUTOUPDATER_START_UPDATE , AUTOUPDATER_UPDATE_ERROR } from '../actions/autoUpdater';
import { put, takeEvery } from 'redux-saga/effects'

export default function* AutoUpdaterSaga(data) {

    try{
        //yield put({ type: AUTOUPDATER_START_UPDATE , data : data.bom });
        //console.log("ici")
    } catch (e) {
        console.error(e);
        yield put({ type: AUTOUPDATER_UPDATE_ERROR , data : { status : e.message , time : new Date().getTime() }});
    }
}

