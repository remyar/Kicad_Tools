import Action from '../actions';
import Api from '../api';
import { put, takeEvery } from 'redux-saga/effects'




export default function* saveKicadlibFile(data) {
    try {
        let filename = data.filename;
        let existingComponents = data.existingComponents;
        let components = data.data;
        let fileExt = { name: "Kicad Librarie .lib", extensions: ["lib"] };
        if (filename == undefined || filename.length == 0 || filename.startsWith("mylibrarie.lib") == true) {
            filename = yield Api.File.saveDialog(fileExt);
        }

        let allText = yield Api.Github.getAllComponents(components);

        function mergeComponents(components) {
            return new Promise((resolve, reject) => {

                let lines = [];

                lines.push("EESchema-LIBRARY Version 2.3");
                lines.push("#encoding utf-8");

                if (existingComponents && existingComponents.length != 0) {
                    existingComponents.split('\n').map((_line) => {
                        _line = _line.replace("\r", "");
                        if (!_line.startsWith("#") && !_line.startsWith("EESchema")) {
                            lines.push(_line);
                        }
                    });
                }

                components.map((component) => {
                    component.split("\n").map((_line) => {
                        _line = _line.replace("\r", "");
                        if (!_line.startsWith("#") && !_line.startsWith("EESchema")) {
                            lines.push(_line);
                        }
                    });
                });

                lines.push("#");
                lines.push("#End Library");


                resolve(lines.join("\n"));
            });
        }

        let text = yield mergeComponents(allText);

        yield Api.File.write(filename, text);

        yield put({ type: Action.kicad_file.KICAD_READ_LIBRARIE_SUCCESS, data: { filename: filename, data: text } });

    } catch (e) {
        console.error(e);
        yield put({ type: Action.kicad_file.KICAD_READ_LIBRARIE_ERROR })
    }
}