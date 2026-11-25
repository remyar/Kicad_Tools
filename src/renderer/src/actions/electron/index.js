export default {
    applicationStarted: async () => {
        await window.electron.ipcRenderer.invoke("application.started");
    }
}