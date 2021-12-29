import createAction from '../../middleware/actions';
import fs from 'fs';
import path from 'path';
export async function readFile(filepath , { extra, getState }) {

    try {
        let data = fs.readFileSync(filepath, "utf-8");

        return {
            fileData : data
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(readFile);