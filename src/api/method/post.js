import fetch from 'electron-fetch';

export default function post(url, data) {
    return new Promise(async (resolve, reject) => {
        try {

            /*
            var formData = new FormData(); //--{ username : process.env.REACT_APP_SNAPEDA_LOGIN , password : process.env.REACT_APP_SNAPEDA_PASSWORD })

            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            })
*/

var formBody = [];
for (var property in data) {
  var encodedKey = encodeURIComponent(property);
  var encodedValue = encodeURIComponent(data[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");


            const response = await fetch(url, {
                method: 'POST', body: formBody, useElectronNet: false,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            let r = await response.text();
            resolve(r);
        } catch (err) {
            reject(err);
        }
    });
}