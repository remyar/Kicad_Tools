import fetch from 'electron-fetch';

export default function get(url, config = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(url , { ...config , useElectronNet : false , signal: controller.signal});

            clearTimeout(id);
            let r = await response.text();
            resolve(r)
        } catch (err) {
            reject(err);
        }
    });
}
