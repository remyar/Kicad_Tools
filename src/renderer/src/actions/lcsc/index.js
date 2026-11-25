export default {
    getComponent: async (url) => {
        let result = await window.electron.ipcRenderer.invoke("api.lcsc.getComponent", { url: url });
        return { component: result }
    },
    getSymbol: async (component) => {
        let result = await window.electron.ipcRenderer.invoke("api.lcsc.getSymbol", { component: component });
    }
}