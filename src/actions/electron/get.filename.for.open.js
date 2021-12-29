import createAction from '../../middleware/actions';

export async function getFilenameForOpen(extensions, { extra, getState }) {

    let electron = extra.electron;

    if ( typeof extensions == 'string'){
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
            canceled : resp.canceled,
            filePath : resp.filePaths[0]
        }

        return {
            getFilenameForOpen: response
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFilenameForOpen);