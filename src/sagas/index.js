import '@babel/polyfill'
import Action from '../actions';
import { put, takeEvery } from 'redux-saga/effects'
import KicadBom from './kicad_bom';
import ExportBom from './export_bom';

export default function* root() {
    yield takeEvery(Action.kicad_file.KICAD_CREATE_BOM_START, KicadBom);
    yield takeEvery(Action.export_file.EXPORT_FILE_START, ExportBom);
}