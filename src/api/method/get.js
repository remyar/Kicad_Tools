import fetch from 'electron-fetch';

export default function get(url, config = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url , { ...config , useElectronNet : false});
            let r = await response.text();
            resolve(r)
        } catch (err) {
            reject(err);
        }
        /*
                fetch(url)
                    .then(function (response) {
                        if (response.status >= 400) {
                            throw new Error("Bad response from server");
                        }
                        resolve(response.body)
                    })
                    .then(function (stories) {
                        console.log(stories);
                    });*/
    });
}
