import createAction from '../../middleware/actions';

export async function getFilenameForSave(extensions, { extra, getState }) {

    let electron = extra.electron;

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
            canceled : resp.canceled,
            filePath : resp.filePath
        }

        return {
            getFilenameForSave: response
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFilenameForSave);