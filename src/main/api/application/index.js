import electron from 'electron';
import fs from 'fs';

export default {
    getFilenameForOpen: async (value, _mainWindow) => {
        try {
            let path = await electron.dialog.showOpenDialog(_mainWindow, {
                properties: ['openFile'], filters: value,
            })
            return path;
        } catch (err) {
            throw err;
        }
    },
    getFilenameForSave : async ( value , _mainWindow) => {
        try {
            let _path = await electron.dialog.showSaveDialog(_mainWindow, {
                 filters: value,
            })
            return _path;
        } catch (err) {
            throw err;
        } 
    },
    readFile: async (filepath) => {
        try {
            let fileContent = fs.readFileSync(filepath);
            return fileContent;
        } catch (err) {
            throw err;
        }
    }
}