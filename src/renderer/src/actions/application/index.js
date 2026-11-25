export default {
    setApplicationOnline: async (value = false) => {
        return { application: { isOnline: value } };
    },
    setApplicationBusy: async (value = false) => {
        return { application: { busy: value } };
    },
    setApplicationMode: async (value = "prod") => {
        let result = await window.electron.ipcRenderer.invoke("application.setMode", value);
        return { application: { mode: value } };
    },
    restartApp: async () => {
        await window.electron.ipcRenderer.invoke("application.restart");
    },
    getFilenameForSave: async (extensions) => {
        if (typeof extensions == 'string') {
            extensions = [extensions];
        }
        let filters = [];

        if (extensions.name != undefined && extensions.extensions != undefined) {
            extensions = [extensions];
        }

        for (let _ext of extensions) {
            filters.push({
                name: _ext.name || _ext.replace('.', ''),
                extensions: _ext.extensions || [_ext.replace('.', '')]
            })
        }

        try {
            let response = await window.electron.ipcRenderer.invoke("api.application.getFilenameForSave", filters);
            return { getFilenameForSave: response };
        } catch (err) {
            throw err;
        }
    },
    ProcessAction: async (device, action, params) => {
        try {
            let result = await window.electron.ipcRenderer.invoke("api.application.ProcessAction", {
                device: device,
                action: action,
                params: params
            });
            return result;
        } catch (err) {
            throw err
        }
    },
}