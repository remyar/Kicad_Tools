import AutoUpdater from '../actions/autoUpdater';
import { put, takeEvery } from 'redux-saga/effects'

export default function* AutoUpdaterSaga(data) {

    try{
        yield put({ type: AutoUpdater.AUTOUPDATER_START_UPDATE , data : data.bom });
    } catch (e) {
        console.error(e);
        yield put({ type: AutoUpdater.EXPORT_FILE_ERROR , data : { status : e.message , time : new Date().getTime() }});
    }
}

