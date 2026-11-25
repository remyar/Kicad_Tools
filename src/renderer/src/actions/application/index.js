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
    restartApp : async ()=>{
        await window.electron.ipcRenderer.invoke("application.restart");
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