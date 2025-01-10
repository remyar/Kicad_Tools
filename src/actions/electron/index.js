const electron = require('@electron/remote')
import fs from 'fs';
import path from 'path';

export default {
    getFilenameForSave: async (extensions) => {
        if (typeof extensions == 'string') {
            extensions = [extensions];
        }
        try {
            let filters = [];
            for (let _ext of extensions) {
                filters.push({
                    name: _ext.replace('.', ''),
                    extensions: [_ext.replace('.', '')]
                })
            }
            let resp = await electron.dialog.showSaveDialog({
                title: "Save librarie file",
                defaultPath: "librarie",
                buttonLabel: "Save",

                filters: filters
            });

            let response = {
                canceled: resp.canceled,
                filePath: resp.filePath
            }

            return {
                getFilenameForSave: response
            };

        } catch (err) {
            throw { message: err.message };
        }
    },
    writeFile: async (_filepath, _data) => {

        async function _saveFile(p, filename, data) {
            if (fs.existsSync(p) == false) {
                fs.mkdirSync(p, { recursive: true });
            }

            if (fs.existsSync(p) == true) {
                fs.writeFileSync(path.resolve(p, filename.replace('\\', '_').replace('/', '_')), data);
            }
        }

        try {

            let filename = _filepath.replace(/^.*[\\\/]/, '');
            let filepath = _filepath.replace(filename, '');

            await _saveFile(filepath, filename, _data);

        } catch (err) {
            throw { message: err.message };
        }
    },
    getFilenameForOpen: async (extensions) => {
        if (typeof extensions == 'string') {
            extensions = [extensions];
        }
        try {
            let filters = [];

            for (let _ext of extensions) {
                filters.push({
                    name: _ext.replace('.', ''),
                    extensions: [_ext.replace('.', '')]
                })
            }

            let resp = await electron.dialog.showOpenDialog({
                properties: ['openFile'], filters: filters
            });

            let response = {
                canceled: resp.canceled,
                filePath: resp.filePaths[0]
            }

            return {
                getFilenameForOpen: response
            };

        } catch (err) {
            throw { message: err.message };
        }
    },
    readFile: async (filepath) => {
        try {
            let data = fs.readFileSync(filepath, "utf-8");

            return {
                fileData: data
            }
        } catch (err) {
            return {
                fileData: undefined
            }
        }
    }
}