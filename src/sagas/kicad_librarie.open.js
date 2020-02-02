import Action from '../actions';
import Api from '../api';
import { put, takeEvery } from 'redux-saga/effects'

export default function* getKicadlibFile(data) {
    try{
        let fileExt = { name : "Kicad Librarie .lib" , extensions : ["lib"] };
        let filesList = yield Api.File.openDialog(fileExt);
        let dataString = "";
        if ( filesList.length > 0 ){
            dataString = yield Api.File.read(filesList[0]);
        }

        yield put({type : Action.kicad_file.KICAD_READ_LIBRARIE_SUCCESS , data : { filename : filesList[0] ? filesList[0] : "" , data : dataString }});

    }catch (e) {
        console.error(e);
        yield put({ type: Action.kicad_file.KICAD_READ_LIBRARIE_ERROR })
    }
}