export default {
    getComponent: async (url) => {
        let result = await window.electron.ipcRenderer.invoke("api.lcsc.getComponent", { url: url });
        return { component: result }
    },
    getSymbol: async (component) => {
        let result = await window.electron.ipcRenderer.invoke("api.lcsc.getSymbol", { component: component });
        return { symbol: result }
    },
    getFootprint: async (component) => {
        let result = await window.electron.ipcRenderer.invoke("api.lcsc.getFootprint", { component: component });
        return { footprint: result }
    },
}