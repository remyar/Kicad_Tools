import electron from 'electron';

electron.ipcRenderer.on('init-settings', (event , message) => {
    console.log(message)
});