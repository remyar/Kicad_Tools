import Action from '../actions';
import Api from '../api';
import { put, takeEvery } from 'redux-saga/effects'

export default function* getKicadBomPro(data) {
    try{
        let fileList = { components : [] , bom : {} };
        let fileExt = { name : "Kicad Project .pro" , extensions : ["pro"] };

        let filesList = yield Api.File.openDialog(fileExt);
        let path = filesList[0].substring(0,filesList[0].lastIndexOf("\\"));
        let listingOfFile = yield Api.File.getList(path , ".sch")
        let dataStringTab = yield Api.File.readList(listingOfFile);

        dataStringTab.map((str) => {
            let components = str.split('$EndComp');

            components.map((compo) => {
                line = line.replace('\r','');

            });
        });

        yield put({type : Action.kicad_file.KICAD_CREATE_BOM_SUCCESS , data : fileList.bom });
    }catch (e) {
        console.error(e);
        yield put({ type: Action.kicad_file.KICAD_CREATE_BOM_ERROR })
    }
}