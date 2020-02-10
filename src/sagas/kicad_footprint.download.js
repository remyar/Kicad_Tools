import Action from '../actions';
import Api from '../api';
import { put, takeEvery } from 'redux-saga/effects'

export default function* KicadDownloadFootprint(data) {
    try{
        yield Api.Github.downloadAllFootprint( data.path , data.allComponents);
    }catch (e) {
        console.error(e);
        yield put({ type: Action.kicad_file.KICAD_DOWNLOAD_FOOTPRINT_ERROR })
    }
}