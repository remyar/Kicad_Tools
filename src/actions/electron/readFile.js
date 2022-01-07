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
        return {
            fileData : undefined
        }
    }
}

export default createAction(readFile);