import Action from '../actions';
import Api from '../api';
import { put, takeEvery } from 'redux-saga/effects'

export default function* newKicadlibFile(data) {
    try{
        yield put({type : Action.kicad_file.KICAD_READ_LIBRARIE_SUCCESS , data : { filename : "mylibrarie.lib" , data : "" }});

    }catch (e) {
        console.error(e);
        yield put({ type: Action.kicad_file.KICAD_READ_LIBRARIE_ERROR })
    }
}