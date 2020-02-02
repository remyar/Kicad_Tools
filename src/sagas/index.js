import '@babel/polyfill'
import Action from '../actions';
import { AUTOUPDATER_START_UPDATE } from '../actions/autoUpdater';
import { put, takeEvery } from 'redux-saga/effects'
import KicadBom from './kicad_bom';
import KicadPro from './kicad_pro';
import ExportBom from './export_bom';
import KicadLibOpen from './kicad_librarie.open';
import KicadLibCreate from './kicad_librarie.create';
import KicadLibSave from './kicad_librarie.save';
import AutoUpdaterSaga from './autoUpdater';
import Github from './github';

export default function* root() {
    yield takeEvery(AUTOUPDATER_START_UPDATE ,AutoUpdaterSaga )
    yield takeEvery(Action.kicad_file.KICAD_CREATE_BOM_START, KicadBom);
    yield takeEvery(Action.kicad_file.KICAD_CREATE_BOM_PRO_START, KicadPro);
    yield takeEvery(Action.export_file.EXPORT_FILE_START, ExportBom);
    yield takeEvery(Action.github.GET_GITHUB_COMPONENT_START, Github);
    yield takeEvery(Action.github.GET_ALL_GITHUB_CATEGORIES_START, Github);
    yield takeEvery(Action.kicad_file.KICAD_READ_LIBRARIE_START, KicadLibOpen);
    yield takeEvery(Action.kicad_file.KICAD_NEW_LIBRARIE_START, KicadLibCreate);
    yield takeEvery(Action.kicad_file.KICAD_SAVE_LIBRARIE_START, KicadLibSave);
}