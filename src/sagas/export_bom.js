import Action from '../actions';
import Api from '../api';
import { put, takeEvery } from 'redux-saga/effects'

export default function* getKicadBom(data) {
    try{
        switch ( data.format ){
            case "pdf" :{
                let bom = data.bom;
                yield Api.Pdf.exportBom(bom);
                break;
            }
        }

        yield put({ type: Action.export_file.EXPORT_FILE_SUCCESS , data : data.bom });
    } catch (e) {
        console.error(e);
        yield put({ type: Action.export_file.EXPORT_FILE_ERROR , data : { status : e.message , time : new Date().getTime() }})
    }
}