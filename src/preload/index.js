import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import Store from '../main/store';

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('store', Store);
    } catch (error) {
        console.error(error)
    }
} else {
    window.electron = electronAPI;
    window.store = Store;
}