import Action from '../actions';
import Api from '../api';
import { put, takeEvery } from 'redux-saga/effects'
import eagleConvert from './eagle.convert';
import eagle2kicad from './eagle2kicad';

export default function* getEaglelibFile(data) {
    try {
        let fileExt = { name: "Kicad Librarie .lib", extensions: ["lib"] };
        let filesList = yield Api.File.openDialog(fileExt);
        let dataString = "";
        if (filesList.length > 0) {
            dataString = yield Api.File.read(filesList[0]);

            let eagleComponent = yield eagleConvert(dataString);

            let kicadSymbol = yield eagle2kicad.convertComponent(eagleComponent);

            let filename = yield Api.File.saveDialog();

            yield Api.File.write(filename, kicadSymbol);

            let kicadFootprints = yield eagle2kicad.convertFootprint(eagleComponent);

            let filename2 = yield Api.File.saveDialog({ name: "Kicad .kicad_mod", extensions: ["kicad_mod"] });

            yield Api.File.write(filename2, kicadFootprints[0]);

            yield put({ type: Action.eagle_library.EAGLE_CONVERT_LIB_SUCCESS });
        }


    } catch (e) {
        console.error(e);
        yield put({ type: Action.eagle_library.EAGLE_CONVERT_LIB_ERROR });
    }
}