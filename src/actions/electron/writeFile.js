import createAction from '../../middleware/actions';
import fs from 'fs';
import path from 'path';

export async function writeFile(_filepath, _data, { extra, getState }) {

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
}

export default createAction(writeFile);