import '@babel/polyfill'
import Action from '../actions';
import { AUTOUPDATER_START_UPDATE } from '../actions/autoUpdater';
import { put, takeEvery } from 'redux-saga/effects'
import KicadBom from './kicad_bom';
import KicadPro from './kicad_pro';
import ExportBom from './export_bom';
import AutoUpdaterSaga from './autoUpdater';

export default function* root() {
    yield takeEvery(AUTOUPDATER_START_UPDATE ,AutoUpdaterSaga )
    yield takeEvery(Action.kicad_file.KICAD_CREATE_BOM_START, KicadBom);
    yield takeEvery(Action.kicad_file.KICAD_CREATE_BOM_PRO_START, KicadPro);
    yield takeEvery(Action.export_file.EXPORT_FILE_START, ExportBom);
}