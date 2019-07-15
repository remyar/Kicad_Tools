
import electron from 'electron';
export const AUTOUPDATER_UPDATE_AVAILABLE = "AUTOUPDATER_UPDATE_AVAILABLE";
export const AUTOUPDATER_START_UPDATE = "AUTOUPDATER_START_UPDATE";
export const AUTOUPDATER_UPDATE_SUCESS = "AUTOUPDATER_UPDATE_SUCESS";

export default function (dispatch, getState) {

    electron.ipcRenderer.on('update-available', (event , message) => {
        console.log(message)
        dispatch({type : AUTOUPDATER_UPDATE_AVAILABLE , message });
    });

    electron.ipcRenderer.on('download-progress', (event , message) => {
        console.log(message)
        dispatch({type : AUTOUPDATER_START_UPDATE , message });
        
    });
    
    electron.ipcRenderer.on('update-downloaded', (event , message) => {
        console.log(message)
        dispatch({type : AUTOUPDATER_UPDATE_SUCESS , message });
    });
}